const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Testing Stability...'));
app.listen(process.env.PORT || 3000);

const config = {
    host: 'hshm.aternos.me',
    port: 16821,
    version: '1.21.1'
};

function startBot(name) {
    console.log(`📡 محاولة دخول هادئة لـ [${name}]...`);

    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: name,
        version: config.version,
        // ⚠️ تعطيل كل شيء قد يسبب طرد
        physicsEnabled: false, 
        loadInternalPlugins: false 
    });

    bot.on('spawn', () => {
        console.log(`✅ [${name}] داخل السيرفر الآن. لا تلمس أي شيء!`);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ [${name}] فصل بسبب: ${reason}`);
        setTimeout(() => startBot(name), 30000); // محاولة بعد 30 ثانية
    });

    bot.on('error', (err) => {
        console.log(`❌ [${name}] خطأ: ${err.message}`);
    });
}

// ابدأ ببوت واحد فقط للتجربة
startBot('Hshm_Test_99');
