const mineflayer = require('mineflayer');
const express = require('express');

// إعدادات السيرفر
const SERVER_HOST = "Hshm.aternos.me";
const SERVER_PORT = 16821;
const VERSION = "1.21.1";

const BOT_INFOS = [
    { username: "Hashem_Super_1", joinDelay: 5000 },
function createBot(info) {
    console.log(`📡 [${info.username}] جاري محاولة الدخول...`);
    
    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: info.username,
        version: VERSION,
        connectTimeout: 60000, // انتظر دقيقة كاملة قبل ما تفصل (حل الـ Timeout)
    });

    // --- ميزة الحركة لمنع الطرد (Anti-AFK) ---
    bot.on('spawn', () => {
        console.log(`✅ كفووو! [${info.username}] دخل السيرفر.`);
        
        // خله يتحرك كل 60 ثانية حركة بسيطة
        setInterval(() => {
            const actions = ['forward', 'back', 'left', 'right'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            
            bot.setControlState(randomAction, true);
            setTimeout(() => {
                bot.setControlState(randomAction, false);
            }, 500); // يمشي نص ثانية بس
            
            bot.look(Math.random() * Math.PI * 2, 0); // يطالع لجهة عشوائية
        }, 60000); 
    });

    bot.on('login', () => {
        console.log(`📝 [${info.username}] تم تسجيل الدخول بنجاح`);
    });

    bot.on('error', (err) => {
        console.log(`❌ [${info.username}] خطأ: ${err.message}`);
    });

    bot.on('end', () => {
        console.log(`⚠️ [${info.username}] فصل الاتصال.. بحاول أرجع بعد 10 ثواني`);
        setTimeout(() => createBot(info), 10000);
    });

    bot.on('kicked', (reason) => {
        console.log(`🚫 [${info.username}] انطرد بسبب: ${reason}`);
    });

    return bot;
}

// السيرفر اللي يخلي الخدمة شغالة (Keep-alive)
const app = express();
app.get('/', (req, res) => res.send('<h1>BOTS ARE RUNNING! 🚀</h1>'));
app.listen(process.env.PORT || 3000, () => {
    console.log("🟢 GitHub Runner is Online!");
    
    BOT_INFOS.forEach(info => {
        setTimeout(() => createBot(info), info.joinDelay);
    });
});
