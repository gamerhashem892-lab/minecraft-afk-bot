const mineflayer = require('mineflayer')

// إعدادات الاتصال بالسيرفر الجديد
const botArgs = {
  host: 'Hshm.aternos.me',
  port: 16821,
  username: 'Warrior_H_2',
  version: false, // خليناها false عشان البوت يكتشف النسخة تلقائياً ويحل مشكلة "Not Supported"
  auth: 'offline',
  checkTimeoutInterval: 60000 // زيادة وقت الانتظار لمنع الـ Timeout
}

let bot

function createBot() {
  console.log('🔄 جاري محاولة الاتصال بالسيرفر...')
  bot = mineflayer.createBot(botArgs)

  // عند الدخول بنجاح
  bot.once('spawn', () => {
    console.log('✅ تم دخول البوت بنجاح لنسخة 1.21.1')
    bot.chat('أهلاً! أنا بوت AFK شغال 24/7.')
    
    // بدء حركة بسيطة (Anti-AFK) كل 30 ثانية عشان ما يطردك السيرفر
    setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)
    }, 30000)
  })

  // الرد على الشات
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message === '!ping') {
      bot.chat(`هلا ${username}، أنا شغال وأموري تمام!`)
    }
  })

  // إعادة الاتصال التلقائي في حال الكراش أو الفصل
  bot.on('end', (reason) => {
    console.log(`⚠️ فصل البوت بسبب: ${reason}. جاري إعادة المحاولة بعد 10 ثواني...`)
    setTimeout(createBot, 10000)
  })

  // التعامل مع الأخطاء (مثل ETIMEDOUT)
  bot.on('error', (err) => {
    if (err.code === 'ETIMEDOUT') {
      console.log('❌ خطأ: السيرفر لا يستجيب. تأكد أنه يعمل.')
    } else {
      console.log('❌ حدث خطأ غير متوقع:', err.message)
    }
  })
}

// تشغيل البوت لأول مرة
createBot()
