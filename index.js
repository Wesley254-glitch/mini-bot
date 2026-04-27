const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', msg => {
    if (msg.body === '!ping') {
        msg.reply('pong');
    }
});

async function getCode() {
    const pairingCode = await client.requestPairingCode('254738550932');
    console.log('PAIRING CODE:', pairingCode);
}

client.on('qr', () => {
    getCode();
});

client.initialize();
