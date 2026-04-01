const mineflayer = require('mineflayer');

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: '1.20.1',
  auth: 'offline'
};

const bots = {};

function createBot(username) {
  if (bots[username]) return;

  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('login', () => console.log(`✅ ${username} دخل السيرفر`));

  bot.on('spawn', () => {
    console.log(`🎮 ${username} بدأ النشاط`);
    startRandomMovement(bot);
  });

  bot.on('end', () => {
    console.log(`❌ ${username} انفصل`);
    delete bots[username];
  });

  bot.on('error', (err) => console.log(`‼️ خطأ في ${username}:`, err.code));

  // تسجيل الدخول التلقائي
  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// وظيفة الحركة العشوائية
function startRandomMovement(bot) {
  const move = () => {
    if (!bot.entity) return;
    const actions = ['forward', 'left', 'right'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    bot.setControlState(action, true);
    bot.look(Math.random() * Math.PI * 2, 0);
    if (Math.random() > 0.6) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }

    setTimeout(() => {
      bot.clearControlStates();
      setTimeout(move, Math.random() * 3000 + 1000);
    }, 2000);
  };
  move();
}

// --- نظام إدارة الدورة (4 ساعات عمل -> استراحة متبادلة) ---
async function startLifecycle() {
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  while (true) {
    console.log("🚀 بداية الدورة: تشغيل البوتات الاثنين لمدة 4 ساعات...");
    createBot('hashem_Admin1');
    createBot('hashem_Admin2');

    // 1. يقعدون مع بعض 4 ساعات
    await wait(4 * 60 * 60 * 1000);

    // 2. البوت الأول يطلع استراحة (ساعة ونصف) والثاني جالس
    console.log("⏳ استراحة البوت الأول (ساعة ونصف)...");
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();
    await wait(90 * 60 * 1000); 

    // 3. يرجع البوت الأول
    console.log("🔄 عودة البوت الأول...");
    createBot('hashem_Admin1');
    await wait(10000); // ننتظر 10 ثواني للتأكد إنه دخل

    // 4. البوت الثاني يطلع استراحة (ساعة ونصف) والأول جالس
    console.log("⏳ استراحة البوت الثاني (ساعة ونصف)...");
    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();
    await wait(90 * 60 * 1000);

    // 5. يرجع البوت الثاني (كذا اكتملت الدورة)
    console.log("🔄 عودة البوت الثاني وبدء دورة جديدة...");
    createBot('hashem_Admin2');
    await wait(10000);
  }
}

// نظام المراقبة للطوارئ (إذا طفى السيرفر أو صار فصل مفاجئ)
setInterval(() => {
    if (Object.keys(bots).length === 0) {
        console.log("🚨 تنبيه: لا يوجد بوتات! جاري إعادة تشغيل الدورة...");
        createBot('hashem_Admin1');
    }
}, 60000);

// تشغيل النظام
startLifecycle();
