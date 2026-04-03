const mineflayer = require('mineflayer');
const axios = require('axios');

// ================= CONFIG =================
const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: false,
  auth: 'offline'
};

// 🔥 حط الكوكي هنا
const COOKIE = "dSd7If5RUVywKU6KXCrX844DtGhNafavSyZUW56o5vBwFpLhMGF9euWSys7pTKgSgl0ZHzSbj2HMXQd1rnkul2sycGCUiLLpkWw";

const bots = {};

// ================= تشغيل السيرفر =================
async function startServer() {
  try {
    console.log("🚀 محاولة تشغيل السيرفر...");

    await axios.get("https://aternos.org/ajax/server/start", {
      headers: {
        Cookie: COOKIE,
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    console.log("✅ تم إرسال أمر التشغيل");
  } catch (err) {
    console.log("❌ فشل التشغيل:", err.response?.data || err.message);
  }
}

// ================= BOT =================
function createBot(username) {
  if (bots[username]) return;

  console.log(`🤖 تشغيل البوت: ${username}`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('spawn', () => {
    console.log(`✅ ${username} دخل`);

    // ===== 🔄 إعادة تشغيل بعد 3 دقائق (تجربة) =====
    if (username === 'hashem_Admin1' && !bot.didRestart) {
      bot.didRestart = true;

      console.log("⏳ Restart in 3 minutes...");

      setTimeout(() => {
        bot.chat("⚠️ Server restarting in 1 minute!");
      }, 2 * 60 * 1000);

      setTimeout(() => {
        bot.chat("⚠️ Server restarting in 30 seconds!");
      }, 2.5 * 60 * 1000);

      setTimeout(() => {
        bot.chat("⚠️ Server restarting in 10 seconds!");
      }, 2 * 60 * 1000 + 50 * 1000);

      setTimeout(() => {
        console.log("♻️ Stopping server...");
        bot.chat("/stop");
      }, 3 * 60 * 1000);
    }

    // ===== حركة بسيطة =====
    if (!bot.moveInterval) {
      bot.moveInterval = setInterval(() => {
        if (!bot.entity) return;

        const actions = ['forward', 'left', 'right', 'jump'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        bot.setControlState(action, true);

        setTimeout(() => {
          bot.clearControlStates();
        }, 1500);

      }, 3000);
    }
  });

  bot.on('end', () => {
    console.log(`❌ ${username} فصل`);
    delete bots[username];

    setTimeout(() => {
      createBot(username);
    }, 10000);
  });

  bot.on('error', (err) => {
    console.log(`‼️ خطأ ${username}:`, err.code);
    delete bots[username];
  });

  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// ================= تشغيل البوتات =================
createBot('hashem_Admin1');

setTimeout(() => {
  createBot('hashem_Admin2');
}, 15000);

// ================= مراقبة =================
setInterval(() => {
  ['hashem_Admin1', 'hashem_Admin2'].forEach(name => {
    if (!bots[name]) createBot(name);
  });
}, 60000);

// ================= 🔁 تشغيل السيرفر تلقائي =================
setInterval(() => {
  startServer();
}, 60000);

// تشغيل أول مرة
startServer();
