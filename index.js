const mineflayer = require('mineflayer');

function createBot(username) {
  const bot = mineflayer.createBot({
    host: 'Hshm.aternos.me',
    port: 16821,
    username: username,
    version: false
  });

  bot.on('login', () => {
    console.log(`${username} دخل ✅`);
  });

  bot.on('spawn', () => {
    console.log(`${username} اشتغل 🎮`);

    // حركة عشوائية
    setInterval(() => {
      if (!bot.entity) return;

      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 15000);
  });

  bot.on('end', () => {
    console.log(`${username} انفصل.. يعيد 🔁`);
    setTimeout(() => createBot(username), 10000);
  });

  bot.on('error', (err) => {
    console.log(`${username} خطأ:`, err.code);
  });

  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) {
      bot.chat('/login 123456');
    }
    if (msg.includes('/register')) {
      bot.chat('/register 123456 123456');
    }
  });
}

// 🔥 هنا تشغل أكثر من بوت
createBot('Bot1');
createBot('Bot2');
