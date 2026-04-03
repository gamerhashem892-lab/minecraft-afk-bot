const mineflayer = require('mineflayer');
const puppeteer = require('puppeteer');

// ================= CONFIG =================
const config = {
  host: 'Hshm.aternos.me',
  port: 16821,
  version: false,
  auth: 'offline'
};

// 🔑 حط الكوكي هنا
const COOKIE = "dSd7If5RUVywKU6KXCrX844DtGhNafavSyZUW56o5vBwFpLhMGF9euWSys7pTKgSgl0ZHzSbj2HMXQd1rnkul2sycGCUiLLpkWw";

const bots = {};

// ================= تشغيل السيرفر =================
async function startServer() {
  try {
    console.log("🚀 محاولة تشغيل السيرفر...");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setCookie({
      name: 'ATERNOS_SESSION',
      value: COOKIE,
      domain: 'aternos.org',
      path: '/'
    });

    await page.goto('https://aternos.org/server/', {
      waitUntil: 'networkidle2'
    });

    await page.waitForSelector('#start', { timeout: 15000 });
    await page.click('#start');

    console.log("✅ تم تشغيل السيرفر");

    await browser.close();

  } catch (err) {
    console.log("❌ فشل تشغيل السيرفر:", err.message);
  }
}

// ================= BOT =================
function createBot(username) {
  if (bots[username]) return;

  console.log(`🤖 تشغيل البوت: ${username}`);
  const bot = mineflayer.createBot({ ...config, username });
  bots[username] = bot;

  bot.on('spawn', () => {
    console.log(`✅ ${username} دخل السيرفر`);

    // حركة عشوائية
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

    setTimeout(() => createBot(username), 10000);
  });

  bot.on('error', (err) => {
    console.log(`‼️ خطأ ${username}:`, err.code);
    delete bots[username];
  });

  // تسجيل دخول
  bot.on('messagestr', (msg) => {
    if (msg.includes('/login')) bot.chat('/login 123456');
    if (msg.includes('/register')) bot.chat('/register 123456 123456');
  });
}

// ================= تشغيل البوتات =================
function startBots() {
  createBot('hashem_Admin1');

  setTimeout(() => {
    createBot('hashem_Admin2');
  }, 15000);
}

// ================= مراقبة =================
setInterval(() => {
  ['hashem_Admin1', 'hashem_Admin2'].forEach(name => {
    if (!bots[name]) createBot(name);
  });
}, 60000);

// ================= النظام الكامل =================

// يشغل السيرفر كل دقيقة
setInterval(() => {
  startServer();
}, 60000);

// تشغيل أول مرة
startServer();

// تشغيل البوتات بعد 60 ثانية (عشان السيرفر يشتغل)
setTimeout(() => {
  startBots();
}, 60000);
