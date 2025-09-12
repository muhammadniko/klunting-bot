// index.js
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const qrcode = require('qrcode-terminal');
const P = require('pino');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sock;

const start = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    sock = makeWASocket({
		logger: P({ level: 'silent' }),
        auth: state,
		printQRInTerminal: false,
		browser: ['Official HRGA', 'Chrome', '139.0.1']
    });

    sock.ev.on('creds.update', saveCreds);
	
	sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('?? Scan QR Code ini dengan WhatsApp:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('? Bot tersambung ke WhatsApp!');
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.message || 'Unknown';
            console.log('? Koneksi terputus:', reason);

            const shouldReconnect =
                !lastDisconnect?.error?.output?.statusCode ||
                lastDisconnect.error.output.statusCode !== 401;

            if (shouldReconnect) {
                console.log('?? Mencoba menyambung ulang...');
                start();
            } else {
                console.log('? Tidak bisa reconnect, mungkin karena logout dari HP. Hapus folder auth dan scan ulang QR.');
            }
        }
    });
	
	
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
	});


    app.post('/send-file', async (req, res) => {
    const { number, filePath, caption } = req.body;

    if (!number) {
        return res.status(400).json({ error: 'Nomor WhatsApp wajib diisi' });
    }

    if (typeof filePath !== 'string' || filePath.trim() === '') {
        return res.status(400).json({ error: 'filePath wajib diisi' });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File tidak ditemukan' });
    }

    try {
        const jid = number.replace(/\D/g, '') + '@s.whatsapp.net';
        const buffer = fs.readFileSync(filePath);
        const mimeType = mime.lookup(filePath) || 'application/pdf';
		
		const exists = await sock.onWhatsApp(jid)

        // kalau nomor tidak terdaftar
		if (!exists || exists.length === 0 || !exists[0]?.exists) {
			return res.json({
                status: 'failed',
                message: 'Nomor tidak terdaftar di WhatsApp'
            });
		}
		
        await sock.sendMessage(jid, {
			document: buffer,
            mimetype: mimeType,
            fileName: path.basename(filePath),
            caption: caption || ''
        });

        res.json({ status: 'success', message: 'File berhasil dikirim' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});
};

// Untuk menangani error yang tidak tertangkap
process.on('unhandledRejection', (err) => {
    console.error('?? Unhandled Rejection:', err);
});

start();
app.listen(3000, () => console.log('Baileys API listening on http://localhost:3000'));