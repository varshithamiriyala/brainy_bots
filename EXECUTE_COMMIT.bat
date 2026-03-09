@echo off
setlocal enabledelayedexpansion

REM Set Git executable path
set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

REM Change to repository directory
cd /d "C:\Users\varsh\Downloads\brandcraft-vscode (1)"

echo.
echo ================================================================
echo Commit Script for brainy_bots Repository
echo ================================================================
echo Repository: https://github.com/varshithamiriyala/brainy_bots.git
echo Directory: %CD%
echo.

REM Check Git is available
%GIT_CMD% --version
if errorlevel 1 (
    echo ERROR: Git is not available!
    pause
    exit /b 1
)

echo.
echo ================================================================
echo Current Status:
echo ================================================================
%GIT_CMD% status --short
if errorlevel 1 (
    echo ERROR: Failed to get git status!
    pause
    exit /b 1
)

echo.
echo ================================================================
echo Staging all changes...
echo ================================================================
%GIT_CMD% add -A
if errorlevel 1 (
    echo ERROR: Failed to stage changes!
    pause
    exit /b 1
)

echo Changes staged successfully.

echo.
echo ================================================================
echo Creating commit...
echo ================================================================

%GIT_CMD% commit -m "feat: Add brand selection confirmation with celebration and PDF download" ^
    -m "- Enhanced App.jsx with motivational messages array" ^
    -m "- Added celebration modal with confetti animation for completing all selections" ^
    -m "- Implemented selection progress tracking in Dashboard" ^
    -m "- Added PDF download option for complete brand package" ^
    -m "- Includes congratulations modal with random celebration messages" ^
    -m "- Confetti effects for both individual selections and completion" ^
    -m " " ^
    -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

if errorlevel 1 (
    echo.
    echo Note: Commit may have been created or there may be no changes to commit.
) else (
    echo Commit created successfully!
)

echo.
echo ================================================================
echo Git Log (Last 3 commits):
echo ================================================================
%GIT_CMD% log --oneline -3

echo.
echo ================================================================
echo Final Status:
echo ================================================================
%GIT_CMD% status

echo.
echo ================================================================
echo ✅ COMPLETE! Commit to brainy_bots repository finished.
echo ================================================================
echo Repository: https://github.com/varshithamiriyala/brainy_bots.git
echo.

endlocal
pause
