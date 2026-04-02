const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('System Status: 24/7 ACTIVE 🛡️'));
app.listen(process.env.PORT || 3000);

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: '1.21.1',
  auth: 'offline'
};

const bots = {};
let activeBotsList = [];

// ================= BOT =================
function createBot(username) {
  if (bots[username]) return;

  console.log(`📡 [${username}] جاري الدخول...`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  const startActing = () => {
    if (bot.moveInterval) clearInterval(bot.moveInterval);

    console.log(`🚀 [${username}] بدأ الحركة`);

    bot.moveInterval = setInterval(() => {
      if (!bot.entity) return;

      try {
        const actions = ['forward', 'back', 'left', 'right'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        bot.setControlState(action, true);

        if (Math.random() < 0.5) {
          bot.setControlState('jump', true);
        }

        if (Math.random() < 0.3) {
          bot.setControlState('sneak', true);
        }

        bot.look(
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.5,
          true
        );

        setTimeout(() => {
          bot.clearControlStates();
        }, 1500);

      } catch (err) {}
    }, 3000);

    // anti-freeze (مهم)
    bot.jumpInterval = setInterval(() => {
      if (!bot.entity) return;

      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 200);
    }, 2000);
  };

  bot.on('spawn', () => {
    console.log(`✅ [${username}] دخل السيرفر`);

    setTimeout(() => {
      bot.chat('/spawn');
      bot.chat('/lobby');
    }, 3000);

    setTimeout(startActing, 6000);
  });

  bot.on('end', (reason) => {
    console.log(`❌ [${username}] فصل: ${reason}`);

    if (bot.moveInterval) clearInterval(bot.moveInterval);
    if (bot.jumpInterval) clearInterval(bot.jumpInterval);

    delete bots[username];
  });

  bot.on('error', (err) => {
    console.log(`‼️ خطأ في ${username}:`, err.code);
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

// ================= CYCLE =================
async function startLifecycle() {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  while (true) {
    console.log("🔄 تشغيل الاثنين");

    activeBotsList = ['hashem_Admin1', 'hashem_Admin2'];

    createBot('hashem_Admin1');
    createBot('hashem_Admin2');

    // 4 ساعات
    await wait(4 * 60 * 60 * 1000);

    // Admin1 يطلع
    console.log("😴 خروج Admin1");

    activeBotsList = ['hashem_Admin2'];

    if (bots['hashem_Admin1']) {
      bots['hashem_Admin1'].quit();
      delete bots['hashem_Admin1'];
    }

    await wait(90 * 60 * 1000);

    // Admin2 يطلع و Admin1 يرجع
    console.log("🔄 تبديل");

    activeBotsList = ['hashem_Admin1'];

    createBot('hashem_Admin1');

    if (bots['hashem_Admin2']) {
      bots['hashem_Admin2'].quit();
      delete bots['hashem_Admin2'];
    }

    await wait(90 * 60 * 1000);
  }
}

// ================= GUARD =================
setInterval(() => {
  activeBotsList.forEach(name => {
    if (!bots[name]) {
      console.log(`🚨 إعادة تشغيل ${name}`);
      createBot(name);
    }
  });
}, 60000);

// ================= START =================
startLifecycle();
