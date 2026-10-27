# Xavfsizlik

## Dizayn qarorlari

- **Server va hisob yo‘q.** Parol, token yoki maxfiy kalit yo‘q, hujum yuzasi kichik. O‘quvchi natijalari faqat o‘z brauzerida (localStorage) saqlanadi, hech qayerga yuborilmaydi. Ism so‘ralmaydi.
- **Qattiq CSP** (`index.html`): faqat o‘z domenidan skript va uslub, ichki skript yo‘q, tashqi ulanish yo‘q, `object-src 'none'`.
- **XSS himoyasi.** `innerHTML` ishlatilmaydi, barcha matn DOM orqali qo‘shiladi. Savol va kitob ma’lumoti yuklanganda tur va uzunligi tekshiriladi, noto‘g‘ri yozuvlar tashlab yuboriladi.
- **Havolalar.** PDF yo‘li faqat `materials/*.pdf` yoki `https://` bo‘lishi mumkin, tashqi havolalar `noopener noreferrer` bilan ochiladi.
- **Uchinchi tomon kodi yo‘q.** Kutubxona, CDN va shrift yuklanmaydi.

## Asosiy xavf: ma’lumotni buzish

Ilova ma’lumotni repozitoriydan oladi. Repozitoriyga kirgan odam savollarni almashtira oladi. Himoya:

- GitHub hisobida 2 bosqichli autentifikatsiyani yoqing.
- `main` branch uchun himoyani yoqing: o‘zgarish faqat pull request va tekshiruvdan keyin.
- `.github/workflows/validate.yml` har o‘zgarishda ma’lumotni tekshiradi.
- Repozitoriyga hech qachon parol yoki kalit qo‘ymang.

## Cheklovlar

- GitHub Pages javob sarlavhalarini (masalan, `frame-ancestors`, HSTS) sozlashga ruxsat bermaydi, shuning uchun CSP `<meta>` orqali beriladi.
- localStorage’dagi natijalarni shu qurilmaga kirgan boshqa odam ko‘rishi mumkin.
- Ma’lumot hash bilan imzolanmagan: repozitoriy buzilsa, ilova buzilgan bazani qabul qiladi.

## Xavfsizlik muammosini xabar qilish

Repozitoriydagi “Security → Report a vulnerability” orqali yozing.
