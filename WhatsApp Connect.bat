@echo off
cd /d C:\xampp\htdocs\klunting-bot

echo [%date% %time%] Mulai eksekusi script...

echo [%date% %time%] Menghapus folder auth...
if exist auth (
     rmdir /s /q auth
     echo [%date% %time%] Folder auth berhasil dihapus.
 ) else (
     echo [%date% %time%] Folder auth tidak ditemukan.
 )

echo [%date% %time%] Menjalankan Klunting Bot...
node index.js

echo [%date% %time%] Proses Klunting Bot selesai.
pause