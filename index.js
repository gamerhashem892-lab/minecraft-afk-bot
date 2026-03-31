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

    // 🔥 حركة عشوائية (يمشي + يلف + أحياناً ينط)
    setInterval(() => {
      if (!bot.entity) return;

      const actions = ['forward', 'back', 'left', 'right'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      bot.clearControlStates(); // يوقف كل شي قبل

      bot.setControlState(action, true);

      // يلف عشوائي
      bot.look(
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI
      );

      // أحياناً ينط
      if (Math.random() > 0.7) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }

      // يوقف بعد شوي
      setTimeout(() => {
        bot.clearControlStates();
      }, 2000);

    }, 4000);
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

// 🔥 البوتات بالأسماء اللي طلبتها
createBot('hashem_Admin1');
createBot('hashem_Admin2');
