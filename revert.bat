@echo off
echo ==============================================
echo ELNILE - Reverting Folder Structure
echo ==============================================
echo.
echo This script will delete the css/ and js/ folders,
echo remove reorganize.bat, and restore the project to
echo its exact flat layout.
echo.
pause

:: 1. Delete css and js folders
rmdir /S /Q "css" 2>nul
rmdir /S /Q "js" 2>nul

:: 2. Delete reorganize.bat
del "reorganize.bat" 2>nul

echo.
echo ==============================================
echo Success: Project reverted to flat layout!
echo ==============================================
echo.
pause
del "%~f0"
