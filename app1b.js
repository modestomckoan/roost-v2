/* ============ 声音引擎（Web Audio 合成） ============ */
var SoundEngine={ctx:null,active:{},
  ensure:function(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();
    if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx;},
  noiseBuffer:function(ctx){
    var b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);
    for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;},
  start:function(key,vol){
    var ctx=this.ensure();if(this.active[key])return;
    var g=ctx.createGain();g.gain.value=vol;g.connect(ctx.destination);
    var stop=null;
    if(key==='white'){
      var s=ctx.createBufferSource();s.buffer=this.noiseBuffer(ctx);s.loop=true;s.connect(g);s.start();
      stop=function(){try{s.stop();}catch(e){}};
    }else if(key==='rain'){
      var s2=ctx.createBufferSource();s2.buffer=this.noiseBuffer(ctx);s2.loop=true;
      var f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=1200;
      var hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=400;
      s2.connect(hp);hp.connect(f);f.connect(g);s2.start();
      stop=function(){try{s2.stop();}catch(e){}};
    }else if(key==='wind'){
      var s3=ctx.createBufferSource();s3.buffer=this.noiseBuffer(ctx);s3.loop=true;
      var bf=ctx.createBiquadFilter();bf.type='bandpass';bf.frequency.value=500;bf.Q.value=1.2;
      var lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=0.15;lg.gain.value=260;
      lfo.connect(lg);lg.connect(bf.frequency);s3.connect(bf);bf.connect(g);s3.start();lfo.start();
      stop=function(){try{s3.stop();lfo.stop();}catch(e){}};
    }else if(key==='wave'){
      var s4=ctx.createBufferSource();s4.buffer=this.noiseBuffer(ctx);s4.loop=true;
      var lf=ctx.createBiquadFilter();lf.type='lowpass';lf.frequency.value=600;
      var lfo2=ctx.createOscillator(),lg2=ctx.createGain();lfo2.frequency.value=0.12;
      lg2.gain.value=vol*0.5;g.gain.value=0;
      lfo2.connect(lg2);lg2.connect(g.gain);s4.connect(lf);lf.connect(g);s4.start();lfo2.start();
      stop=function(){try{s4.stop();lfo2.stop();}catch(e){}};
    }else if(key==='bowl'){
      var o=ctx.createOscillator(),o2=ctx.createOscillator();o.type='sine';o2.type='sine';
      o.frequency.value=220;o2.frequency.value=330;
      var g2=ctx.createGain();g2.gain.value=0.25;o2.connect(g2);g2.connect(g);o.connect(g);
      var lfo3=ctx.createOscillator(),lg3=ctx.createGain();lfo3.frequency.value=0.2;
      lg3.gain.value=vol*0.3;g.gain.value=vol*0.6;lfo3.connect(lg3);lg3.connect(g.gain);
      o.start();o2.start();lfo3.start();
      stop=function(){try{o.stop();o2.stop();lfo3.stop();}catch(e){}};
    }else if(key==='bird'){
      var iv=setInterval(function(){
        if(Math.random()<0.5)return;
        var t=ctx.currentTime,ob=ctx.createOscillator(),gb=ctx.createGain();
        ob.type='sine';ob.connect(gb);gb.connect(g);
        var f=1800+Math.random()*900;
        ob.frequency.setValueAtTime(f,t);
        ob.frequency.exponentialRampToValueAtTime(f*1.4,t+0.12);
        ob.frequency.exponentialRampToValueAtTime(f*0.9,t+0.3);
        gb.gain.setValueAtTime(0.0001,t);
        gb.gain.exponentialRampToValueAtTime(0.5,t+0.05);
        gb.gain.exponentialRampToValueAtTime(0.0001,t+0.45);
        ob.start(t);ob.stop(t+0.5);
      },1800);
      stop=function(){clearInterval(iv);};
    }
    this.active[key]={gain:g,stop:stop};
  },
  setVol:function(key,v){if(this.active[key])this.active[key].gain.gain.value=v;},
  stop:function(key){if(this.active[key]){this.active[key].stop();delete this.active[key];}},
  stopAll:function(){Object.keys(this.active).forEach(function(k){SoundEngine.stop(k);});}
};
