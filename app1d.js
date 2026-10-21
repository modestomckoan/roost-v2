function buildMixer(containerId){
  var c=document.getElementById(containerId);
  c.innerHTML=MIXERS.map(function(m){
    return "<div class='mix-card' data-key='"+m.key+"' data-mixid='"+containerId+"' onclick='toggleMix(this)'><div class='mix-head'><div class='mix-ic'>"+
      "<svg viewBox='0 0 24 24'>"+m.ic+"</svg></div><div><div class='mix-name'>"+m.name+
      "</div><div class='mix-state'>点击播放</div></div></div>"+
      "<div class='mix-vol'><input type='range' min='0' max='1' step='0.05' value='0.4'></div></div>";
  }).join('');
  c.addEventListener('input',function(e){
    var card=e.target.closest('.mix-card');if(card)SoundEngine.setVol(card.dataset.key,+e.target.value);
  });
}
