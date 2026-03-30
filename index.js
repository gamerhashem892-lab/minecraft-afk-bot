 const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot System 1.21.11 is Online ✅'));
app.listen(process.env.PORT || 3000);

const host = '46.224.7.62';
const port = 25801;

function createBot(username) {
    console.log(`📡 محاولة تشغيل [${username}]...`);

    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: username,
        version: '1.21.1', // هذا الرقم هو المعرف البرمجي لـ 1.21.11
        checkTimeoutInterval: 60000
    });

    // منع انهيار البرنامج (Anti-Crash)
    bot.on('error', (err) => {
        console.log(`❌ خطأ في بوت [${username}]: ${err.message}`);
    });

    bot.on('spawn', () => {
        console.log(`✅ [${username}] دخل وتمركز بنجاح.`);
        bot.clearControlStates();
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ [${username}] فصل (السبب: ${reason}). إعادة تشغيل بعد 60 ثانية...`);
        setTimeout(() => createBot(username), 60000);
    });
}

// تشغيل البوتات بفرق زمني
const names = ['Hshm_Ultra_1', 'Hshm_Ultra_2'];
names.forEach((name, i) => {
    setTimeout(() => createBot(name), i * 30000);
});
