const mineflayer = require('mineflayer');

let botsOnline = 0;
const botRoles = {};
const botNames = ['hashem_Admin1', 'hashem_Admin2', 'hashem_Backup'];

function createBot(username, role) {
  const bot = mineflayer.createBot({
    host: 'Hshm.aternos.me',
    port: 16821,
    username: username,
    version: '1.20.1'
  });

  botRoles[username] = role;

  bot.on('login', () => {
    console.log(`${username} دخل ✅`);
    botsOnline++;
  });

  bot.on('spawn', () => {
    console.log(`${username} اشتغل 🎮`);

    // حركة واقعية أمام اللاعبين
    setInterval(() => {
      if (!bot.entity) return;

      const actions = ['forward', 'back', 'left', 'right'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      bot.clearControlStates();
      bot.setControlState(action, true);

      // يلف الرأس عشوائي
      bot.look(
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI
      );

      // أحيانًا ينط
      if (Math.random() > 0.7) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }

      // أحيانًا يبني أو يكسر بلوك تحتهم
      try {
        const blockBelow = bot.blockAt(bot.entity.position.offset(0, -1, 0));
        if (blockBelow) {
          if (Math.random() > 0.5) {
            bot.dig(blockBelow).catch(() => {});
          } else {
            bot.placeBlock(blockBelow, bot.entity.position.offset(1, 0, 0)).catch(() => {});
          }
        }
      } catch (e) {}

      // يوقف الحركة بعد 2 ثانية
      setTimeout(() => bot.clearControlStates(), 2000);

    }, 4000);

    schedule(bot, username, role);
    monitorServer();
  });

  function schedule(bot, username, role) {
    if (role === 1) {
      setTimeout(() => leaveAndReturn(bot, username, role), 4 * 60 * 60 * 1000);
      setTimeout(() => leaveAndReturn(bot, username, role), 7.5 * 60 * 60 * 1000);
    } else if (role === 2) {
      setTimeout(() => leaveAndReturn(bot, username, role), 5.5 * 60 * 60 * 1000);
      setTimeout(() => leaveAndReturn(bot, username, role), 9 * 60 * 60 * 1000);
    }
  }

  function leaveAndReturn(bot, username, role) {
    if (botsOnline <= 1) {
      console.log(`${username} كان بيطلع لكن هو آخر بوت ❌`);
      return;
    }

    console.log(`${username} يطلع ⏳`);
    bot.quit();

    setTimeout(() => {
      createBot(username, role);
    }, 90 * 60 * 1000);
  }

  function reconnect() {
    botsOnline = Math.max(0, botsOnline - 1);
    console.log(`${username} انفصل ❌ عدد البوتات: ${botsOnline}`);
    setTimeout(() => createBot(username, role), 5000);
  }

  bot.on('end', reconnect);
  bot.on('error', (err) => { console.log(`${username} خطأ:`, err.code); reconnect(); });
  bot.on('kicked', (reason) => { console.log(`${username} انطرد:`, reason); reconnect(); });
  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

function monitorServer() {
  setInterval(() => {
    if (botsOnline < 1) {
      console.log('🚨 السيرفر فاضي! تشغيل البوت الاحتياطي 🚨');
      createBot('hashem_Backup', 3);
    }
  }, 60000);
}

// 🔥 تشغيل البوتات الأساسية
createBot('hashem_Admin1', 1);
setTimeout(() => createBot('hashem_Admin2', 2), 10000);
