/* ============ 社区 ============ */
var SEED_POSTS=[
  {name:'晚睡的小鹿',time:'2 小时前',text:'练完第 8 天，第一次没有翻来覆去，听着呼吸就睡着了。原来真的不用逼自己什么都不想。',likes:24,cm:6},
  {name:'山间的风',time:'昨天',text:'肩颈一直紧，今天练身体扫描，才发现自己连牙都咬着。松开来的那一刻差点哭。',likes:48,cm:12},
  {name:'慢慢走',time:'2 天前',text:'第 15 天打卡。焦虑来的时候，现在能先停一下，告诉自己：这只是一阵浪，不是整个海。',likes:36,cm:8}
];
if(!state.posts)state.posts=SEED_POSTS;
var AVA_COLORS=['#8FAE9A','#9DB8C4','#D4A98C','#A9C0B0','#B8A89A'];
function renderCommunity(){
  document.getElementById('communityBody').innerHTML=
    "<div class='post-composer'><textarea class='textarea' id='postDraft' style='min-height:70px;' placeholder='分享你的练习感受…'></textarea>"+
    "<div style='height:12px;'></div><button class='cta' id='postSend' style='height:42px;'>发布</button></div>"+
    state.posts.map(function(p){
      var c=AVA_COLORS[(p.name.charCodeAt(0))%AVA_COLORS.length];
      return "<div class='post-card'><div class='post-head'><div class='ava' style='background:"+c+"'></div>"+
        "<div><div class='post-name'>"+p.name+"</div><div class='post-time'>"+p.time+'</div></div></div>'+
        "<div class='post-text'>"+p.text+"</div><div class='post-actions'>"+
        "<span><svg viewBox='0 0 24 24'><path d='M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z'/></svg>"+p.likes+'</span>'+
        "<span><svg viewBox='0 0 24 24'><path d='M20.5 12a8 8 0 0 1-11.2 7.4L4.5 21l1.6-4A8 8 0 1 1 20.5 12z'/></svg>"+p.cm+'</span></div></div>';
    }).join('');
  document.getElementById('postSend').onclick=function(){
    var t=document.getElementById('postDraft').value.trim();if(!t){toast('写点什么再发布');return;}
    state.posts.unshift({name:'栖居者',time:'刚刚',text:t,likes:0,cm:0});save();renderCommunity();
  };
}
document.getElementById('postBtn').onclick=function(){renderCommunity();};
