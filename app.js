"use strict";
// Taxminiy chegaralar (tekshirib o‘zgartiring). Imtihon: 20 savol, 25 daqiqa, 18 to‘g‘ri javob.
const KEY="nazariya-v1",PASS=0.9,GRADE=4,N=20,PASSN=18,TQ=10,TIME=1500;
const $=s=>document.querySelector(s);
const PROP=["checked","value","disabled","selected"];
// Xavfsizlik: faqat DOM orqali matn qo‘shiladi (innerHTML ishlatilmaydi).
const h=(t,a={},...c)=>{const e=document.createElement(t);for(const k in a){const v=a[k];if(v==null||v===false)continue;if(k==="class")e.className=v;else if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(PROP.includes(k))e[k]=v;else e.setAttribute(k,v===true?"":v)}c.flat().forEach(x=>e.append(x instanceof Node?x:String(x)));return e};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>String(s).toLowerCase().replace(/[‘’ʻʼ'`]/g,"").replace(/[^\p{L}\p{N} ]/gu," ").replace(/\s+/g," ").trim();
const safe=u=>typeof u==="string"&&/^(materials\/[\w\-./]+\.pdf|https:\/\/[^\s"'<>]+)$/i.test(u);
const link=(b,p)=>b.file+(p?"#page="+p:"");
const toast=t=>{const e=$("#msg");e.textContent=t;setTimeout(()=>{if(e.textContent===t)e.textContent=""},4000)};

let S={cov:{},tq:{},mk:[]};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(KEY)))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast("Saqlab bo‘lmadi.")}};

let D={books:[],qs:[],ver:"",demo:false},Q=null,timer=null;
const okQ=q=>q&&typeof q.id==="string"&&typeof q.topic==="string"&&typeof q.text==="string"&&q.text.length<600&&Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=6&&q.options.every(o=>typeof o==="string"&&o.length<300)&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length;
const okB=b=>b&&typeof b.id==="string"&&typeof b.title==="string"&&Array.isArray(b.topics)&&b.topics.every(t=>t&&typeof t.id==="string"&&typeof t.title==="string");
async function getJSON(p){const r=await fetch(p,{cache:"no-cache"});if(!r.ok)throw 0;return r.json()}
async function loadData(){
  try{
    const [b,q]=await Promise.all([getJSON("data/books.json"),getJSON("data/questions.json")]);
    const books=(b.books||[]).filter(okB),qs=(q.questions||[]).filter(okQ);
    if(!books.length||!qs.length)throw 0;
    D={books,qs,ver:String(q.version||""),demo:!!q.demo};
    try{localStorage.setItem(KEY+"-d",JSON.stringify(D))}catch(e){}
  }catch(e){
    try{const c=JSON.parse(localStorage.getItem(KEY+"-d"));if(c&&Array.isArray(c.qs)&&Array.isArray(c.books))D=c}catch(_){}
  }
}

const topics=()=>D.books.flatMap(b=>b.topics.map(t=>({...t,book:b})));
const acc=a=>a.length?a.reduce((s,x)=>s+x.c,0)/a.reduce((s,x)=>s+x.n,0):null;
const tAcc=id=>acc((S.tq[id]||[]).slice(-2));
const tOk=id=>{const c=S.cov[id],a=tAcc(id);return !!(c&&c.on&&c.g>=GRADE&&a!==null&&a>=PASS)};
function ready(){
  const why=[],cov=topics().filter(t=>S.cov[t.id]&&S.cov[t.id].on);
  if(!cov.length)why.push("Hali bironta mavzu “o‘tdim” deb belgilanmagan.");
  cov.forEach(t=>{const c=S.cov[t.id],a=tAcc(t.id);
    if(!(c.g>=GRADE))why.push(`${t.title}: darsdagi baho ${c.g||"yo‘q"} (kerak: ${GRADE} yoki 5)`);
    if(a===null)why.push(`${t.title}: hali test yechilmagan`);
    else if(a<PASS)why.push(`${t.title}: testda ${Math.round(a*100)}% (kerak: ${Math.round(PASS*100)}% dan yuqori)`)});
  const m=S.mk.slice(-3),mp=m.filter(x=>x.c>=x.p).length;
  if(m.length<3||mp<3)why.push(`Imtihon sinovi: oxirgi 3 tadan ${mp} tasi o‘tgan (3 tasi kerak)`);
  return{ok:!why.length,why};
}

