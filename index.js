const mineflayer = require('mineflayer');

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: '1.21.1', 
  auth: 'offline'
};

const bots = {};
let allowedToRun = { 'hashem_Admin1': true, 'hashem_Admin2': true };

function createBot(username) {
  if (bots[username]) return;
  console.log(`🤖 محاولة تشغيل البوت: ${username}`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  // --- نظام الحركة الإجباري (Force Move) ---
  bot.on('spawn', () => {
    console.log(`✅ ${username} رسبن! جاري تفعيل الحركة...`);
    
    // تنظيف أي محاولات قديمة
    if (bot.moveInterval) clearInterval(bot.moveInterval);

    bot.moveInterval = setInterval(() => {
      // إذا البوت موجود في العالم (مو صنم)
      if (bot.entity) {
        const actions = ['forward', 'back', 'left', 'right', 'jump'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        // تنفيذ الأكشن
        bot.setControlState(action, true);
        bot.look(Math.random() * Math.PI * 2, 0);
        
        // إضافة: حركة اليد (Swing) عشان السيرفر يعرف إنه لاعب حقيقي
        bot.swingArm('right');

        setTimeout(() => {
          if (bot.entity) bot.clearControlStates();
        }, 1000);
      }
    }, 10000); // يتحرك كل 10 ثواني (أسرع وأضمن)
  });

  bot.on('end', () => {
    console.log(`❌ ${username} فصل.`);
    if (bot.moveInterval) clearInterval(bot.moveInterval);
    delete bots[username];
  });

  bot.on('error', (err) => console.log(`‼️ خطأ في ${username}:`, err.code));

  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// --- نظام إدارة الدورة (بفارق زمني 15 ثانية) ---
async function startLifecycle() {
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  while (true) {
    allowedToRun['hashem_Admin1'] = true;
    createBot('hashem_Admin1');
    await wait(15000); // انتظار عشان الثاني يدخل صح

    allowedToRun['hashem_Admin2'] = true;
    createBot('hashem_Admin2');
    await wait(4 * 60 * 60 * 1000);

    allowedToRun['hashem_Admin1'] = false;
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();
    await wait(90 * 60 * 1000); 

    allowedToRun['hashem_Admin1'] = true;
    createBot('hashem_Admin1');
    await wait(30000); 

    allowedToRun['hashem_Admin2'] = false;
    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();
    await wait(90 * 60 * 1000);
  }
}

// --- المراقبة الذكية ---
setInterval(() => {
    if (allowedToRun['hashem_Admin1'] && !bots['hashem_Admin1']) createBot('hashem_Admin1');
    setTimeout(() => {
        if (allowedToRun['hashem_Admin2'] && !bots['hashem_Admin2']) createBot('hashem_Admin2');
    }, 10000);
}, 60000);

startLifecycle();
