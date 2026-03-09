#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir(r"C:\Users\varsh\Downloads\brandcraft-vscode (1)")

# Check git status
print("=" * 60)
print("Git Status:")
print("=" * 60)
result = subprocess.run(["git", "status"], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)

# Add all changes
print("\n" + "=" * 60)
print("Adding all changes...")
print("=" * 60)
result = subprocess.run(["git", "add", "-A"], capture_output=True, text=True)
if result.stdout:
    print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)

# Commit with message
commit_message = """feat: Add brand selection confirmation with celebration and PDF download

- Enhanced App.jsx with motivational messages array
- Added celebration modal with confetti animation for completing all selections  
- Implemented selection progress tracking in Dashboard
- Added PDF download option for complete brand package
- Includes congratulations modal with random celebration messages
- Confetti effects for both individual selections and completion

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"""

print("\n" + "=" * 60)
print("Creating commit...")
print("=" * 60)
result = subprocess.run(["git", "commit", "-m", commit_message], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)

# Show final status
print("\n" + "=" * 60)
print("Final Git Status:")
print("=" * 60)
result = subprocess.run(["git", "log", "--oneline", "-3"], capture_output=True, text=True)
print(result.stdout)

print("\nCommit completed successfully!")
