const mineflayer = require('mineflayer')
const fileConfig = require('./config.json')
const env = process.env

// Railway'da Variables orqali sozlash mumkin; bo'lmasa config.json ishlatiladi
const config = {
  host: env.MC_HOST || fileConfig.host,
  port: env.MC_PORT || fileConfig.port,
  username: env.MC_USERNAME || fileConfig.username,
  version: env.MC_VERSION || fileConfig.version,
  authPassword: env.MC_AUTH_PASSWORD !== undefined ? env.MC_AUTH_PASSWORD : fileConfig.authPassword,
  reconnectDelaySeconds: env.MC_RECONNECT_SECONDS || fileConfig.reconnectDelaySeconds,
  antiAfkIntervalSeconds: env.MC_ANTIAFK_SECONDS || fileConfig.antiAfkIntervalSeconds
}

const RECONNECT_MS = Math.max(5, Number(config.reconnectDelaySeconds) || 15) * 1000
const ANTI_AFK_MS = Math.max(5, Number(config.antiAfkIntervalSeconds) || 20) * 1000

let reconnectTimer = null
let failCount = 0

function log (...args) {
  console.log(new Date().toLocaleTimeString(), ...args)
}

function start () {
  log(`Ulanmoqda: ${config.host}:${config.port} (${config.username}, ${config.version})`)

  let finished = false
  let afkTimer = null
  let registered = false
  let loggedIn = false

  const bot = mineflayer.createBot({
    host: config.host,
    port: Number(config.port),
    username: config.username,
    version: config.version,
    auth: 'offline',
    hideErrors: true
  })

  function finish (reason) {
    if (finished) return
    finished = true
    if (afkTimer) clearInterval(afkTimer)
    try { bot.end() } catch (e) { /* ignore */ }
    failCount++
    const delay = Math.min(RECONNECT_MS * Math.min(failCount, 6), 120000)
    log(`Uzildi (${reason}). ${Math.round(delay / 1000)} soniyadan keyin qayta ulanadi...`)
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(start, delay)
  }

  bot.once('spawn', () => {
    failCount = 0
    log('Serverga kirdi!')
    if (afkTimer) clearInterval(afkTimer)
    afkTimer = setInterval(() => antiAfk(bot), ANTI_AFK_MS)
  })

  // AuthMe uchun avtomatik /register va /login
  bot.on('messagestr', (msg) => {
    const text = String(msg).toLowerCase()
    const pass = config.authPassword
    if (!pass) return
    if (text.includes('/register') && !registered) {
      registered = true
      bot.chat(`/register ${pass} ${pass}`)
      log('/register yuborildi')
    } else if (text.includes('/login') && !loggedIn) {
      loggedIn = true
      bot.chat(`/login ${pass}`)
      log('/login yuborildi')
    }
  })

  bot.on('kicked', (reason) => {
    let r = reason
    try { r = JSON.stringify(reason) } catch (e) { /* ignore */ }
    log('Kick qilindi:', r)
  })
  bot.on('error', (err) => {
    log('Xato:', err && err.message ? err.message : err)
    finish('xato')
  })
  bot.on('end', (reason) => finish(reason || 'end'))
}

function antiAfk (bot) {
  if (!bot || !bot.entity) return
  try {
    const action = Math.floor(Math.random() * 4)
    if (action === 0) {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 400)
    } else if (action === 1) {
      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * 0.8
      bot.look(yaw, pitch, false)
    } else if (action === 2) {
      bot.swingArm('right')
    } else {
      bot.setControlState('forward', true)
      setTimeout(() => {
        bot.setControlState('forward', false)
        bot.setControlState('back', true)
        setTimeout(() => bot.setControlState('back', false), 500)
      }, 500)
    }
  } catch (e) {
    log('Anti-AFK xatosi:', e.message)
  }
}

process.on('uncaughtException', (err) => log('Kutilmagan xato:', err && err.message))
process.on('unhandledRejection', (err) => log('Kutilmagan rad etish:', err && err.message))

start()
