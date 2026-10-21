/* ============ 初始化 ============ */
function boot(){
  renderCat(0);
  renderHome();renderDiary();renderArchive();renderCommunity();renderSelf();
  var ld=document.getElementById('bootLoading');if(ld)ld.remove();
}
function bootFail(){
  var ld=document.getElementById('bootLoading');
  if(ld){ld.innerHTML="<div style='font-size:14px;color:#5C7D68;margin-bottom:12px;'>课程数据加载失败，请检查网络</div><div onclick='location.reload()' style='padding:10px 22px;border-radius:20px;background:#5C7D68;color:#fff;font-size:13px;cursor:pointer;'>重新加载</div>";}
}
loadProgram().then(boot).catch(bootFail);
