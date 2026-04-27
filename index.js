const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const express = require('express')
const app = express()
const pino = require('pino')

app.get('/', (req, res) => res.send('Bot online ✅'))
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server running'))

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({ 
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true
    })
    
    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update
        if(qr) console.log('SCAN THIS QR:', qr)
        if(connection === 'open') console.log('Bot connected ✅')
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if(!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if(text?.toLowerCase() === 'ping') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'pong 🏓' })
        }
    })
}
startBot()
