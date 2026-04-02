const mineflayer = require('mineflayer');
const express = require('express');

// تشغيل سيرفر ويب صغير عشان Railway ما يطفي الخدمة
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
let activeBotsList = []; // القائمة التي تسمح للمراقبة بالعمل

function createBot(username) {
  if (bots[username]) return;

  console.log(`📡 [${username}] جاري محاولة الدخول للسيرفر...`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  // --- وظيفة التحريك والأكشن (بناء/كسر/نط) ---
  const startActing = () => {
    if (bot.moveInterval) clearInterval(bot.moveInterval);
    
    console.log(`🚀 [${username}] بدأ نظام المحاكاة الذكي!`);
    bot.moveInterval = setInterval(async () => {
      if (!bot.entity) return;

      try {
        // 1. القفز والمشي العشوائي
        const actions = ['forward', 'back', 'left', 'right', 'jump'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        bot.setControlState(action, true);
        await new Promise(r => setTimeout(r, 1000));
        bot.clearControlStates();

        // 2. محاكاة وضع بلوكة وكسرها (شيفت + حركة يد)
        const blockBelow = bot.blockAt(bot.entity.position.offset(0, -1, 0));
        if (blockBelow) {
            await bot.lookAt(blockBelow.position);
            bot.setControlState('sneak', true);
            bot.swingArm('right'); // كأنه يبني
            await new Promise(r => setTimeout(r, 500));
            bot.swingArm('left');  // كأنه يكسر
            bot.setControlState('sneak', false);
        }

        // 3. التفات الرأس
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5));

      } catch (err) {
        // تجنب الكراش في حال وجود لاغ
      }
    }, 20000); // تكرار كل 20 ثانية
  };

  bot.on('spawn', () => {
    console.log(`✅ [${username}] رسبن بنجاح.`);
    // الانتظار 5 ثواني للتأكد من تحميل العالم ثم البدء
    setTimeout(startActing, 5000);
  });

  bot.on('end', (reason) => {
    console.log(`❌ [${username}] فصل من السيرفر: ${reason}`);
    if (bot.moveInterval) clearInterval(bot.moveInterval);
    delete bots[username];
  });

  bot.on('error', (err) => console.log(`‼️ خطأ تقني في ${username}:`, err.code));

  // --- نظام تسجيل الدخول التلقائي ---
  bot.on('messagestr', (msg) => {
    if (msg.includes('/login') || msg.includes('تسجيل الدخول') || msg.includes('قم بـ')) {
        bot.chat('/login 123456');
    }
    if (msg.includes('/register')) {
        bot.chat('/register 123456 123456');
    }
  });
}

// --- نظام إدارة الدورة (4 ساعات عمل -> استراحة 90 دقيقة) ---
async function startLifecycle() {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  
  while (true) {
    console.log("🔄 دورة جديدة: تشغيل Admin1 و Admin2 معاً...");
    activeBotsList = ['hashem_Admin1', 'hashem_Admin2'];
    createBot('hashem_Admin1');
    createBot('hashem_Admin2');
    
    await wait(4 * 60 * 60 * 1000); // عمل لمدة 4 ساعات

    // استراحة متبادلة لمنع كشف الـ IP
    console.log("⏳ استراحة Admin1 لمدة 90 دقيقة...");
    activeBotsList = ['hashem_Admin2']; 
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();
    await wait(90 * 60 * 1000); 

    console.log("🔄 عودة Admin1 واستراحة Admin2...");
    activeBotsList = ['hashem_Admin1'];
    createBot('hashem_Admin1');
    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();
    await wait(90 * 60 * 1000);
  }
}

// --- نظام المراقبة (The Guard) يفحص كل دقيقة ---
setInterval(() => {
    activeBotsList.forEach(name => {
        if (!bots[name]) {
            console.log(`🚨 المراقبة: البوت ${name} مفقود، جاري إعادته...`);
            createBot(name);
        }
    });
}, 60000);

// تشغيل النظام
startLifecycle();
