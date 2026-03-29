const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Multi-Bots for 1.21.11 are Synced! 🚀'));
app.listen(process.env.PORT || 3000);

const host = 'Hshm.aternos.me';
const port = 16821;

// قائمة بأسماء البوتات
const names = ['Hashem_U_1', 'Warrior_H_2'];

function startBot(username) {
    console.log(`📡 [${username}] جاري محاولة الدخول والاكتشاف التلقائي لنسخة 1.21.11...`);

    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: username,
        // شلنا تحديد النسخة يدويًا عشان يكتشف 1.21.11 تلقائيًا
        checkTimeoutInterval: 60000
    });

    let reconnecting = false;

    bot.on('spawn', () => {
        console.log(`✅ [${bot.username}] دخل بنجاح وتوافق مع نسخة السيرفر!`);
        bot.clearControlStates();

        // نظام الـ 15 ثانية هدوء عشان ما يطردك أترنوس (Invalid Move)
        setTimeout(() => {
            console.log(`⚙️ [${bot.username}] بدأ التمويه الهادئ...`);
            setInterval(() => {
                if (bot.entity) {
                    // دوران الرأس + قفزة بسيطة
                    bot.look(bot.entity.yaw + 0.3, 0);
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                }
            }, 35000);
        }, 15000);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ [${username}] فصل: ${reason}`);
        if (!reconnecting) {
            reconnecting = true;
            setTimeout(() => startBot(username), 60000);
        }
    });

    bot.on('error', (err) => {
        console.log(`❌ [${username}] خطأ: ${err.code}`);
        if (err.code === 'ECONNRESET' && !reconnecting) {
            reconnecting = true;
            setTimeout(() => startBot(username), 180000);
        }
    });
}

// تشغيل البوتات بفاصل دقيقة
names.forEach((name, index) => {
    setTimeout(() => startBot(name), index * 60000);
});
