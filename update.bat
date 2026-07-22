@echo off
cd /d "D:\website portfolio"

echo Setting safe directory...
git config --global --add safe.directory "D:/website portfolio"

echo Removing old .git and starting fresh...
rmdir /s /q ".git"

echo Initializing new repo...
git init

echo Setting user info...
git config user.email "wenwentenio@gmail.com"
git config user.name "Amwenwen"

echo Setting remote...
git remote add origin https://github.com/Amwenwen/wenwen-portfolio.git

echo Staging all files...
git add .

echo Committing...
git commit -m "Full admin dashboard editor - all sections editable"

echo Pushing...
git branch -M main
git push -u origin main --force

echo.
echo ================================
echo  Done! Check GitHub.
echo ================================
pause
