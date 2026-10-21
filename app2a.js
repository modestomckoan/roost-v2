
/* ============ 首页渲染 ============ */
function dayOfYear(){var d=new Date();return Math.floor((d-new Date(d.getFullYear(),0,0))/86400000);}
function nextPendingDay(){for(var i=0;i<PROGRAM.length;i++){if(!state.done[PROGRAM[i].day])return PROGRAM[i].day;}return 1;}
function streakCount(){var s=0,c=new Date();
  for(var i=0;i<365;i++){var k=c.toDateString();
    var has=Object.values(state.done).some(function(t){return new Date(t).toDateString()===k;});
    if(has)s++;else if(i>0)break;c.setDate(c.getDate()-1);}return s;}
function renderHome(){
  var day=nextPendingDay(),d=PROGRAM[day-1];
  document.getElementById('homeDayTitle').textContent='Day '+d.day+' · '+d.title;
  document.getElementById('homeDaySub').textContent='约 '+d.dur+' 分钟 · '+d.breath.name+' · 身体扫描';
  document.getElementById('homeStart').onclick=function(){startSession(d.day);};
  var h=new Date().getHours();
  document.getElementById('greetText').textContent=h<12?'早上好':h<18?'下午好':'晚上好';
  document.getElementById('dailyQuote').textContent=DAILY[dayOfYear()%DAILY.length];
  var now=new Date();
  document.getElementById('dailyDate').textContent='今日正念 · '+(now.getMonth()+1)+'月'+now.getDate()+'日';
  var done=Object.keys(state.done);
  document.getElementById('statDone').textContent=done.length+' / 30';
  document.getElementById('statMin').textContent=done.reduce(function(s,dd){return s+(PROGRAM[dd-1]?PROGRAM[dd-1].dur:0);},0);
  drawHomeWave();
}
document.getElementById('qcNight').onclick=function(){startSession(8);};
document.getElementById('qcNeck').onclick=function(){startSession(6);};
document.getElementById('qcSleep').onclick=function(){startSession(8);};
document.getElementById('bannerProgram').onclick=function(){openOvl('program');};

/* 首页小波形 */
var waveRAF=null;
function drawHomeWave(){
  var cv=document.getElementById('homeWave');if(!cv)return;
  var ctx=cv.getContext('2d'),ph=0;
  if(waveRAF)cancelAnimationFrame(waveRAF);
  (function loop(){ph+=0.05;ctx.clearRect(0,0,120,50);
    ctx.beginPath();ctx.strokeStyle='rgba(92,125,104,.5)';ctx.lineWidth=1.6;
    for(var x=0;x<=120;x+=2){var y=25+Math.sin(x*0.08+ph)*8+Math.sin(x*0.15+ph*1.4)*4;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();waveRAF=requestAnimationFrame(loop);})();
}

/* ============ 探索：快捷键（两行 10 个） ============ */
var QUICK=[
  {go:'pomo',t:'番茄钟',s:'<circle cx="12" cy="13.5" r="7"/><path d="M9.5 7.2c.4-1.4 1.4-2.2 2.5-2.2s2.1.8 2.5 2.2"/><path d="M12 5V3.6"/><path d="M12 13.4v-2.6"/><path d="M12 13.4l2 1.4"/>'},
  {go:'breath',t:'呼吸',s:'<circle cx="12" cy="12" r="8.5"/><path d="M10.4 9.2l4.6 2.8-4.6 2.8z"/>'},
  {go:'device',t:'连耳机',s:'<circle cx="9.4" cy="12" r="4.4"/><circle cx="15.2" cy="12" r="4.4"/>'},
  {go:'white',t:'白噪音',s:'<circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><path d="M6.6 9a8 8 0 0 0 0 6M17.4 9a8 8 0 0 1 0 6"/>'},
  {go:'community',t:'社区',s:'<circle cx="9" cy="9" r="3"/><path d="M4 19.5c0-2.9 2.2-4.6 5-4.6s5 1.7 5 4.6"/><path d="M16 10.6a2.7 2.7 0 1 0 0-5.3"/><path d="M16.6 15c2.3.4 3.6 1.9 3.6 4.2"/>'},
  {go:'diary',t:'日记',s:'<path d="M14.5 4.5l5 5L8.5 20.5l-5 1 1-5z"/><path d="M12.8 6.2l5 5"/>'},
  {go:'program',t:'课程',s:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>'},
  {go:'archive',t:'档案',s:'<path d="M4 7h16M5 7v13h14V7M9 11h6"/>'},
  {go:'device',t:'设备',s:'<path d="M4 12c2-4 4-4 6 0s4 4 6 0 4-4 4-4"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/>'},
  {go:'garden',t:'花园',s:'<path d="M12 3c4 4 4 8 0 12-4-4-4-8 0-12z"/><path d="M12 15v6M9 19l3 2 3-2"/>'}
];
document.getElementById('quickRow').innerHTML=QUICK.map(function(q){
  return "<div class='quick' data-qgo='"+q.go+"' onclick='openOvl(\""+q.go+"\")'><div class='qicon'><svg viewBox='0 0 24 24'>"+q.s+
    "</svg></div><div class='qlabel'>"+q.t+"</div></div>";
}).join('');
document.getElementById('quickRow').addEventListener('click',function(e){
  var q=e.target.closest('.quick');if(q)openOvl(q.dataset.qgo);
});

/* ============ 探索：4 tab 切换 ============ */
document.getElementById('etabRail').addEventListener('click',function(e){
  var t=e.target.closest('.et');if(!t)return;
  this.querySelectorAll('.et').forEach(function(x){x.classList.remove('active');});
  t.classList.add('active');
  document.querySelectorAll('.epane').forEach(function(p){p.classList.remove('active');});
  document.getElementById('ep-'+t.dataset.et).classList.add('active');
});

/* ============ 探索 tab：分类 + 条目 ============ */
var CATS=['入门','助眠','放松','舒缓','专注','焦虑','身体','情绪'];
var CAT_DAYS=[[1,2,3,7],[8,9,10,14],[6,10,13,14],[4,11,12,14],[15,16,23,25],[5,15,19,21],[6,10,13,14],[15,18,20,21]];
var catList=document.getElementById('catList');
catList.innerHTML=CATS.map(function(c,i){return "<div class='cat' data-cat='"+i+"'>"+c+"</div>";}).join('');
catList.querySelector('.cat').classList.add('active');
function renderCat(i){
  catList.querySelectorAll('.cat').forEach(function(c,j){c.classList.toggle('active',i===j);});
  if(!PROGRAM.length){document.getElementById('discList').innerHTML='';return;}
  document.getElementById('discList').innerHTML=CAT_DAYS[i].map(function(day){
    var d=PROGRAM[day-1];
    return "<div class='d-row' data-day='"+day+"' onclick='startSession("+day+")'><div class='cover'><svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='7.5'/><circle cx='12' cy='12' r='3'/></svg></div>"+
      "<div class='meta'><div class='mt'>Day "+d.day+" · "+d.title+"</div>"+
      "<div class='ms'>"+d.dur+" 分钟 · 身体扫描</div><div class='mtag'>"+d.breath.name+"</div></div></div>";
  }).join('');
}
catList.addEventListener('click',function(e){var c=e.target.closest('.cat');if(c)renderCat(+c.dataset.cat);});
document.getElementById('discList').addEventListener('click',function(e){
  var r=e.target.closest('.d-row');if(r)startSession(+r.dataset.day);
});
renderCat(0);
