const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- [ ميزة الاستيقاظ المستمر ] ---
app.get('/', (req, res) => {
  res.send('Hashem Super Bot is Awake! 🚀');
  console.log('✅ تم استقبال نبضة من UptimeRobot!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// --- [ إعدادات البوت ] ---
const botArgs = {
  host: 'Hshm.aternos.me',
  port: 16821,
  username: 'hashem_super_3',
  version: false
};

function createBot() {
  const bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('✅ البوت في السيرفر الآن!');
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        bot.setControlState('jump', false);
      }
    }, 1000);
  });

  // إعادة تشغيل ذكية عند الفصل
  bot.on('end', () => {
    console.log('⚠️ فصل البوت، إعادة محاولة بعد 5 ثواني...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => console.log('Error:', err.message));
}

createBot();
