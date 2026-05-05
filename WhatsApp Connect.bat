@echo off

cd /d C:\xampp\htdocs\klunting-bot

color 0e

title WhatsApp Connect - Klunting App
echo.
echo  $$\   $$\ $$\      $$\   $$\ $$\   $$\ $$$$$$$$\ $$$$$$\ $$\   $$\  $$$$$$\  
echo  $$ ^| $$  ^|$$ ^|     $$ ^|  $$ ^|$$$\  $$ ^|\__$$  __^|\_$$  _^|$$$\  $$ ^|$$  __$$\ 
echo  $$ ^|$$  / $$ ^|     $$ ^|  $$ ^|$$$$\ $$ ^|   $$ ^|     $$ ^|  $$$$\ $$ ^|$$ /  \__^|
echo  $$$$$  /  $$ ^|     $$ ^|  $$ ^|$$ $$\$$ ^|   $$ ^|     $$ ^|  $$ $$\$$ ^|$$ ^|$$$$\ 
echo  $$  $$^<   $$ ^|     $$ ^|  $$ ^|$$ \$$$$ ^|   $$ ^|     $$ ^|  $$ \$$$$ ^|$$ ^|\_$$ ^|
echo  $$ ^|\$$\  $$ ^|     $$ ^|  $$ ^|$$ ^|\$$$ ^|   $$ ^|     $$ ^|  $$ ^|\$$$ ^|$$ ^|  $$ ^|
echo  $$ ^| \$$\ $$$$$$$$\\$$$$$$  ^|$$ ^| \$$ ^|   $$ ^|   $$$$$$\ $$ ^| \$$ ^|\$$$$$$  ^|
echo  \__^|  \__^|\________^|\______/ \__^|  \__^|   \__^|   \______^|\__^|  \__^| \______/ 
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