import os
import subprocess
import sys

def copy_pre_push_hook():
    root_dir = os.getcwd()  # Get the current working directory
    source_file = os.path.join(root_dir, 'pre-push')

    # Check if the source file exists
    if not os.path.exists(source_file):
        print("Error: 'pre-push' file not found in the root directory.")
        sys.exit(1)

    # Determine the appropriate script file based on the operating system
    if os.name == 'posix':  # Unix-like systems (Linux, macOS)
        script_file = os.path.join(root_dir, 'setup-hooks.sh')
    elif os.name == 'nt':  # Windows
        script_file = os.path.join(root_dir, 'setup-hooks.bat')
    else:
        print("Error: Unsupported operating system.")
        sys.exit(1)

    try:
        # Execute the shell script
        subprocess.run([script_file], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    copy_pre_push_hook()

