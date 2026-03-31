const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'Hshm.aternos.me',
    port: 16821,
    username: 'BotAFK',
    version: false
  });

  bot.on('login', () => {
    console.log('دخل البوت ✅');
  });

  bot.on('spawn', () => {
    console.log('اشتغل البوت 🎮');

    // حركة عشوائية كل شوي (عشان ما ينطرد)
    setInterval(() => {
      if (!bot.entity) return;

      const yaw = Math.random() * Math.PI * 2;
      bot.look(yaw, 0, true);

      bot.setControlState('forward', true);

      setTimeout(() => {
        bot.setControlState('forward', false);
      }, 2000);

    }, 10000);
  });

  // إعادة تشغيل إذا طلع
  bot.on('end', () => {
    console.log('انفصل.. يعيد الدخول 🔁');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('خطأ:', err.message);
  });

  // لو فيه تسجيل /login
  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) {
      bot.chat('/login 123456'); // غير الرقم لو عندك باسورد
    }
    if (msg.includes('/register')) {
      bot.chat('/register 123456 123456');
    }
  });
}

createBot();
