/* ============ 自我页渲染 ============ */
function renderSelf(){
  var done=Object.keys(state.done);
  document.getElementById('selfId').textContent='已记录 '+done.length+' 天';
  document.getElementById('fDiary').textContent=state.diaries.length;
  document.getElementById('fAnchor').textContent=state.anchors.length;
  document.getElementById('fStreak').textContent=streakCount();
  var mins=done.reduce(function(s,dd){return s+(PROGRAM[dd-1]?PROGRAM[dd-1].dur:0);},0);
  document.getElementById('dMin').textContent=mins;
  document.getElementById('stMin').textContent=mins;
  document.getElementById('dCount').textContent=done.length;
  document.getElementById('stCount').textContent=done.length;
}
var ME=[
  {go:'program',t:'最近播放',s:'<circle cx="12" cy="12" r="8.5"/><path d="M10.6 9.4l4 2.6-4 2.6z"/>'},
  {go:'garden',t:'我的收藏',s:'<path d="M6 4.5h12v15.5l-6-4-6 4z"/>'},
  {go:'program',t:'我的课程',s:'<path d="M12 6.2c-2-1.2-4.5-1.5-7-1.2v12c2.5-.3 5 0 7 1.2 2-1.2 4.5-1.5 7-1.2V5c-2.5-.3-5 0-7 1.2z"/><path d="M12 6.2v12"/>'},
  {go:'diary',t:'我的日记',s:'<path d="M14.5 4.5l5 5L8.5 20.5l-5 1 1-5z"/><path d="M12.8 6.2l5 5"/>'},
  {go:'archive',t:'舒适档案',s:'<path d="M4 7h16M5 7v13h14V7M9 11h6"/>'},
  {go:'community',t:'我的社区',s:'<circle cx="9" cy="9" r="3"/><path d="M4 19.5c0-2.9 2.2-4.6 5-4.6s5 1.7 5 4.6"/>'},
  {go:'stats',t:'冥想报告',s:'<path d="M4 18V6M4 18h16M8 15l3-3.2 2 2.2 4-5"/>'},
  {go:'settings',t:'设置',s:'<circle cx="12" cy="12" r="3.4"/><circle cx="12" cy="12" r="8.5"/>'}
];
document.getElementById('meGrid').innerHTML=ME.map(function(m){
  return "<div class='mi' data-mego='"+m.go+"'><svg viewBox='0 0 24 24'>"+m.s+"</svg><span>"+m.t+'</span></div>';
}).join('');
document.getElementById('meGrid').addEventListener('click',function(e){
  var mi=e.target.closest('.mi');if(mi)openOvl(mi.dataset.mego);
});

/* ============ 冥想会话播放器 ============ */
var session={day:null,idx:0,playing:false,elapsed:0,total:0,iv:null,soundOn:false,stopped:false};
function startSession(day){
  SoundEngine.stopAll();
  var d=PROGRAM[day-1];
  session={day:day,idx:0,playing:false,elapsed:0,total:d.dur*60,iv:null,soundOn:false,stopped:false};
  document.getElementById('sDay').textContent='Day '+d.day+' · '+d.title;
  document.getElementById('sText').textContent='点击下方按钮，开始「'+d.title+'」';
  document.getElementById('sHint').textContent=d.breathHint||d.breath.name;
  document.getElementById('sTimer').textContent='00:00';
  document.getElementById('sProgress').value=0;
  document.getElementById('sPlayBtn').innerHTML="<svg viewBox='0 0 24 24'><path d='M8 5v14l11-7z'/></svg>开始";
  document.getElementById('soPhase').textContent='准备';
  document.getElementById('soCount').textContent='自然呼吸';
  speechSynthesis.cancel();
  openOvl('session');
}
function speak(text){
  if(!window.speechSynthesis)return;
  var u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=0.92;u.pitch=1;
  speechSynthesis.cancel();speechSynthesis.speak(u);
}
function sTime(){var m=Math.floor(session.elapsed/60),s=session.elapsed%60;
  document.getElementById('sTimer').textContent=m+':'+String(s).padStart(2,'0');
  document.getElementById('sProgress').value=session.elapsed/session.total*100;}
