@echo off
cd /d C:\xampp\htdocs\klunting-bot

echo [%date% %time%] Mulai eksekusi script...

rem echo [%date% %time%] Menghapus folder auth...
rem if exist auth (
rem     rmdir /s /q auth
rem     echo [%date% %time%] Folder auth berhasil dihapus.
rem ) else (
rem     echo [%date% %time%] Folder auth tidak ditemukan.
rem )

echo [%date% %time%] Menjalankan Klunting Bot...
node index.js

echo [%date% %time%] Proses Klunting Bot selesai.
pause