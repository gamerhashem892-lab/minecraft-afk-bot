const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot Version 1.21.11 is Running! ✅'));
app.listen(process.env.PORT || 3000);

const host = 'Modcraft-gYuZ.aternos.me';
const port = 43889;
const version = '1.21.1'; // تم التعديل للنسخة المطلوبة

function createBot(name) {
    console.log(`📡 [${name}] جاري محاولة الدخول بنسخة 1.21.1...`);

    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: name,
        version: version, // مهم جداً التوافق هنا
        checkTimeoutInterval: 60000
    });

    // لتجنب تداخل المحاولات
    let isRestarting = false;

    bot.on('spawn', () => {
        console.log(`✅ [${name}] دخل وثبت! كفووو يا هاشم.`);
        isRestarting = false;
        
        // تمويه أترنوس بالحركة
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                // التفات بسيط
                bot.look(bot.entity.yaw + 0.5, 0);
            }
        }, 20000);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ فصل بسبب: ${reason}. بننتظر دقيقة.`);
        if (!isRestarting) {
            isRestarting = true;
            bot.removeAllListeners();
            setTimeout(() => createBot(name), 60000);
        }
    });

    bot.on('error', (err) => {
        console.log(`❌ خطأ: ${err.code}`);
        if (err.code === 'ECONNRESET') {
            console.log("حظر آي بي مؤقت.. بنهجد دقيقتين.");
            if (!isRestarting) {
                isRestarting = true;
                setTimeout(() => createBot(name), 120000);
            }
        }
    });
}

// ابدأ ببوت واحد للتجربة وضمان الاستقرار
createBot('Hashem_121_V1');
