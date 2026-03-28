const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- [ 1. إعداد سيرفر الويب لمنع خطأ Not Found ] ---
app.get('/', (req, res) => {
  // هذه الرسالة هي اللي بتطلع لك لما تفتح الرابط في المتصفح
  res.send('<h1>Hashem Super Bot is Online! 🚀</h1><p>Bot is jumping in the server...</p>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web server is listening on port ${port}`);
});

// --- [ 2. إعدادات بوت ماينكرافت ] ---
const botArgs = {
  host: 'Hshm.aternos.me',    // رابط سيرفرك
  port: 16821,               // البورت
  username: 'hashem_super_3', // اسم البوت
  version: false             // يكتشف النسخة تلقائياً
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botArgs);

  // أول ما يدخل السيرفر يبدأ القفز
  bot.on('spawn', () => {
    console.log('✅ [Hashem Bot] دخل السيرفر وبدأ القفز!');
    
    // وظيفة القفز المستمر كل ثانية
    setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        bot.setControlState('jump', false);
      }
    }, 1000); 
  });

  // إعادة الاتصال التلقائي إذا طردوه
  bot.on('end', () => {
    console.log('⚠️ انقطع الاتصال! جاري العودة خلال 10 ثواني...');
    setTimeout(createBot, 10000); 
  });

  // منع الكود من التوقف عند حدوث خطأ تقني
  bot.on('error', (err) => {
    console.log('❌ خطأ برميجي:', err.message);
  });
}

// تشغيل البوت
createBot();
