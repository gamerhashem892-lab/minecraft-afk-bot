const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// تشغيل سيرفر بسيط عشان المنصة ما تطفيه
app.get('/', (req, res) => res.send('Bots are Running! 🚀'));
app.listen(process.env.PORT || 3000);

const botConfigs = [
  { name: 'Hashem_Pro_1', delay: 0 },       // البوت الأول يدخل فوراً
  { name: 'Warrior_HSHM_2', delay: 45000 } // البوت الثاني بعد 45 ثانية
];

function createBot(name, delay) {
  setTimeout(() => {
    const bot = mineflayer.createBot({
      host: 'Modcraft-gYuZ.aternos.me', // ⚠️ لا تنسى تغيره لعنوان سيرفرك
      port: 43889,
      username: name,
      version: '1.20.1' // ⚠️ تأكد إن النسخة مطابقة لسيرفرك
    });

    bot.on('spawn', () => {
      console.log(`✅ [${name}] دخل السيرفر.. كفووو!`);
      // حركة عشوائية عشان أترنوس ما يطفيه
      setInterval(() => {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }, 15000); 
    });

    bot.on('end', () => {
      console.log(`⚠️ [${name}] فصل.. بننتظر دقيقة ونرجع!`);
      setTimeout(() => createBot(name, 0), 60000); // ينتظر دقيقة قبل الرجوع
    });

    bot.on('error', (err) => console.log(`❌ خطأ في ${name}: ${err.message}`));

  }, delay);
}

// البدء بتشغيل البوتات
botConfigs.forEach(config => createBot(config.name, config.delay));
