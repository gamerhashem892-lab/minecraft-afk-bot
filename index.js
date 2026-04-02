const mineflayer = require('mineflayer');

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: false,
  auth: 'offline'
};

const bots = {};

// ================= BOT =================
function createBot(username) {
  if (bots[username]) return;

  console.log(`🤖 محاولة تشغيل البوت: ${username}`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('spawn', () => {
    console.log(`✅ ${username} دخل ويتحرك`);

    bot.clearControlStates();

    if (!bot.moveInterval) {
      bot.moveInterval = setInterval(() => {
        if (!bot.entity) return;

        const actions = ['forward', 'left', 'right', 'jump'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        bot.setControlState(action, true);
        bot.look(Math.random() * Math.PI * 2, 0);

        setTimeout(() => {
          if (bot.entity) bot.clearControlStates();
        }, 1500);

      }, 3000);
    }
  });

  bot.on('end', () => {
    console.log(`❌ ${username} فصل`);

    if (bot.moveInterval) clearInterval(bot.moveInterval);

    delete bots[username];
  });

  bot.on('error', (err) => {
    console.log(`‼️ خطأ في ${username}:`, err.code);
  });

  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// ================= CYCLE =================
async function startLifecycle() {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  while (true) {
    console.log("🚀 تشغيل الاثنين 4 ساعات");

    createBot('hashem_Admin1');
    await wait(5000); // مهم عشان يدخل الثاني
    createBot('hashem_Admin2');

    await wait(4 * 60 * 60 * 1000);

    // خروج Admin1
    console.log("😴 خروج Admin1");

    if (bots['hashem_Admin1']) {
      bots['hashem_Admin1'].quit();
      delete bots['hashem_Admin1'];
    }

    await wait(90 * 60 * 1000);

    // رجوع Admin1
    createBot('hashem_Admin1');
    await wait(10000);

    // خروج Admin2
    console.log("😴 خروج Admin2");

    if (bots['hashem_Admin2']) {
      bots['hashem_Admin2'].quit();
      delete bots['hashem_Admin2'];
    }

    await wait(90 * 60 * 1000);

    // رجوع Admin2
    createBot('hashem_Admin2');
    await wait(10000);
  }
}

// ================= GUARD =================
setInterval(() => {
  ['hashem_Admin1', 'hashem_Admin2'].forEach(name => {
    if (!bots[name]) {
      console.log(`🚨 إعادة تشغيل ${name}`);
      createBot(name);
    }
  });
}, 60000);

// ================= START =================
startLifecycle();
