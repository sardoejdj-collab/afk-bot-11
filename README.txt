MINECRAFT AFK BOT (TuronCraft)

Bu bot serverga oddiy o'yinchi sifatida kiradi va doimiy online turadi.
Har 20 soniyada sakraydi, atrofga qaraydi yoki biroz yuradi (AFK kick bo'lmasligi uchun).
Uzilib qolsa, o'zi qayta ulanadi.

ISHGA TUSHIRISH
1) Node.js 18 yoki yangiroq o'rnating (nodejs.org, LTS).
2) Shu papkada terminal oching va yozing:
   npm install
3) config.json ni tekshiring:
   host     - server manzili (turoncraft.play.hosting)
   port     - o'yin porti (20810)
   username - bot nomi (3-16 belgi, harf/raqam/_)
   version  - server versiyasi (1.21.1)
   authPassword - serverda AuthMe bo'lsa parol yozing, bo'lmasa bo'sh qoldiring
4) Ishga tushiring:
   node index.js

MUHIM
- Server "online-mode=false" bo'lishi kerak (server.properties). Aks holda bot kira olmaydi.
- Server versiyasi o'zgarsa, config.json dagi "version" ni ham o'zgartiring.
- Bot kompyuteringiz yoqiq bo'lganda ishlaydi. 24/7 uchun Railway yoki VPS'da ishga tushiring
  (start buyrug'i: npm start).
- Serverda AFK plagin (EssentialsX) bo'lsa, botni config'da "afk-kick" dan tashqari qiling
  yoki unga ruxsat (permission) bering.
