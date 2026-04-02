const mineflayer = require('mineflayer');

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: '1.21.1', // ثبتنا النسخة عشان يشبك صح
  auth: 'offline'
};

const bots = {};

function createBot(username) {
  if (bots[username]) return;

  console.log(`🤖 محاولة تشغيل البوت: ${username}`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('spawn', () => {
    console.log(`✅ ${username} متصل الآن ويتحرك!`);
    
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
    console.log(`❌ ${username} فصل من السيرفر.`);
    if (bot.moveInterval) clearInterval(bot.moveInterval);
    delete bots[username];
  });

  bot.on('error', (err) => console.log(`‼️ خطأ في ${username}:`, err.code));

  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// --- نظام إدارة الدورة (4 ساعات عمل -> استراحة متبادلة) ---
async function startLifecycle() {
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  while (true) {
    console.log("🚀 بداية الدورة: تشغيل الاثنين لمدة 4 ساعات...");
    createBot('hashem_Admin1');
    createBot('hashem_Admin2');

    await wait(4 * 60 * 60 * 1000);

    console.log("⏳ استراحة Admin1...");
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();
    await wait(90 * 60 * 1000); 

    createBot('hashem_Admin1');
    await wait(15000); 

    console.log("⏳ استراحة Admin2...");
    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();
    await wait(90 * 60 * 1000);

    createBot('hashem_Admin2');
    await wait(15000);
  }
}

// --- 🛡️ نظام المراقبة (The Guard) المعدل لدخول الاثنين ---
setInterval(() => {
    // إذا الأول طافي، شغله
    if (!bots['hashem_Admin1']) {
        createBot('hashem_Admin1');
    }
    // إذا الثاني طافي، شغله (هنا صلحنا المشكلة)
    if (!bots['hashem_Admin2']) {
        createBot('hashem_Admin2');
    }
}, 60000);

// تشغيل الدورة
startLifecycle();
