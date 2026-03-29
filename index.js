const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is Synced with 1.21.11! 🚀'));
app.listen(process.env.PORT || 3000);

const botArgs = {
    host: 'Modcraft-gYuZ.aternos.me',
    port: 43889,
    username: 'Hashem_Ultra_121', 
    // حذفنا سطر النسخة عشان يكتشفها البوت تلقائياً (Auto-detect)
    // وهذا أضمن حل لنسخة 1.21.11
    checkTimeoutInterval: 60000
};

function createBot() {
    console.log(`📡 جاري محاولة الدخول والتحقق من نسخة السيرفر (1.21.11)...`);

    const bot = mineflayer.createBot(botArgs);

    let isRestarting = false;

    bot.on('spawn', () => {
        console.log(`✅ كفووو! دخلنا 1.21.11 بنجاح.`);
        isRestarting = false;
        
        // تمويه ذكي: قفز وحركة خفيفة كل 20 ثانية
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                bot.look(bot.entity.yaw + 0.1, 0);
            }
        }, 20000);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ السيرفر طردنا (السبب: ${reason}). بننتظر دقيقة ونرجع.`);
        if (!isRestarting) {
            isRestarting = true;
            bot.removeAllListeners();
            setTimeout(createBot, 60000);
        }
    });

    bot.on('error', (err) => {
        console.log(`❌ خطأ تقني: ${err.code}`);
        if (err.code === 'ECONNRESET') {
            console.log("حظر آي بي مؤقت من أترنوس.. بنبرد 3 دقائق.");
            if (!isRestarting) {
                isRestarting = true;
                setTimeout(createBot, 180000); 
            }
        }
    });
}

createBot();
