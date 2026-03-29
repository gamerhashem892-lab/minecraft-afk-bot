const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Multi-Bots 1.21.11 are Online! 🚀'));
app.listen(process.env.PORT || 3000);

const serverConfig = {
    host: 'Modcraft-gYuZ.aternos.me',
    port: 43889,
    version: '1.21.1' 
};

// قائمة البوتات (تقدر تضيف ثالث ورابع هنا)
const botNames = ['Hashem_Ultra_1', 'Warrior_HSHM_2'];

function createBot(name) {
    console.log(`📡 [${name}] جاري محاولة الاتصال...`);

    const bot = mineflayer.createBot({
        host: serverConfig.host,
        port: serverConfig.port,
        username: name,
        version: serverConfig.version,
        checkTimeoutInterval: 60000
    });

    let isRestarting = false;

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] دخل السيرفر بنجاح!`);
        bot.clearControlStates();

        // نظام الانتظار والتمويه (15 ثانية هدوء)
        setTimeout(() => {
            console.log(`⚙️ [${bot.username}] بدأ نظام التمويه...`);
            setInterval(() => {
                if (bot.entity) {
                    // دوران الرأس فقط لمنع الـ Invalid Move
                    bot.look(bot.entity.yaw + 0.2, 0);
                    // قفزة كل 45 ثانية
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                }
            }, 45000);
        }, 15000);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ [${name}] انفصل: ${reason}`);
        if (!isRestarting) {
            isRestarting = true;
            setTimeout(() => createBot(name), 60000);
        }
    });

    bot.on('error', (err) => {
        console.log(`❌ [${name}] خطأ: ${err.code}`);
        if (err.code === 'ECONNRESET' && !isRestarting) {
            isRestarting = true;
            setTimeout(() => createBot(name), 180000);
        }
    });
}

// تشغيل البوتات بفرق زمني (دقيقة بين كل بوت)
botNames.forEach((name, index) => {
    setTimeout(() => {
        createBot(name);
    }, index * 60000); 
});
