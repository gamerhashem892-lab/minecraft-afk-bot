const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- [ 1. إعداد خادم الويب لضمان عمل البوت 24/7 ] ---
// اربط رابط الـ Render الخاص بك في UptimeRobot بهذا المنفذ (3000)
app.get('/', (req, res) => {
  res.send('Hashem Super Bot is Running! 🚀');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web server is listening on port ${port}`);
});

// --- [ 2. إعدادات بوت ماينكرافت الخاصة بك ] ---
const botArgs = {
  host: 'Hshm.aternos.me',    // رابط سيرفرك
  port: 16821,               // البورت الخاص بك
  username: 'hashem_super_3', // اسم البوت
  version: false             // false يخلي البوت يكتشف النسخة تلقائياً
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botArgs);

  // أول ما يدخل السيرفر يبدأ القفز
  bot.on('spawn', () => {
    console.log('✅ البوت دخل السيرفر وبدأ القفز المستمر!');
    
    // وظيفة القفز (Jump) كل ثانية
    setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        bot.setControlState('jump', false);
      }
    }, 1000); 
  });

  // إعادة الاتصال التلقائي في حال الطرد أو توقف السيرفر
  bot.on('end', () => {
    console.log('⚠️ انقطع الاتصال! جاري محاولة الدخول مرة أخرى بعد 10 ثواني...');
    setTimeout(createBot, 10000); 
  });

  // معالجة الأخطاء عشان الكود ما يوقف (Crash)
  bot.on('error', (err) => {
    console.log('❌ خطأ في البوت:', err.message);
  });
}

createBot();
