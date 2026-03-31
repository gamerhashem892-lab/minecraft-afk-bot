const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Stealth Bot Status: Ready 🛡️'));
app.listen(process.env.PORT || 3000);

const host = 'hshm.aternos.me';
const port = 16821;

function createBot(name) {
    console.log(`📡 [${name}] محاولة دخول مخفية...`);

    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: name,
        version: '1.21.1',
        // ⚠️ إعدادات منع الـ ECONNRESET
        connectTimeout: 90000,
        keepAlive: true,
        checkTimeoutInterval: 120000
    });

    // منع الكراش عند حصول ECONNRESET
    bot.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
            console.log(`🚫 [${name}] أترنوس لا يزال يرفض الـ IP (ECONNRESET).`);
        } else {
            console.log(`❌ خطأ: ${err.message}`);
        }
    });

    bot.on('spawn', () => {
        console.log(`✅ [${name}] اخترق الحماية ودخل بنجاح!`);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ فصل: ${reason}. بنحاول بعد دقيقتين...`);
        setTimeout(() => createBot(name), 120000);
    });
}

// تشغيل بوت واحد فقط في البداية (عشان ما نلفت نظر الحماية)
createBot('Hshm_Special_V1');
