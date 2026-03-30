 const mineflayer = require('mineflayer')

const botArgs = {
  host: '46.224.7.62',
  port: 25801,
  username: 'Warrior_H_2', // تقدر تغير الاسم للي تحب
  version: '1.21.1',     // تأكد إنها نفس نسخة السيرفر الجديد
  auth: 'offline'        // بما أنه سيرفر شخصي فغالباً مكرك
}

let bot

function createBot() {
  bot = mineflayer.createBot(botArgs)

  bot.on('spawn', () => {
    console.log('✅ البوت دخل السيرفر الجديد بنجاح!')
  })

  // إذا انطرد أو فصل السيرفر
  bot.on('end', () => {
    console.log('⚠️ فصل الاتصال، جاري إعادة المحاولة بعد 10 ثواني...')
    setTimeout(createBot, 10000)
  })

  // حل مشكلة الكراش أو الخطأ اللي طلع لك (Timeout)
  bot.on('error', (err) => {
    if (err.code === 'ETIMEDOUT') {
      console.log('❌ السيرفر لا يستجيب (Timeout)، قد يكون طافي.')
    } else {
      console.log('❌ حدث خطأ: ', err.message)
    }
  })

  // رد بسيط عشان تتأكد إنه شغال
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message === '!status') {
      bot.chat('أنا شغال وأموري تمام!')
    }
  })
}

createBot()
