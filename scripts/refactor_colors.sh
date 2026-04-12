#!/bin/bash

# Define files to process (from previous grep)
FILES=$(grep -rl "amber-" app components --exclude-dir=node_modules --exclude-dir=.next)

for FILE in $FILES; do
  echo "Processing $FILE..."
  # Primary matches
  sed -i '' 's/amber-500/primary/g' "$FILE"
  sed -i '' 's/amber-600/primary-hover/g' "$FILE"
  sed -i '' 's/amber-400/primary/g' "$FILE" # Some use 400 for primary-ish
  
  # Check for other shades if they act as primary
  sed -i '' 's/bg-amber-50/bg-primary\/5/g' "$FILE"
  sed -i '' 's/border-amber-100/border-primary\/20/g' "$FILE"
  sed -i '' 's/text-amber-900/text-primary-hover/g' "$FILE" # Often a darker brand color
done

echo "Refactoring complete."
