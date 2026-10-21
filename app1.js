
/* ============ 30 天课程数据（提取自原网页） ============ */
var PROGRAM=[];
/* 30 天课程数据：运行时从原仓库 raw 源拉取（同源 CORS 允许），带 jsDelivr 备用 */
function loadProgram(){
  var sources=[
    'https://raw.githubusercontent.com/modestomckoan/roost/main/index.html',
    'https://cdn.jsdelivr.net/gh/modestomckoan/roost@main/index.html'
  ];
  var NL=String.fromCharCode(10);
  function tryUrl(i){
    return fetch(sources[i],{cache:'no-store'}).then(function(r){return r.text();}).then(function(txt){
      var st=txt.indexOf('const PROGRAM = [');
      if(st<0)throw new Error('no start');
      var en=txt.indexOf(NL+'];',st);
      if(en<0)throw new Error('no end');
      var code=txt.slice(st,en+2)+NL+'return PROGRAM;';
      var data=new Function(code)();
      if(!data||!data.length)throw new Error('empty');
      PROGRAM=data;
    }).catch(function(e){if(i<sources.length-1)return tryUrl(i+1);throw e;});
  }
  return tryUrl(0);
}


/* ============ 每日正念一句 ============ */
var DAILY=[
  '今天不用变好，先在这里待一会儿就好。','呼吸一直都在，你随时可以回来。','把肩膀放下来，世界不会因此塌掉。',
  '慢一点没关系，花又不赶时间。','你不需要清空念头，只需要看见它们。','这一口气，只属于你自己。',
  '身体比你以为的更努力，谢谢它。','情绪像天气，而你是天空，不是风暴。','此刻坐在这里，就已经是在照顾自己了。',
  '松开咬着的牙，松开攥着的拳，也松开一点心事。','走神不是失败，发现走神，就是练习本身。','让呼吸替你扛一会儿，你不用时刻用力。',
  '该完成的事，不会因为你休息五分钟就消失。','感受脚踩在地上的重量，你是被稳稳接住的。','不用演给谁看，现在你可以只是你自己。',
  '心跳慢下来的时候，答案会自己浮上来。','允许自己什么都不做，这五分钟你说了算。','每一次呼气，都是身体在说：可以松一点了。',
  '念头来了就点点头，让它走，它只是路过。','你的疲惫是真实的，你的休息也是应该的。','像听见风声一样，听见自己此刻的需要。',
  '不和此刻较劲，它已经在发生了。','一呼一吸之间，有一个不用解决问题的地方。','今天的你已经很努力了，剩下的交给夜晚。',
  '温柔地把注意力领回来，像领一个走神的小孩。','安住不需要理由，呼吸就是最好的理由。','所有的紧绷，都可以一点一点还给地面。',
  '你不是在浪费时间，你是在把自己捡回来。','心里乱的时候，就先把注意力放回脚底。','愿你带着此刻的安静，走进接下来的一天。'
];
var WEEK_THEME={1:['安住当下','呼吸与支撑 · 15 分钟'],2:['倾听身体','细致觉察 · 16 分钟'],3:['陪伴内在','念头与情绪 · 18 分钟'],4:['带入生活','整合与自主练习 · 20 分钟']};

/* ============ 本地状态 ============ */
var state={
  done:JSON.parse(localStorage.getItem('calm_done')||'{}'),
  anchors:JSON.parse(localStorage.getItem('calm_anchors')||'[]'),
  posts:JSON.parse(localStorage.getItem('calm_posts')||null),
  diaries:JSON.parse(localStorage.getItem('calm_diaries')||'[]')
};
function save(){
  localStorage.setItem('calm_done',JSON.stringify(state.done));
  localStorage.setItem('calm_anchors',JSON.stringify(state.anchors));
  localStorage.setItem('calm_posts',JSON.stringify(state.posts));
  localStorage.setItem('calm_diaries',JSON.stringify(state.diaries));
}