function playSession(){
  session.playing=true;session.stopped=false;
  document.getElementById('sPlayBtn').innerHTML="<svg viewBox='0 0 24 24'><path d='M7 5v14M17 5v14'/></svg>暂停";
  var d=PROGRAM[session.day-1];
  session.iv=setInterval(function(){session.elapsed++;sTime();
    if(session.elapsed>=session.total)finishSession();},1000);
  runBreathGuide(d.breath.pattern);
  runSteps(d);
}
function pauseSession(){
  session.playing=false;clearInterval(session.iv);speechSynthesis.cancel();
  document.getElementById('sPlayBtn').innerHTML="<svg viewBox='0 0 24 24'><path d='M8 5v14l11-7z'/></svg>继续";
  document.getElementById('soPhase').textContent='暂停';
}
function runSteps(d){
  var steps=d.steps,i=0;
  function next(){
    if(!session.playing||session.stopped)return;
    if(i>=steps.length){i=0;}
    var st=steps[i];
    document.getElementById('sText').textContent=st.t;
    speak(st.t);
    var wait=Math.max(st.pauseSeconds||10, st.t.length*0.22);
    i++;
    setTimeout(function(){if(session.playing&&!session.stopped)next();},wait*1000);
  }
  next();
}
/* 呼吸引导（独立循环） */
var brGuideStop=false;
function runBreathGuide(pattern){
  brGuideStop=false;
  var ring=document.getElementById('soRing'),phase=document.getElementById('soPhase'),cnt=document.getElementById('soCount');
  var inh=pattern[0],hold=pattern[1],out=pattern[2];
  function doPhase(name,secs,scale) {return new Promise(function(res){
    if(!session.playing||brGuideStop){res();return;}
    phase.textContent=name;ring.style.transition='transform '+secs+'s linear';ring.style.transform='scale('+scale+')';
    var n=secs;cnt.textContent=n;
    var iv=setInterval(function(){n--;cnt.textContent=n>0?n:'';if(n<=0){clearInterval(iv);res();}},1000);
  });}
  function doHold(name,secs){return new Promise(function(res){
    document.getElementById('soPhase').textContent=name;
    var n=secs;document.getElementById('soCount').textContent=n;
    var iv=setInterval(function(){n--;document.getElementById('soCount').textContent=n>0?n:'';
      if(n<=0){clearInterval(iv);res();}},1000);
  });}
  (async function loop(){
    while(session.playing&&!brGuideStop){
      await doPhase('吸气',inh,1.12);
      if(hold>0)await doHold('屏息',hold);
      await doPhase('呼气',out,0.92);
    }
  })();
}
function finishSession(){
  session.stopped=true;session.playing=false;clearInterval(session.iv);
  speechSynthesis.cancel();brGuideStop=true;
  var d=PROGRAM[session.day-1];
  state.done[session.day]=new Date().toISOString();save();
  document.getElementById('doneText').textContent='你完成了 Day '+d.day+' · '+d.title+'（'+d.dur+' 分钟）';
  document.getElementById('ovl-session').classList.remove('show');
  document.getElementById('anchorInput').value='';
  openOvl('done');
}
document.getElementById('saveAnchor').onclick=function(){
  var t=document.getElementById('anchorInput').value.trim()||'此刻安静的感觉';
  state.anchors.push({day:session.day,text:t});save();
  document.getElementById('ovl-done').classList.remove('show');
  toast('已存入舒适档案');
};
document.getElementById('sPlayBtn').addEventListener('click',function(){
  session.playing?pauseSession():playSession();
});
document.getElementById('sSoundBtn').addEventListener('click',function(){
  session.soundOn=!session.soundOn;
  if(session.soundOn){SoundEngine.start('rain',0.3);this.querySelector('svg').style.stroke='var(--sage-deep)';}
  else{SoundEngine.stop('rain');this.querySelector('svg').style.stroke='';}
});
document.getElementById('ovl-session').querySelector('.session-back').addEventListener('click',function(){
  session.stopped=true;session.playing=false;clearInterval(session.iv);
  speechSynthesis.cancel();brGuideStop=true;SoundEngine.stopAll();
});
