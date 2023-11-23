#!/bin/bash

# Get the current working directory
root_dir=$(pwd)

# Define the source file and destination directory
source_file="${root_dir}/pre-push"
destination_dir="${root_dir}/.git/hooks"

# Check if the source file exists
if [ ! -f "$source_file" ]; then
    echo "Error: 'pre-push' file not found in the root directory."
    exit 1
fi

# Create the destination directory if it doesn't exist
mkdir -p "$destination_dir"

# Define the destination file path
destination_file="${destination_dir}/pre-push"

# Copy the file to the destination
cp "$source_file" "$destination_file"

# Check if the copy was successful
if [ $? -eq 0 ]; then
    echo "Success: 'pre-push' file copied to '.git/hooks/' directory."
else
    echo "Error: Failed to copy 'pre-push' file to '.git/hooks/' directory."
    exit 1
fi