/* ============ Toast ============ */
var toastEl=document.getElementById('toast'),toastTimer=null;
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){toastEl.classList.remove('show');},1500);}

/* ============ 路由：三页 + 覆盖层 ============ */
function go(name){
  document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('active',v.id==='view-'+name);});
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('active',t.dataset.view===name);});
  var v=document.getElementById('view-'+name);v.classList.remove('fade-in');void v.offsetWidth;v.classList.add('fade-in');
  if(location.hash!=='#'+name)history.replaceState(null,'','#'+name);
  setTimeout(function(){window.dispatchEvent(new Event('resize'));},30);
}
document.querySelectorAll('.tab').forEach(function(t){t.addEventListener('click',function(){go(t.dataset.view);});});
function openOvl(name){var o=document.getElementById('ovl-'+name);if(o)o.classList.add('show');}
function closeOvl(el){var o=el.closest('.ovl');if(o)o.classList.remove('show');}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){openOvl(g.dataset.go);return;}
  var c=e.target.closest('[data-close]');if(c){closeOvl(c);}
});
if(location.hash){var h=location.hash.slice(1);if(['home','discover','self'].indexOf(h)>=0)go(h);}

/* ============ 通用上拉吸附 ============ */
function setupSnap(opt){
  var scroll=document.getElementById(opt.scroll),hero=document.getElementById(opt.hero),
      headbar=document.getElementById(opt.headbar),fadeEls=opt.fadeEls.map(function(id){return document.getElementById(id);});
  var H=scroll.clientHeight,peek=opt.peek,snapTop=opt.snapTop,stickBottom=opt.stickBottom,
      travel=H-peek-snapTop,raf=null,dragging=false,idleTimer=null;
  hero.style.height=H+'px';hero.style.top=-(H-stickBottom)+'px';
  function apply(){
    var s=Math.max(0,Math.min(travel,scroll.scrollTop)),p=s/travel;
    fadeEls.forEach(function(el){if(!el)return;el.style.opacity=1-p;el.style.transform='scale('+(1-p*0.06)+')';});
    headbar.style.opacity=p;headbar.style.pointerEvents=p>0.6?'auto':'none';
  }
  function settle(){var s=Math.max(0,Math.min(travel,scroll.scrollTop));
    var target=s>travel*0.45?travel:0;
    if(Math.abs(s-target)>1.5)scroll.scrollTo({top:target,behavior:'smooth'});}
  function schedule(){if(dragging)return;clearTimeout(idleTimer);idleTimer=setTimeout(settle,110);}
  scroll.addEventListener('scroll',function(){if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(function(){apply();raf=null;});schedule();});
  scroll.addEventListener('touchstart',function(){dragging=true;clearTimeout(idleTimer);},{passive:true});
  scroll.addEventListener('touchmove',function(){dragging=true;},{passive:true});
  scroll.addEventListener('touchend',function(){dragging=false;schedule();},{passive:true});
  scroll.addEventListener('touchcancel',function(){dragging=false;schedule();},{passive:true});
  var wt=null;scroll.addEventListener('wheel',function(){clearTimeout(wt);wt=setTimeout(settle,150);},{passive:true});
  window.addEventListener('resize',function(){H=scroll.clientHeight;travel=H-peek-snapTop;
    hero.style.height=H+'px';hero.style.top=-(H-stickBottom)+'px';apply();});
  scroll.querySelectorAll('[data-expand]').forEach(function(el){
    el.addEventListener('click',function(){clearTimeout(idleTimer);scroll.scrollTo({top:travel,behavior:'smooth'});});});
  apply();
}
setupSnap({scroll:'homeScroll',hero:'homeHero',headbar:'homeHeadbar',fadeEls:['homeCenter','homeTop'],peek:268,snapTop:104,stickBottom:104});
setupSnap({scroll:'discScroll',hero:'discHero',headbar:'discHeadbar',fadeEls:['discBody','discTop'],peek:78,snapTop:76,stickBottom:104});
