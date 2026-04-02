const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Ultra Stealth Bot: Active 🛠️💎'));
app.listen(process.env.PORT || 3000);

const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: '1.21.1',
  auth: 'offline'
};

const bots = {};
let isGlobalBreak = false;

function createBot(username) {
  if (bots[username]) return;

  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('spawn', () => {
    console.log(`✅ [${username}] بدأ نظام المحاكاة الكاملة (بناء/كسر/حركة).`);
    bot.clearControlStates();

    if (!bot.mainInterval) {
      bot.mainInterval = setInterval(async () => {
        if (!bot.entity || isGlobalBreak) return;

        // 1. حركة عشوائية + قفز
        const actions = ['forward', 'back', 'left', 'right'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        bot.setControlState(action, true);
        if (Math.random() > 0.5) bot.setControlState('jump', true);
        
        await bot.waitForTicks(20); // انتظر ثانية
        bot.clearControlStates();

        // 2. وضعية الشيفـت (Sneak)
        bot.setControlState('sneak', true);
        await bot.waitForTicks(10);

        // 3. محاكاة البناء والكسر (وهمي أو حقيقي إذا معه بلوكات)
        // بنخليه يطالع الأرض ويسوي حركة اليد (Swing Arm) كأنه يبني ويكسر
        const groundBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0));
        if (groundBlock) {
            await bot.lookAt(groundBlock.position);
            bot.swingArm('right'); // حركة اليد للبناء
            await bot.waitForTicks(5);
            bot.swingArm('left');  // حركة اليد للكسر
        }

        bot.setControlState('sneak', false);
        
        // التفات عشوائي أخير
        bot.look(Math.random() * Math.PI * 2, 0);

      }, 25000 + Math.random() * 10000); // تكرار العملية كل 25-35 ثانية
    }
  });

  bot.on('end', () => {
    if (bot.mainInterval) clearInterval(bot.mainInterval);
    delete bots[username];
  });

  bot.on('error', (err) => console.log(`‼️ خطأ ${username}:`, err.code));

  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// --- نظام الدورة والمراقبة (نفس منطقك السابق) ---
async function startLifecycle() {
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  while (true) {
    isGlobalBreak = false;
    createBot('hashem_Admin1');
    createBot('hashem_Admin2');
    await wait(4 * 60 * 60 * 1000); 

    isGlobalBreak = true;
    if (bots['hashem_Admin1']) bots['hashem_Admin1'].quit();
    await wait(90 * 60 * 1000); 
    createBot('hashem_Admin1');
    await wait(30000); 

    if (bots['hashem_Admin2']) bots['hashem_Admin2'].quit();
    await wait(90 * 60 * 1000);
    createBot('hashem_Admin2');
  }
}

setInterval(() => {
    if (isGlobalBreak) return;
    if (!bots['hashem_Admin1']) createBot('hashem_Admin1');
    if (!bots['hashem_Admin2']) createBot('hashem_Admin2');
}, 60000);

startLifecycle();
