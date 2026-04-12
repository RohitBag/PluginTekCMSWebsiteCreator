#!/bin/bash

# Define files to process
FILES=$(grep -rlE "f59e0b|amber-" app components --exclude-dir=node_modules --exclude-dir=.next)

for FILE in $FILES; do
  echo "Processing $FILE..."
  # Replace hex codes in style attributes or JS objects
  sed -i '' "s/#f59e0b/var(--primary)/g" "$FILE"
  # Also handle cases where it might be in uppercase
  sed -i '' "s/#F59E0B/var(--primary)/g" "$FILE"
  
  # Ensure primary classes are correct
  sed -i '' 's/amber-500/primary/g' "$FILE"
  sed -i '' 's/amber-600/primary-hover/g' "$FILE"
done

echo "Refactoring complete."
