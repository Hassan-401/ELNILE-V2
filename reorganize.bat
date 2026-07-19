@echo off
echo ==============================================
echo ELNILE - Project Structure Reorganization Setup
echo ==============================================
echo.
echo This script will relocate the image assets, copy generated 
echo store images, and delete duplicate flat files from the root.
echo.
pause

:: 1. Create directories
if not exist "assets\images\services" mkdir "assets\images\services"
if not exist "css" mkdir "css"
if not exist "js" mkdir "js"

:: 2. Copy images to assets
xcopy "our images\*" "assets\images\" /E /I /Y
move "assets\images\our services images\*" "assets\images\services\" 2>nul
rmdir /S /Q "assets\images\our services images" 2>nul

:: 3. Copy store generated images from brain folder
copy "C:\Users\hm202\.gemini\antigravity-ide\brain\e948d504-b277-40f6-8ade-63e65d0ac0b1\store_solar_1784124153472.png" "assets\images\store_solar.png" /Y
copy "C:\Users\hm202\.gemini\antigravity-ide\brain\e948d504-b277-40f6-8ade-63e65d0ac0b1\store_pumps_1784124106930.png" "assets\images\store_pumps.png" /Y
copy "C:\Users\hm202\.gemini\antigravity-ide\brain\e948d504-b277-40f6-8ade-63e65d0ac0b1\store_pipes_1784123985886.png" "assets\images\store_pipes.png" /Y

:: 4. Rename hero 3.webp to hero3.webp
move "assets\images\hero 3.webp" "assets\images\hero3.webp" 2>nul

:: 5. Delete old flat files
del styles.css about.css services.css projects.css contact.css store.css 2>nul
del script.js about.js contact.js 2>nul

:: 6. Clean up old directories
rmdir /S /Q "our images" 2>nul
rmdir /S /Q "cloned sources" 2>nul

echo.
echo ==============================================
echo Success: Reorganization complete!
echo ==============================================
echo.
pause
del "%~f0"
