#!/bin/bash

# Starting date for the first commit
START_DATE="2024-11-01T12:00:00"
INCREMENT="+1d" # Increment by 2 days for each commit

# Counter to increment dates
current_date=$START_DATE

# Loop through each commit marked for editing
while true; do
  # Update GIT environment variables with the new date
  export GIT_COMMITTER_DATE="$current_date"
  export GIT_AUTHOR_DATE="$current_date"

  # Amend the current commit with the new date
  git commit --amend --no-edit --date="$current_date"

  # Calculate the next commit date (BSD-compatible)
  current_date=$(date -j -v+2d -f "%Y-%m-%dT%H:%M:%S" "$current_date" +"%Y-%m-%dT%H:%M:%S")

  # Continue to the next commit
  git rebase --continue

  # Break the loop if there are no more commits to rebase
  if [ $? -ne 0 ]; then
    break
  fi
done

echo "Commit dates updated successfully!"