function cells(m){
  const n=m.n,p=m.p,c=m.c,w=h("div",{class:"cells",role:"img","aria-label":`Natija: ${c} / ${n}, o‘tish chegarasi ${p}`});
  for(let i=0;i<n;i++)w.append(h("span",{class:(i<c?"f ":"")+(i===p-1?"line":"")}));
  return w;
}

function viewReady(){
  const r=ready(),m=S.mk.at(-1)||{c:0,n:N,p:PASSN};
  return h("section",{class:"card"},h("h2",{},"Tayyorlik"),cells(m),
    h("p",{class:"m"},S.mk.length?`Oxirgi imtihon sinovi: ${m.c} / ${m.n} (o‘tish: ${m.p})`:`Imtihon sinovi hali yechilmagan. Imtihon: ${N} savol, ${TIME/60} daqiqa, o‘tish: ${PASSN}.`),
    h("p",{},h("span",{class:"tag "+(r.ok?"ok":"bad")},r.ok?"Tayyor":"Hali tayyor emas")),
    r.ok?h("p",{class:"m"},"Barcha o‘tilgan mavzular va oxirgi 3 sinov talabga javob beradi."):h("ul",{},r.why.map(x=>h("li",{},x))));
}

function viewTopics(){
  const w=h("section",{class:"card"},h("h2",{},"Mavzular"));
  const all=topics();
  if(!all.length)w.append(h("p",{class:"m"},"Mavzu yo‘q."));
  all.forEach(t=>{
    const c=S.cov[t.id]||{on:false,g:0},a=tAcc(t.id),n=D.qs.filter(q=>q.topic===t.id).length;
    const cb=h("input",{type:"checkbox",id:"c-"+t.id,checked:c.on,onchange:e=>{S.cov[t.id]={on:e.target.checked,g:(S.cov[t.id]||{}).g||0};save();render()}});
    const g=h("select",{"aria-label":"Darsdagi baho: "+t.title,disabled:!c.on,onchange:e=>{S.cov[t.id]={...S.cov[t.id],g:+e.target.value};save();render()}},
      [0,1,2,3,4,5].map(v=>h("option",{value:String(v),selected:v===c.g},v?String(v):"Baho yo‘q")));
    w.append(h("div",{class:"item"},
      h("div",{class:"row"},cb,h("label",{for:"c-"+t.id},h("b",{},t.title))),
      h("div",{class:"row"},g,h("span",{class:"m"},a===null?"Test yechilmagan":`Oxirgi testlar: ${Math.round(a*100)}%`),tOk(t.id)?h("span",{class:"tag ok"},"tayyor"):""),
      h("div",{class:"row"},h("button",{disabled:!n,onclick:()=>startQuiz("topic",t.id)},`Tez test (${Math.min(TQ,n)} savol)`),
        safe(t.book.file)?h("a",{href:link(t.book,t.page),target:"_blank",rel:"noopener noreferrer"},"Kitobda o‘qish"):"")));
  });
  return w;
}

function viewBooks(){
  const out=h("div",{}),inp=h("input",{type:"search",placeholder:"Kitob nomini yozing",autocomplete:"off","aria-label":"Kitob nomi"});
  inp.addEventListener("input",()=>{
    const w=norm(inp.value).split(" ").filter(Boolean);out.replaceChildren();if(!w.length)return;
    const f=D.books.filter(b=>{const s=norm(b.title+" "+(b.author||""));return w.every(x=>s.includes(x))});
    if(!f.length)return out.append(h("p",{class:"m"},"Katalogda topilmadi. Kitobni data/books.json ga qo‘shing."));
    f.forEach(b=>out.append(h("div",{class:"item"},h("b",{},b.title),
      safe(b.file)?h("p",{},h("a",{href:link(b),target:"_blank",rel:"noopener noreferrer"},"PDF ochish")):h("p",{class:"m"},"PDF havolasi yo‘q"),
      h("p",{class:"m"},b.topics.length+" mavzu"))));
  });
  return h("section",{class:"card"},h("h2",{},"Kitob qidirish"),inp,out);
}

