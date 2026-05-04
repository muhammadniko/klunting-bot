@echo off

cd /d C:\xampp\htdocs\klunting-bot

color 0e

title WhatsApp Connect - Klunting App

echo  _  ___     _    _ _   _ _______ _____ _   _  _____ 
echo ^| ^|/ / ^|   ^| ^|  ^| ^| \ ^| ^|__   __^|_   _^| \ ^| ^|/ ____^|
echo ^| ' /^| ^|   ^| ^|  ^| ^|  \^| ^|  ^| ^|    ^| ^| ^|  \^| ^| ^|  __ 
echo ^|  ^< ^| ^|   ^| ^|  ^| ^| . ` ^|  ^| ^|    ^| ^| ^| . ` ^| ^| ^|_ ^|
echo ^| . \^| ^|___^| ^|__^| ^| ^|\  ^|  ^| ^|   _^| ^|_^| ^|\  ^| ^|__^| ^|
echo ^|_^|\_\______\____/^|_^| \_^|  ^|_^|  ^|_____^|_^| \_^|\_____^|
echo.
echo App Versi 1.0 - Build by Niko
echo.                                             
echo.
echo [%date% %time%] Mulai eksekusi script...

echo [%date% %time%] Menghapus folder auth...
if exist auth (
     rmdir /s /q auth
     echo [%date% %time%] Folder auth berhasil dihapus.
 ) else (
     echo [%date% %time%] Folder auth tidak ditemukan.
 )

echo [%date% %time%] Menjalankan Klunting Bot...
echo.
echo.
node index.js

echo [%date% %time%] Proses Klunting Bot selesai.
echo.
pause