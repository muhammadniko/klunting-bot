import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import pino from 'pino'

import express from 'express'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

import { setTimeout } from 'timers/promises'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sock;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const { version, isLatest } = await fetchLatestBaileysVersion() // ambil versi WA terbaru
	
    console.log('Using WA version:', version, 'isLatest:', isLatest)

    sock = makeWASocket({
        version,
		logger: pino({level: 'silent'}),
        auth: state,
        printQRInTerminal: false
    })

    sock.ev.on('connection.update', async(update) => {
        
		const { connection, qr } = update

        if (qr) {
            console.log('Scan QR ini:')
            qrcode.generate(qr, { small: true })
        }

        if (connection === 'open') {
            console.log('WhatsApp Connected!')
        }

        if (connection === 'close') {
            console.log('Koneksi Terputus, Menghubungkan ulang...')
            connectToWhatsApp()
        }
    })

    sock.ev.on('creds.update', saveCreds)
	
	
	// Status WhatsApp Sudah Terhubung atau Belum
	app.get('/status', (req, res) => {
		if (sock?.user) {
			res.json({
				connected: true,
				user: sock.user
			});
		} else {
			res.json({
				connected: false
			});
		}
	})
	
	// Kirim File
	app.post('/send-file', async (req, res) => {
    const { number, filePath, caption } = req.body;

    if (!number) {
        return res.status(400).json({ error: 'Nomor WhatsApp wajib diisi' });
    }

    if (typeof filePath !== 'string' || filePath.trim() === '') {
        return res.status(400).json({ error: 'FilePath wajib diisi' });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File tidak ditemukan' });
    }

    try {
        const nomorWhatsApp = number.replace(/\D/g, '') + '@s.whatsapp.net';
        const buffer = fs.readFileSync(filePath);
        const mimeType = mime.lookup(filePath) || 'application/pdf';
		
		const exists = await sock.onWhatsApp(nomorWhatsApp) //Cek Nomor terdaftar di whatsapp atau tidak

        // kalau nomor tidak terdaftar
		if (!exists || exists.length === 0 || !exists[0]?.exists) {
			return res.json({
                status: 'failed',
                message: 'Nomor tidak terdaftar di WhatsApp'
            });
		}
		
		await sock.sendMessage(nomorWhatsApp, {
			text: caption
		})
		
		await setTimeout(2000)
		
        await sock.sendMessage(nomorWhatsApp, {
			document: buffer,
            mimetype: mimeType,
            fileName: path.basename(filePath),
            caption: ''
        })

        res.json({ status: 'success', message: 'File berhasil dikirim' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});
	
}

connectToWhatsApp()
app.listen(3000, () => console.log('Baileys API listening on http://localhost:3000'));