/* Shared data model for the concept pages. Loads after ../data.js.
   Add ?demo to the URL to overlay three sample setlists so the chart has
   varied counts and tags. The page shows a banner when that is on. */
(function(){
const S=window.SONGS;
const DEMO=/[?&]demo/.test(location.search);
let SHOWS=window.SHOWS.map(s=>Object.assign({},s,{setlist:[...s.setlist]}));
let BUST=Object.assign({},window.BUSTOUTS||{});
if(DEMO){
  SHOWS[1].setlist=["The Joke","The Story","Follow","Pride and Joy","Hallelujah","A Case of You","Creep","Madman Across the Water","Turpentine","Raise Hell","Crowded Table","Throw It All Away","The Eye","Party of One","Beginning to Feel the Years","Most of All","Human","Dreams","Sinners, Saints and Fools"];
  SHOWS[2].setlist=["The Joke","The Story","Follow","Pride and Joy","The Eye","Madman Across the Water","Raise Hell","Folsom Prison Blues","Mama Werewolf","Wherever Is Your Heart","Hallelujah","Dying Day","Mainstream Kid","The Mother","Crowded Table","Forever Young","Going to California","Keep Your Heart Young","Bring My Flowers Now"];
  SHOWS[3].setlist=["The Joke","The Story","Pride and Joy","Turpentine","Over the Rainbow","Dreams","That Wasn't Me","Creep","Hard Way Home","Cannonball","Have You Ever","Right on Time","You and Me on the Rock","Josephine","Forever Young","Broken Horses","Raise Hell"];
  BUST["throw it all away"]=2012; BUST["going to california"]=2019;
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>s.toLowerCase().replace(/[’']/g,"'").replace(/&/g,'and').replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const ORIG=new Set(['Studio Originals','Who Believes in Angels? (with Elton John)','Singles / Soundtrack','The Highwomen']);
const byTitle={}; S.forEach(x=>{ if(!byTitle[norm(x.t)]) byTitle[norm(x.t)]=x; });
const counts={}, lastShow={};
SHOWS.forEach(sh=>sh.setlist.forEach(t=>{const k=norm(t); counts[k]=(counts[k]||0)+1; lastShow[k]=sh;}));
const played=t=>counts[norm(t)]||0;
const playedShows=SHOWS.filter(s=>s.setlist.length);
const done=playedShows.length;
const bustOf=t=>BUST[norm(t)];
function debutShow(t){const k=norm(t); return playedShows.find(s=>s.setlist.some(z=>norm(z)===k));}
function streak(t){const k=norm(t); let n=0; for(let i=playedShows.length-1;i>=0;i--){ if(playedShows[i].setlist.some(z=>norm(z)===k)) n++; else break;} return n;}
function tagsFor(t,showIdx){
  const out=[];
  if(showIdx!=null){ if(playedShows[showIdx]===debutShow(t) && playedShows.length>1 && showIdx>0) out.push({cls:'debut',txt:'tour debut'}); }
  const b=bustOf(t); if(b) out.push({cls:'bust',txt:'first since '+b});
  if(showIdx==null){ const n=streak(t); if(n>=2&&n===playedShows.length) out.push({cls:'streak',txt:'every night'}); else if(n>=3) out.push({cls:'streak',txt:n+' straight'}); }
  return out;
}
function labelFor(x){ if(!x) return 'New to the library'; if(x.s==='Studio Originals') return x.a; if(ORIG.has(x.s)) return x.s==='The Highwomen'?'The Highwomen':x.a; return 'Cover · '+x.a; }
function leaderboard(){
  const arr=Object.keys(counts).map(k=>({k,c:counts[k],x:byTitle[k]})).sort((a,b)=>b.c-a.c||a.k.localeCompare(b.k));
  return arr.map((r,i)=>{const t=r.x?r.x.t:lastShow[r.k].setlist.find(z=>norm(z)===r.k); return {rank:i+1,t,c:r.c,x:r.x,label:labelFor(r.x),tags:tagsFor(t,null),cover:r.x&&!ORIG.has(r.x.s)};});
}
function scorecard(){
  const albums=[]; const seen={};
  S.filter(x=>x.s==='Studio Originals'||x.s==='Who Believes in Angels? (with Elton John)').forEach(x=>{const a=x.s==='Studio Originals'?x.a:'Who Believes in Angels? (2025)'; if(!seen[a]){seen[a]={nm:a,tot:0,hit:0}; albums.push(seen[a]);} seen[a].tot++; if(played(x.t)) seen[a].hit++;});
  return albums.map(a=>{const m=a.nm.match(/^(.*?)\s*\((\d{4})\)$/); return {name:m?m[1]:a.nm,year:m?m[2]:'',hit:a.hit,tot:a.tot,pct:Math.round(a.hit/a.tot*100)};});
}
function coverGroups(q){
  let items=S.filter(x=>x.s==='Live Covers');
  if(q) items=items.filter(x=>norm(x.t+' '+x.a+' '+x.k).includes(norm(q)));
  const groups=[]; const g={};
  items.forEach(x=>{const a=x.a; if(!g[a]){g[a]={artist:a,known:x.k,songs:[],tot:0}; groups.push(g[a]);} g[a].songs.push({t:x.t,l:x.l,c:played(x.t),n:x.n}); g[a].tot+=x.l||0;});
  return {groups,count:items.length};
}
function coverFlat(q){
  let items=S.filter(x=>x.s==='Live Covers');
  if(q) items=items.filter(x=>norm(x.t+' '+x.a+' '+x.k).includes(norm(q)));
  return [...items].sort((a,b)=>(b.l||0)-(a.l||0)||a.t.localeCompare(b.t)).map(x=>({t:x.t,a:x.a,l:x.l,c:played(x.t),n:x.n}));
}
const total=Object.values(counts).reduce((a,b)=>a+b,0);
window.M={S,SHOWS,DEMO,esc,norm,ORIG,byTitle,counts,played,playedShows,done,total,uniq:Object.keys(counts).length,tagsFor,labelFor,leaderboard,scorecard,coverGroups,coverFlat,
  nextShow:SHOWS.find(s=>!s.setlist.length)};
})();
