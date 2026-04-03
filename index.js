const mineflayer = require('mineflayer');

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: false,
  auth: 'offline'
};

const bots = {};

function createBot(username) {
  if (bots[username]) return;

  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('spawn', () => {
    console.log(`✅ ${username} دخل`);

    // ================= 🔄 نظام إعادة التشغيل =================
    if (username === 'hashem_Admin1' && !bot.testRestart) {
      bot.testRestart = true;

      console.log("⏳ سيتم إعادة التشغيل بعد 3 دقائق");

      // 1 دقيقة
      setTimeout(() => {
        bot.chat("⚠️ إعادة تشغيل بعد 1 دقيقة!");
      }, 2 * 60 * 1000);

      // 30 ثانية
      setTimeout(() => {
        bot.chat("⚠️ إعادة تشغيل بعد 30 ثانية!");
      }, 2.5 * 60 * 1000);

      // 10 ثواني
      setTimeout(() => {
        bot.chat("⚠️ إعادة تشغيل بعد 10 ثواني!");
      }, 2 * 60 * 1000 + 50 * 1000);

      // التنفيذ
      setTimeout(() => {
        console.log("♻️ جاري إيقاف السيرفر...");
        bot.chat("/stop");
      }, 3 * 60 * 1000);
    }

    // ================= الحركة =================
    if (!bot.moveInterval) {
      bot.moveInterval = setInterval(() => {
        if (!bot.entity) return;

        const actions = ['forward', 'left', 'right', 'jump'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        bot.setControlState(action, true);

        setTimeout(() => {
          bot.clearControlStates();
        }, 1500);

      }, 3000);
    }
  });

  bot.on('end', () => {
    console.log(`❌ ${username} فصل`);
    delete bots[username];

    setTimeout(() => {
      createBot(username);
    }, 10000);
  });

  bot.on('error', () => {
    delete bots[username];
  });

  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// تشغيل البوتين
createBot('hashem_Admin1');

setTimeout(() => {
  createBot('hashem_Admin2');
}, 15000);

// مراقبة
setInterval(() => {
  ['hashem_Admin1', 'hashem_Admin2'].forEach(name => {
    if (!bots[name]) createBot(name);
  });
}, 60000);
