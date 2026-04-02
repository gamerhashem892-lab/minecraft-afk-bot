const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('System Status: 24/7 ACTIVE 🛡️🏗️'));
app.listen(process.env.PORT || 3000);

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: '1.21.1',
  auth: 'offline'
};

const bots = {};
let activeBotsList = [];

function createBot(username) {
  if (bots[username]) return;

  console.log(`📡 [${username}] جاري محاولة الدخول للسيرفر...`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  const startActing = () => {
    if (bot.moveInterval) clearInterval(bot.moveInterval);

    console.log(`🚀 [${username}] بدأ نظام الحركة الذكي!`);

    bot.moveInterval = setInterval(async () => {
      if (!bot.entity) return;

      try {
        // حركة عشوائية مستمرة
        const actions = ['forward', 'back', 'left', 'right'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        bot.setControlState(action, true);

        // قفز خفيف
        setTimeout(() => {
          bot.setControlState('jump', true);
        }, 300);

        // إيقاف الحركة
        setTimeout(() => {
          bot.clearControlStates();
        }, 1500);

        // التفات عشوائي (بدون await عشان ما يعلق)
        bot.look(
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.5,
          true
        );

        // --- كسر بلوك حقيقي (اختياري) ---
        const blockBelow = bot.blockAt(bot.entity.position.offset(0, -1, 0));
        if (blockBelow && bot.canDigBlock(blockBelow)) {
          // نسبة 20% بس عشان ما ينكشف
          if (Math.random() < 0.2) {
            await bot.dig(blockBelow);
          }
        }

      } catch (err) {
        console.log(`⚠️ مشكلة بسيطة:`, err.message);
      }

    }, 4000); // كل 4 ثواني بدل 20
  };

  bot.on('spawn', () => {
    console.log(`✅ [${username}] دخل السيرفر.`);
    setTimeout(startActing, 5000);
  });

  bot.on('end', (reason) => {
    console.log(`❌ [${username}] فصل: ${reason}`);
    if (bot.moveInterval) clearInterval(bot.moveInterval);
    delete bots[username];
  });

  bot.on('error', (err) => {
    console.log(`‼️ خطأ في ${username}:`, err.code);
  });

  // تسجيل الدخول التلقائي
  bot.on('messagestr', (msg) => {
    if (msg.includes('/login') || msg.includes('تسجيل الدخول')) {
      bot.chat('/login 123456');
    }
    if (msg.includes('/register')) {
      bot.chat('/register 123456 123456');
    }
  });
}

// نظام الدورة
async function startLifecycle() {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  while (true) {
    console.log("🔄 تشغيل Admin1 و Admin2...");
    activeBotsList = ['hashem_Admin1', 'hashem_Admin2'];

    createBot('hashem_Admin1');
    createBot('hashem_Admin2');

    await wait(4 * 60 * 60 * 1000);

    console.log("⏳ استراحة Admin1...");
    activeBotsList = ['hashem_Admin2'];
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();

    await wait(90 * 60 * 1000);

    console.log("🔄 تبديل...");
    activeBotsList = ['hashem_Admin1'];
    createBot('hashem_Admin1');
    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();

    await wait(90 * 60 * 1000);
  }
}

// نظام الحماية (يرجع البوت لو اختفى)
setInterval(() => {
  activeBotsList.forEach(name => {
    if (!bots[name]) {
      console.log(`🚨 إعادة تشغيل ${name}`);
      createBot(name);
    }
  });
}, 60000);

// تشغيل
startLifecycle();
