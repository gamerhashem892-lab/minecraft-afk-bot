const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('System Stable 24/7 ✅'));
app.listen(process.env.PORT || 3000);

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: '1.21.1',
  auth: 'offline'
};

const bots = {};
// هذا المتغير هو "القفل" اللي يمنع التضارب
let activeBotsList = []; 

function createBot(username) {
  if (bots[username]) return;

  console.log(`📡 [${username}] جاري الدخول...`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('spawn', () => {
    console.log(`✅ [${username}] في العالم الآن.`);
    
    // نظام الحركة والبناء والكسر
    if (!bot.mainInterval) {
      bot.mainInterval = setInterval(async () => {
        if (!bot.entity) return;
        try {
          bot.setControlState('jump', true);
          bot.setControlState('forward', true);
          await new Promise(r => setTimeout(r, 1000));
          bot.clearControlStates();

          const block = bot.blockAt(bot.entity.position.offset(0, -1, 0));
          if (block) {
              await bot.lookAt(block.position);
              bot.setControlState('sneak', true);
              bot.swingArm('right'); 
              await new Promise(r => setTimeout(r, 500));
              bot.swingArm('left');
              bot.setControlState('sneak', false);
          }
          bot.look(Math.random() * Math.PI * 2, 0);
        } catch (e) {}
      }, 30000);
    }
  });

  bot.on('end', () => {
    console.log(`❌ [${username}] فصل.`);
    if (bot.mainInterval) clearInterval(bot.mainInterval);
    delete bots[username];
  });

  bot.on('error', (err) => console.log(`❗ خطأ ${username}: ${err.code}`));
  
  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// --- نظام الدورة الذكي ---
async function startLifecycle() {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  
  while (true) {
    console.log("🚀 دورة جديدة: تشغيل الاثنين لمدة 4 ساعات...");
    activeBotsList = ['hashem_Admin1', 'hashem_Admin2'];
    createBot('hashem_Admin1');
    createBot('hashem_Admin2');
    await wait(4 * 60 * 60 * 1000); 

    console.log("⏳ استراحة Admin1...");
    activeBotsList = ['hashem_Admin2']; // المراقبة الحين تعرف إن 1 لازم يكون طافي
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();
    await wait(90 * 60 * 1000); 

    console.log("🔄 عودة Admin1 واستراحة Admin2...");
    activeBotsList = ['hashem_Admin1']; // المراقبة تعرف إن 2 لازم يكون طافي
    createBot('hashem_Admin1');
    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();
    await wait(90 * 60 * 1000);
  }
}

// --- 🛡️ نظام المراقبة (The Guard) المصلح ---
setInterval(() => {
    // المراقبة الحين ما تشغل أي بوت، تشغل بس اللي موجود في "قائمة النشطين"
    activeBotsList.forEach(name => {
        if (!bots[name]) {
            console.log(`🚨 المراقبة: إعادة تشغيل طوارئ لـ ${name}...`);
            createBot(name);
        }
    });
}, 60000);

startLifecycle();
