/* ============ 日记 ============ */
var diaryMood='平静';
function renderDiary(){
  var b=document.getElementById('diaryBody');
  if(state.diaries.length===0){b.innerHTML="<div class='empty'>还没有日记<br>完成练习后，记下此刻的感受</div>";return;}
  b.innerHTML=state.diaries.map(function(d){
    return "<div class='diary-card'><div class='diary-date'>"+d.date+'</div>'+
      "<div class='diary-mood'>心情 · "+d.mood+"</div><div class='diary-text'>"+d.text+'</div></div>';
  }).join('');
}
document.getElementById('diaryBtn').onclick=function(){openOvl('diary-edit');};
document.getElementById('moodChips').addEventListener('click',function(e){
  var c=e.target.closest('.chip2');if(!c)return;
  this.querySelectorAll('.chip2').forEach(function(x){x.classList.remove('sel');});
  c.classList.add('sel');diaryMood=c.dataset.mood;
});
document.getElementById('diarySave').onclick=function(){
  var t=document.getElementById('diaryText').value.trim();if(!t){toast('先写点内容');return;}
  var now=new Date();
  state.diaries.unshift({date:(now.getMonth()+1)+'月'+now.getDate()+'日 '+now.getHours()+':'+String(now.getMinutes()).padStart(2,'0'),
    mood:diaryMood,text:t});save();
  document.getElementById('diaryText').value='';
  document.getElementById('ovl-diary-edit').classList.remove('show');
  renderDiary();
};

/* ============ 舒适档案 ============ */
function renderArchive(){
  var b=document.getElementById('archiveBody');
  if(state.anchors.length===0){b.innerHTML="<div class='empty'>还没有舒适锚点<br>完成第一次练习后，<br>把放松感存进来</div>";return;}
  b.innerHTML=state.anchors.slice().reverse().map(function(a){
    return "<div class='anchor-item'><div class='anchor-d'>DAY "+a.day+' · '+PROGRAM[a.day-1].title+'</div>'+
      "<div class='anchor-t'>"+a.text+'</div></div>';
  }).join('');
}

/* ============ 番茄钟 ============ */
var pomoMins=25,pomoLeft=25*60,pomoRun=false,pomoIv=null,pomoArcLen=628.3;
function pomoRender(){
  var m=Math.floor(pomoLeft/60),s=pomoLeft%60;
  document.getElementById('pomoNum').textContent=m+':'+String(s).padStart(2,'0');
  document.getElementById('pomoLab').textContent=pomoRun?'专注中':'准备开始';
  var p=1-pomoLeft/(pomoMins*60);
  document.getElementById('pomoArc').style.strokeDashoffset=pomoArcLen*(1-p);
}
document.querySelectorAll('.pomo-modes .chip2').forEach(function(c){
  c.addEventListener('click',function(){
    document.querySelectorAll('.pomo-modes .chip2').forEach(function(x){x.classList.remove('sel');});
    c.classList.add('sel');pomoMins=+c.dataset.pomo;pomoLeft=pomoMins*60;pomoRun=false;
    clearInterval(pomoIv);pomoRender();
  });
});
document.getElementById('pomoPlay').onclick=function(){
  pomoRun=!pomoRun;
  if(pomoRun){this.textContent='暂停';
    pomoIv=setInterval(function(){pomoLeft--;if(pomoLeft<=0){clearInterval(pomoIv);pomoRun=false;
      pomoLeft=pomoMins*60;toast('时间到，休息一下');}pomoRender();},1000);
  }else{this.textContent='开始';clearInterval(pomoIv);}
};
document.getElementById('pomoReset').onclick=function(){pomoRun=false;clearInterval(pomoIv);
  pomoLeft=pomoMins*60;document.getElementById('pomoPlay').textContent='开始';pomoRender();};
pomoRender();

/* ============ 呼吸练习 ============ */
var brRun=false,brIv=null,brStop=false;
function brCycle(){
  var el=document.getElementById('brPhase'),cnt=document.getElementById('brCount');
  function phase(name,secs){return new Promise(function(res){
    el.textContent(name);var n=secs;cnt.textContent=n;
    var iv=setInterval(function(){n--;cnt.textContent=n>0?n:'';if(n<=0){clearInterval(iv);res();}},1000);
  });}
  (async function loop(){
    while(!brStop){await phase('吸气',4);if(brStop)break;await phase('呼气',6);}
  })();
}
document.getElementById('brPlay').onclick=function(){
  brRun=!brRun;
  if(brRun){this.textContent='结束';brStop=false;brCycle();}
  else{this.textContent='开始';brStop=true;
    document.getElementById('brPhase').textContent='吸气';document.getElementById('brCount').textContent='4';}
};
