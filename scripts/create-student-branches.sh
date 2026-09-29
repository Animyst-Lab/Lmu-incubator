#!/usr/bin/env bash
#
# Creates one branch per student on GitHub, from the latest base branch.
#
#   scripts/create-student-branches.sh [--dry-run] [--base <branch>] [roster-file]
#
# The roster (default: roster.txt) has one student per line, "First Last".
# Blank lines and lines starting with # are ignored. Each student gets
# student/<first-name>-<last-initial>, e.g. "Maya Rodriguez" -> student/maya-r.
#
# Safe to re-run: branches that already exist are skipped, so it can add late
# students. Nothing is created if two students would get the same branch.

set -euo pipefail

BASE="main"
DRY_RUN=false
ROSTER="roster.txt"
REMOTE="origin"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true ;;
    --base) BASE="$2"; shift ;;
    -h|--help) sed -n '3,13p' "$0"; exit 0 ;;
    *) ROSTER="$1" ;;
  esac
  shift
done

if [[ ! -f "$ROSTER" ]]; then
  echo "Roster not found: $ROSTER (copy roster.example.txt to roster.txt and add names)" >&2
  exit 1
fi

# "José Álvarez" -> "jose"; strips accents and anything that isn't a letter or digit.
slugify() {
  # macOS iconv exits 1 on a harmless warning while still transliterating, so ignore its status.
  { printf '%s' "$1" | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null || true; } | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9'
}

names=()
branches=()
problems=()

while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%%#*}"
  read -ra words <<< "$line"
  [[ ${#words[@]} -eq 0 ]] && continue
  if [[ ${#words[@]} -lt 2 ]]; then
    problems+=("\"${words[*]}\" needs a first and last name.")
    continue
  fi
  first="$(slugify "${words[0]}")"
  last="$(slugify "${words[${#words[@]}-1]}")"
  if [[ -z "$first" || -z "$last" ]]; then
    problems+=("\"${words[*]}\" doesn't make a usable branch name.")
    continue
  fi
  names+=("${words[*]}")
  branches+=("student/${first}-${last:0:1}")
done < "$ROSTER"

# Two students with the same first name and last initial would share a branch.
dupes="$(printf '%s\n' "${branches[@]+"${branches[@]}"}" | sort | uniq -d)"
if [[ -n "$dupes" ]]; then
  while IFS= read -r d; do
    who=()
    for i in "${!branches[@]}"; do [[ "${branches[$i]}" == "$d" ]] && who+=("${names[$i]}"); done
    problems+=("$(IFS=,; echo "${who[*]}") would all get $d. Add more of the last name to tell them apart, e.g. \"Maya Ro\".")
  done <<< "$dupes"
fi

if [[ ${#problems[@]} -gt 0 ]]; then
  echo "Fix the roster first. Nothing was created." >&2
  printf '  - %s\n' "${problems[@]}" >&2
  exit 1
fi

if [[ ${#branches[@]} -eq 0 ]]; then
  echo "The roster is empty." >&2
  exit 1
fi

git fetch --quiet "$REMOTE" "$BASE"

created=0
skipped=0
printf '%-32s %s\n' "STUDENT" "BRANCH"
for i in "${!branches[@]}"; do
  branch="${branches[$i]}"
  if git ls-remote --exit-code --heads "$REMOTE" "$branch" >/dev/null 2>&1; then
    status="(already exists)"
    skipped=$((skipped + 1))
  elif $DRY_RUN; then
    status="(would create)"
  else
    git push --quiet "$REMOTE" "refs/remotes/$REMOTE/$BASE:refs/heads/$branch"
    status="(created)"
    created=$((created + 1))
  fi
  printf '%-32s %s %s\n' "${names[$i]}" "$branch" "$status"
done

echo
if $DRY_RUN; then
  echo "Dry run: nothing was created. $skipped already exist."
else
  echo "Created $created branch(es) from $REMOTE/$BASE. $skipped already existed."
fi
