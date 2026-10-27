// Ma’lumot fayllarini tekshiradi. Xato bo‘lsa 1 kod bilan chiqadi (GitHub Actions ishlatadi).
import { readFileSync } from "node:fs";
const rd = p => JSON.parse(readFileSync(p, "utf8"));
const err = [], e = m => err.push(m);
const B = rd("data/books.json"), Q = rd("data/questions.json");
const topics = new Set(), bid = new Set();
for (const b of B.books || []) {
  if (bid.has(b.id)) e("Takroriy kitob id: " + b.id);
  bid.add(b.id);
  if (b.file && !/^(materials\/[\w\-./]+\.pdf|https:\/\/\S+)$/i.test(b.file)) e("Noto‘g‘ri fayl yo‘li: " + b.id);
  for (const t of b.topics || []) { if (topics.has(t.id)) e("Takroriy mavzu id: " + t.id); topics.add(t.id); }
}
const qid = new Set();
for (const q of Q.questions || []) {
  const w = "Savol " + q.id + ": ";
  if (qid.has(q.id)) e(w + "takroriy id");
  qid.add(q.id);
  if (!topics.has(q.topic)) e(w + "noma’lum mavzu " + q.topic);
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) e(w + "variantlar soni noto‘g‘ri");
  else {
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) e(w + "to‘g‘ri javob indeksi noto‘g‘ri");
    if (new Set(q.options).size !== q.options.length) e(w + "takroriy variant");
  }
  if (typeof q.text !== "string" || !q.text.trim() || q.text.length > 600) e(w + "matn noto‘g‘ri");
  if (JSON.stringify(q).includes("<")) e(w + "“<” belgisi taqiqlangan");
}
if (!String(Q.version || "").length) e("questions.json: version kerak");
if (err.length) { console.error(err.join("\n")); process.exit(1); }
console.log(`OK: ${Q.questions.length} savol, ${topics.size} mavzu`);
