# Nazariy imtihonga tayyorgarlik

Haydovchilik guvohnomasining nazariy imtihoniga tayyorlovchi veb-ilova (PWA). GitHub Pages’da ishlaydi, serversiz, oflayn ham ochiladi. Internet bo‘lganda savollar bazasi va kitoblar katalogi o‘zi yangilanadi.

**Imtihon formati** (Yo‘l harakati xavfsizligi xizmati bayonotiga ko‘ra): 20 savol, 25 daqiqa, kamida 18 to‘g‘ri javob. Ilova sinov rejimida shu qoidani ishlatadi. A1 toifasi uchun chegara boshqacha (16), bu hozircha hisobga olinmagan.

## Nima qiladi

1. **Kitob qidirish.** Kitob nomini yozasiz, katalogdan (`data/books.json`) mos kitob va PDF havolasi chiqadi.
2. **Mavzu belgilash.** O‘quvchi “o‘tdim” deb belgilaydi va darsda olgan bahosini (1–5) kiritadi.
3. **Tez test.** Tanlangan mavzudan 10 ta tasodifiy savol, xatolar tahlili bilan.
4. **Imtihon sinovi.** Barcha mavzulardan 20 savol, 25 daqiqa taymer, natija oxirida ko‘rsatiladi.
5. **Tayyor / tayyor emas.** Qoida: o‘tilgan har bir mavzuda baho 4–5 va oxirgi 2 testda 90%+, hamda oxirgi 3 imtihon sinovi o‘tgan bo‘lishi. Nima yetishmasligi ro‘yxat bilan ko‘rsatiladi.

## Fayl tuzilishi

```
index.html, style.css, app.js   ilova
sw.js, manifest.webmanifest     oflayn ishlash va o‘rnatish
data/books.json                 kitoblar va mavzular katalogi
data/questions.json             savollar bazasi (versiya bilan)
materials/                      PDF kitoblar (faqat huquqi bor)
scripts/validate.mjs            ma’lumotni tekshirish
.github/workflows/validate.yml  har o‘zgarishda avtomatik tekshiruv
```

## GitHub’ga joylash

1. Yangi repozitoriy yarating va barcha fayllarni yuklang (papkalar bilan, `.github` ham).
2. Settings → Pages → “Deploy from a branch” → `main` / root.
3. Ilova `https://<nom>.github.io/<repo>/` manzilida ochiladi. Telefonda “Bosh ekranga qo‘shish” mumkin.

## Savollarni yangilash

`data/questions.json` ni GitHub’da tahrirlab commit qiling va `version` qiymatini o‘zgartiring. Action ma’lumotni tekshiradi, Pages qayta joylanadi, o‘quvchilarning ilovasi keyingi onlayn ochilishda yangi bazani oladi. Tekshiruvdan o‘tmagan o‘zgarishni qabul qilmang.

Savol formati:

```json
{ "id": "q1", "topic": "belgilar", "text": "Savol matni", "options": ["A", "B", "C"], "answer": 0 }
```

`topic` qiymati `books.json` dagi mavzu `id` si bilan bir xil bo‘lishi shart.

## Nima qilinmagan va nega

- **Internetdan PDFni o‘zi qidirib topish yo‘q.** Statik sayt internetni qidira olmaydi, tasodifiy saytdan PDF olish esa mualliflik huquqi va xavfsizlik xavfi tug‘diradi. O‘rniga katalog: kitobni bir marta `books.json` ga qo‘shasiz.
- **Boshqa saytlardan savollarni avtomatik yuklab olish yo‘q.** Rasmiy, ochiq va qayta ishlatishga ruxsat berilgan savollar bazasini topa olmadim. Mavjud savol to‘plamlarining huquqi noma’lum. Ma’lumot manbasi sizning o‘z yoki litsenziyalangan bazangiz bo‘lishi kerak.
- **Namuna savollar (8 ta)** rasmiy emas, faqat ilova ishlashini ko‘rsatish uchun. Haqiqiy qoidalar bilan solishtirib, o‘zingizning bazangizga almashtiring.
- **Darsdagi baho** o‘quvchining qurilmasida kiritiladi, o‘qituvchi tomonidan tasdiqlanmaydi va qurilmalar o‘rtasida sinxronlanmaydi. Tasdiqlangan baho uchun server kerak (keyingi qadam).
- Savol rasmlari va PDFlarni oflayn keshlash hali yo‘q.
- Tayyorlik chegaralari (`GRADE`, `PASS` va boshqalar, `app.js` boshida) taxminiy, sinov davomida to‘g‘rilang. Ilova imtihondan o‘tishni kafolatlamaydi.

## Xavfsizlik

Qisqacha: serversiz, hisobsiz, shaxsiy ma’lumotsiz; qattiq CSP; matn faqat DOM orqali qo‘shiladi; savollar yuklanganda tekshiriladi. Batafsil: [SECURITY.md](SECURITY.md).
