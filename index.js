const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: puppeteer.executablePath(),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ]
    }
});

const botName = 'Mini Bot';
const friends = ['254738550932'];

function randomReply(options) {
    return options[Math.floor(Math.random() * options.length)];
}

async function emulateTyping(chat, ms = 1200) {
    if (chat && typeof chat.sendStateTyping === 'function') {
        await chat.sendStateTyping();
        await new Promise(resolve => setTimeout(resolve, ms));
    }
}

client.on('qr', async () => {
    console.log('QR received. Please scan it with WhatsApp to pair the bot.');
});

client.on('ready', () => {
    console.log(`${botName} is ready!`);
    client.sendPresenceAvailable();

    setInterval(() => {
        try {
            client.sendPresenceAvailable();
        } catch (err) {
            console.error('Presence update failed:', err.message);
        }
    }, 60000);
});

client.on('message', async (msg) => {
    if (msg.fromMe || msg.isStatus) return;

    const sender = msg.from
        .replace('@c.us', '')
        .replace('@s.whatsapp.net', '');

    const text = (msg.body || '').trim();
    if (!text) return;

    try {
        await msg.markSeen();
    } catch (err) {
        console.error('Could not mark message as seen:', err.message);
    }

    const shouldReplyToAll = true;
    if (!shouldReplyToAll && !friends.includes(sender)) {
        return;
    }

    const lower = text.toLowerCase();
    await emulateTyping(msg.chat, 900);

    if (lower === '!ping') {
        return msg.reply('pong');
    }

    if (lower === '!help' || lower === 'help') {
        return msg.reply('Commands:\n!ping\n!help\n!joke\n!time\n!date\n!status\nHi / Hello / Hey');
    }

    if (lower === '!joke' || lower === 'joke') {
        return msg.reply(randomReply([
            'Why do programmers prefer dark mode? Because light attracts bugs!',
            'I would tell you a UDP joke, but you might not get it.',
            'A bug walked into a bar and said, “I am just here for the bytes.”'
        ]));
    }

    if (lower === '!time' || lower === 'time') {
        return msg.reply(`The current time is: ${new Date().toLocaleTimeString()}`);
    }

    if (lower === '!date' || lower === 'date') {
        return msg.reply(`Today is: ${new Date().toLocaleDateString()}`);
    }

    if (lower === '!status' || lower === 'status') {
        return msg.reply(`${botName} is online, active, and ready to reply.`);
    }

    if (['hi', 'hello', 'hey', 'hello there', 'hi there'].includes(lower)) {
        return msg.reply('Hello! I am your WhatsApp bot. How can I help?');
    }

    if (lower.includes('how are you')) {
        return msg.reply('I am doing great and ready to assist you!');
    }

    if (lower.includes('weather')) {
        return msg.reply('I cannot check live weather right now, but I can help with other things.');
    }

    if (lower.includes('love') || lower.includes('miss')) {
        return msg.reply(randomReply([
            'Aww, that is sweet 💙',
            'I appreciate that! ����',
            'That made my day!'
        ]));
    }

    if (lower.includes('good morning') || lower.includes('good night')) {
        return msg.reply(randomReply([
            'Good vibes to you too!',
            'Enjoy your day! ☀️',
            'Sleep well and sweet dreams! 🌙'
        ]));
    }

    return msg.reply(randomReply([
        'I received your message and I am here for you! 💬',
        'I heard you! Let me know how I can help.',
        'Message received! I am online and ready.',
        'Thanks for the message! 😊'
    ]));
});

client.initialize();
