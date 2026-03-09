@echo off
setlocal enabledelayedexpansion

cd /d "C:\Users\varsh\Downloads\brandcraft-vscode (1)"

echo.
echo ============================================================
echo Git Commit Script for brainy_bots Repository
echo ============================================================
echo.

REM Check current status
echo Current Status:
git status --short

echo.
echo ============================================================
echo Staging all changes...
echo ============================================================
git add -A

echo.
echo ============================================================
echo Creating commit...
echo ============================================================

git commit -m "feat: Add brand selection confirmation with celebration and PDF download" -m "- Enhanced App.jsx with motivational messages array" -m "- Added celebration modal with confetti animation for completing all selections" -m "- Implemented selection progress tracking in Dashboard" -m "- Added PDF download option for complete brand package" -m "- Includes congratulations modal with random celebration messages" -m "- Confetti effects for both individual selections and completion" -m " " -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo ============================================================
echo Commit Log (Last 3 commits):
echo ============================================================
git log --oneline -3

echo.
echo ============================================================
echo SUCCESS! Commit completed for brainy_bots repository
echo ============================================================
echo Repository: https://github.com/varshithamiriyala/brainy_bots.git
echo.

endlocal
