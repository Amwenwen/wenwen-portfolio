@echo off
echo ================================
echo  Wenwen Portfolio - Git Deploy
echo ================================

cd /d "D:\website portfolio"

echo [1/7] Removing old .git folder...
rmdir /s /q ".git"

echo [2/7] Fresh git init...
git init

echo [3/7] Setting safe directory...
git config --global --add safe.directory "D:/website portfolio"

echo [4/7] Setting user info...
git config user.email "wenwentenio@gmail.com"
git config user.name "Amwenwen"

echo [5/7] Staging all files...
git add .

echo [6/7] Committing...
git commit -m "Initial commit - Wenwen Portfolio"

echo [7/7] Pushing to GitHub...
git branch -M main
git remote add origin https://github.com/Amwenwen/wenwen-portfolio.git
git push -u origin main

echo.
echo ================================
echo  Done! Check GitHub to confirm.
echo ================================
pause
