/* ============ 课程列表（探索页 + 覆盖层） ============ */
function buildProgram(){
  var html='';
  for(var w=1;w<=4;w++){
    html+="<div class='week-block'><div class='week-head'><div class='week-name serif'>第"+
      ['一','二','三','四'][w-1]+'周 · '+WEEK_THEME[w][0]+"</div><div class='week-theme'>"+WEEK_THEME[w][1]+'</div></div>';
    PROGRAM.filter(function(x){return x.week===w;}).forEach(function(d){
      var done=state.done[d.day];
      html+="<div class='day-item"+(done?' done':'')+"' data-day='"+d.day+"' onclick='startSession("+d.day+")'>"+
        "<div class='day-num'>"+(done?'✓':d.day)+'</div>'+
        "<div class='day-info'><div class='day-title'>"+d.title+'</div>'+
        "<div class='day-sub'>"+d.dur+' 分钟 · '+d.breath.name+'</div></div>'+
        "<div class='day-arrow'>›</div></div>";
    });
    html+='</div>';
  }
  return html;
}
document.getElementById('programList').innerHTML=buildProgram();
document.getElementById('ovlProgramList').innerHTML=buildProgram();
['programList','ovlProgramList'].forEach(function(id){
  document.getElementById(id).addEventListener('click',function(e){
    var it=e.target.closest('.day-item');if(it){startSession(+it.dataset.day);}
  });
});

/* ============ 场景 ============ */
var SCENES=[
  {t:'睡前助眠',s:'帮你慢慢入睡',days:[8,9,14],c:'linear-gradient(140deg,#6E8B86,#5C7D68)',ic:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'},
  {t:'焦虑缓解',s:'和担心共处',days:[5,19,21],c:'linear-gradient(140deg,#8FA9B8,#6E8B86)',ic:'<path d="M4 12c2.5 0 2.5 2.5 5 2.5S11.5 12 14 12s2.5 2.5 5 2.5"/>'},
  {t:'专注提升',s:'进入状态',days:[15,16,23,25],c:'linear-gradient(140deg,#7E9E8A,#5C7D68)',ic:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>'},
  {t:'身体放松',s:'松开紧绷',days:[6,10,13,14],c:'linear-gradient(140deg,#A9B8A0,#8FAE9A)',ic:'<path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>'},
  {t:'情绪照顾',s:'被看见',days:[15,18,20,21],c:'linear-gradient(140deg,#B89A8C,#D4A98C)',ic:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>'},
  {t:'晨间唤醒',s:'清醒开始',days:[1,2,3,7],c:'linear-gradient(140deg,#9DB8C4,#8FAE9A)',ic:'<circle cx="12" cy="9" r="3.5"/><path d="M5 19c0-3.3 3.1-5 7-5s7 1.7 7 5"/>'}
];
document.getElementById('sceneGrid').innerHTML=SCENES.map(function(sc,i){
  return "<div class='scene-card' data-scene='"+i+"' onclick='startSession(SCENES["+i+"].days[0])'><div class='sc-cover' style='background:"+sc.c+"'>"+
    "<svg viewBox='0 0 24 24'>"+sc.ic+"</svg></div><div class='sc-body'><div class='sc-t'>"+sc.t+
    "</div><div class='sc-s'>"+sc.s+'</div></div></div>';
}).join('');
document.getElementById('sceneGrid').addEventListener('click',function(e){
  var c=e.target.closest('.scene-card');if(c)startSession(SCENES[+c.dataset.scene].days[0]);
});
