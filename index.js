const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

function createBot(username, leaveDelay = 0, stayForever = false) {
  const bot = mineflayer.createBot({
    host: 'Hshm.aternos.me',
    port: 16821,
    username: username,
    version: '1.20.1'
  });

  bot.loadPlugin(pathfinder);

  bot.on('login', () => {
    console.log(`${username} دخل ✅`);
  });

  bot.on('spawn', () => {
    console.log(`${username} اشتغل 🎮`);

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);

    function randomAction() {
      if (!bot.entity) return;

      const actions = ['walk', 'build', 'jump'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      bot.clearControlStates();

      // 🚶‍♂️ مشي عشوائي
      if (action === 'walk') {
        const x = bot.entity.position.x + (Math.random() * 10 - 5);
        const z = bot.entity.position.z + (Math.random() * 10 - 5);

        bot.pathfinder.setMovements(defaultMove);
        bot.pathfinder.setGoal(new goals.GoalBlock(x, bot.entity.position.y, z));
      }

      // 🧱 يبني ثم يكسر
      if (action === 'build') {
        const block = bot.blockAt(bot.entity.position.offset(0, -1, 0));
        const item = bot.inventory.items()[0];

        if (block && item) {
          bot.equip(item, 'hand').then(() => {
            bot.placeBlock(block, { x: 0, y: 1, z: 0 }).then(() => {
              setTimeout(() => {
                const placed = bot.blockAt(bot.entity.position.offset(0, 1, 0));
                if (placed) bot.dig(placed);
              }, 2000);
            });
          }).catch(() => {});
        }
      }

      // 🦘 نط
      if (action === 'jump') {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }

      setTimeout(randomAction, Math.random() * 5000 + 3000);
    }

    randomAction();

    // ⏰ نظام 3 ساعات (إلا إذا ثابت)
    if (!stayForever) {
      setTimeout(() => {
        console.log(`${username} يطلع مؤقت ⏳`);
        bot.quit();

        setTimeout(() => {
          createBot(username, leaveDelay, stayForever);
        }, 30000); // يرجع بعد 30 ثانية

      }, (3 * 60 * 60 * 1000) + leaveDelay);
    }
  });

  function reconnect() {
    console.log(`${username} يعيد الاتصال 🔁`);
    setTimeout(() => createBot(username, leaveDelay, stayForever), 5000);
  }

  bot.on('end', reconnect);

  bot.on('error', (err) => {
    console.log(`${username} خطأ:`, err.code);
    reconnect();
  });

  bot.on('kicked', (reason) => {
    console.log(`${username} انطرد:`, reason);
    reconnect();
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

// 🔥 واحد ثابت (ما يطلع)
createBot('hashem_Admin1', 0, true);

// 🔥 واحد يطلع ويرجع كل 3 ساعات
setTimeout(() => {
  createBot('hashem_Admin2', 60000, false);
}, 10000);