function startQuiz(kind,tid){
  const pool=kind==="mock"?D.qs:D.qs.filter(q=>q.topic===tid);
  if(!pool.length)return toast("Savol topilmadi.");
  const n=Math.min(kind==="mock"?N:TQ,pool.length);
  Q={kind,tid,i:0,done:false,end:Date.now()+TIME*1000,p:kind==="mock"&&n===N?PASSN:Math.ceil(n*PASS),
    items:shuffle(pool).slice(0,n).map(q=>({q,idx:shuffle(q.options.map((_,i)=>i)),a:null}))};
  clearInterval(timer);if(kind==="mock")timer=setInterval(tick,1000);
  renderQuiz();
}
function tick(){
  if(!Q||Q.done)return clearInterval(timer);
  const s=Math.max(0,Math.round((Q.end-Date.now())/1000)),e=$("#t");
  if(e)e.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  if(!s)finish();
}
function renderQuiz(){
  const it=Q.items[Q.i],live=Q.kind!=="mock",ans=live&&it.a!==null,last=Q.i===Q.items.length-1;
  const pick=oi=>{if(ans)return;it.a=oi;if(!live){last?finish():(Q.i++,renderQuiz())}else renderQuiz()};
  $("#app").replaceChildren(h("section",{class:"card"},
    h("div",{class:"row top"},h("b",{},`${Q.i+1} / ${Q.items.length}`),Q.kind==="mock"?h("b",{id:"t"},"25:00"):"",
      h("button",{class:"sec",onclick:()=>{if(confirm("Testni tugatasizmi? Javob berilmaganlar xato hisoblanadi."))finish()}},"Tugatish")),
    h("p",{class:"qt"},it.q.text),
    h("div",{class:"opts",role:"group","aria-label":"Javob variantlari"},it.idx.map((oi,k)=>
      h("button",{class:"opt "+(ans?(oi===it.q.answer?"ok":oi===it.a?"bad":""):""),disabled:ans,onclick:()=>pick(oi)},h("span",{class:"ltr"},"ABCDEF"[k]),it.q.options[oi]))),
    ans?h("button",{onclick:()=>{last?finish():(Q.i++,renderQuiz())}},last?"Natijani ko‘rish":"Keyingi savol"):""));
  if(Q.kind==="mock")tick();
}
function finish(){
  if(!Q||Q.done)return;Q.done=true;clearInterval(timer);
  const c=Q.items.filter(x=>x.a===x.q.answer).length,n=Q.items.length,rec={c,n,p:Q.p,t:Date.now()};
  if(Q.kind==="mock")S.mk=S.mk.concat(rec).slice(-10);else S.tq[Q.tid]=(S.tq[Q.tid]||[]).concat(rec).slice(-10);
  save();
  const wrong=Q.items.filter(x=>x.a!==x.q.answer);
  $("#app").replaceChildren(h("section",{class:"card"},h("h2",{},"Natija"),cells(rec),
    h("p",{},h("b",{},`${c} / ${n}`)," ",h("span",{class:"tag "+(c>=Q.p?"ok":"bad")},c>=Q.p?"O‘tdi":"O‘tmadi")),
    h("p",{class:"m"},`O‘tish chegarasi: ${Q.p}`),
    wrong.length?h("div",{},h("h2",{},"Xatolar"),wrong.map(x=>h("div",{class:"item"},h("p",{},h("b",{},x.q.text)),
      h("p",{class:"m"},x.a===null?"Javob berilmagan":"Sizning javobingiz: "+x.q.options[x.a]),h("p",{},"To‘g‘ri javob: "+x.q.options[x.q.answer])))):h("p",{},"Xato yo‘q."),
    h("button",{onclick:()=>{Q=null;render()}},"Bosh sahifaga qaytish")));
}

function render(){
  $("#app").replaceChildren(
    h("p",{class:"m"},`Savollar bazasi: ${D.ver||"—"} · ${D.qs.length} savol · `,h("b",{},navigator.onLine?"onlayn":"oflayn")),
    D.qs.length?"":h("p",{class:"warn"},"Ma’lumot yuklanmadi. Internetga ulanib, sahifani qayta oching."),
    D.demo?h("p",{class:"warn"},"Bu namuna savollar, rasmiy imtihon savollari emas. data/questions.json ni o‘z bazangiz bilan almashtiring."):"",
    viewReady(),
    h("section",{class:"card"},h("button",{disabled:!D.qs.length,onclick:()=>startQuiz("mock")},`Imtihon sinovi (${Math.min(N,D.qs.length)} savol, ${TIME/60} daqiqa)`)),
    viewTopics(),viewBooks());
}

loadData().then(render);
window.addEventListener("online",()=>loadData().then(()=>{if(!Q)render()}));
window.addEventListener("offline",()=>{if(!Q)render()});
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
