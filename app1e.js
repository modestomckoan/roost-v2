window.toggleMix=function(card){
  if(window.event && window.event.target && window.event.target.tagName==='INPUT')return;
  var key=card.dataset.key,on=card.classList.toggle('on');
  card.querySelector('.mix-state').textContent=on?'播放中':'点击播放';
  if(on)SoundEngine.start(key,card.querySelector('input[type=range]').value);
  else SoundEngine.stop(key);
};
buildMixer('mixerGrid');buildMixer('ovlMixerGrid');buildMixer('whiteGrid');
document.getElementById('mixStop').onclick=function(){SoundEngine.stopAll();resetMixerUI('mixerGrid');};
document.getElementById('ovlMixStop').onclick=function(){SoundEngine.stopAll();resetMixerUI('ovlMixerGrid');};
document.getElementById('whiteStop').onclick=function(){SoundEngine.stopAll();resetMixerUI('whiteGrid');};
function resetMixerUI(id){document.getElementById(id).querySelectorAll('.mix-card').forEach(function(c){
  c.classList.remove('on');c.querySelector('.mix-state').textContent='点击播放';});}
