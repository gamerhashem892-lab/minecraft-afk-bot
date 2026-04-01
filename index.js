const mineflayer = require('mineflayer');

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: false, // عشان يشبك على أي نسخة تلقائياً
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
    
    // إيقاف أي حركة سابقة لضمان عدم التعليق
    bot.clearControlStates();
    
    // --- نظام الحركة (مفصول ومستقل) ---
    if (!bot.moveInterval) {
      bot.moveInterval = setInterval(() => {
        if (!bot.entity) return;
        
        const actions = ['forward', 'left', 'right', 'jump'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        // تنفيذ الحركة
        bot.setControlState(action, true);
        bot.look(Math.random() * Math.PI * 2, 0);

        // يوقف الحركة بعد ثانية عشان يغير اتجاهه (واقعية أكثر)
        setTimeout(() => {
          if (bot.entity) bot.clearControlStates();
        }, 1500);
      }, 3000); // يقرر حركة جديدة كل 3 ثواني
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

    // استراحة الأول
    console.log("⏳ استراحة Admin1...");
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();
    await wait(90 * 60 * 1000); 

    // عودة الأول
    createBot('hashem_Admin1');
    await wait(15000); 

    // استراحة الثاني
    console.log("⏳ استراحة Admin2...");
    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();
    await wait(90 * 60 * 1000);

    // عودة الثاني
    createBot('hashem_Admin2');
    await wait(15000);
  }
}

// --- 🛡️ نظام المراقبة (The Guard) ---
// هذا الجزء يفحص كل دقيقة، لو البوت الثاني "اختفى" وما رجع، المراقبة ترجعه فوراً
setInterval(() => {
    if (!bots['hashem_Admin1'] && !bots['hashem_Admin2']) {
        console.log("🚨 السيرفر فاضي! إعادة تشغيل الطوارئ...");
        createBot('hashem_Admin1');
    }
    // لو البوت الثاني فصل لسبب تقني وما رجع في وقته
    if (Object.keys(bots).length < 1) {
        createBot('hashem_Admin2');
    }
}, 60000);

startLifecycle();
