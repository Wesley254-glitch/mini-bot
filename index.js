const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

client.on('qr', async (qr) => {
    console.log('QR received, requesting pairing code...');
    const pairingCode = await client.requestPairingCode('254738550932');
    console.log('PAIRING CODE:', pairingCode);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.fromMe) return;
    if (msg.isStatus) return;

    // Auto-read new incoming messages
    await msg.markSeen();

    const text = (msg.body || '').trim();
    if (!text) return;

    const lower = text.toLowerCase();

    if (lower === '!ping') {
        return msg.reply('pong');
    }

    if (['hi', 'hello', 'hey'].includes(lower)) {
        return msg.reply('Hello! I am your WhatsApp bot. How can I help?');
    }

    if (lower.includes('how are you')) {
        return msg.reply('I am doing well and ready to help!');
    }

    if (lower.includes('weather')) {
        return msg.reply('I cannot check live weather right now, but I can help with other things!');
    }

    // Default automatic reply for incoming messages
    return msg.reply('I received your message and am here!');
});

client.initialize();
