@echo off

rem Get the current working directory
set "root_dir=%cd%"

rem Define the source file and destination directory
set "source_file=%root_dir%\pre-push"
set "destination_dir=%root_dir%\.git\hooks"

rem Check if the source file exists
if not exist "%source_file%" (
    echo Error: 'pre-push' file not found in the root directory.
    exit /b 1
)

rem Create the destination directory if it doesn't exist
if not exist "%destination_dir%" mkdir "%destination_dir%"

rem Define the destination file path
set "destination_file=%destination_dir%\pre-push"

rem Copy the file to the destination
copy "%source_file%" "%destination_file%"

rem Check if the copy was successful
if %errorlevel% equ 0 (
    echo Success: 'pre-push' file copied to '.git\hooks\' directory.
) else (
    echo Error: Failed to copy 'pre-push' file to '.git\hooks\' directory.
    exit /b 1
)

