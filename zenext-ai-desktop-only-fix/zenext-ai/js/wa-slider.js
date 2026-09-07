(() => {
  const stage = document.getElementById('waSliderStage');
  const track = document.getElementById('waSliderTrack');
  const dots = Array.from(document.querySelectorAll('#waSliderDots .wa-slider__dot'));
  if (!stage || !track || !dots.length) return;
  const slides = Array.from(track.children);
  let index = 0, timer = null, paused = false;
  const dotFor = (i) => Math.min(i, 2);
  function render(){
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot,i)=>{
      const active = i === dotFor(index);
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-current',active ? 'true' : 'false');
    });
  }
  function next(){ index=(index+1)%slides.length; render(); }
  function start(){ if (!timer && !paused) timer=setInterval(next,4200); }
  function stop(){ clearInterval(timer); timer=null; }
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{
    index=i; render(); stop(); start();
  }));
  stage.addEventListener('mouseenter',()=>{paused=true;stop()});
  stage.addEventListener('mouseleave',()=>{paused=false;start()});
  stage.addEventListener('focusin',()=>{paused=true;stop()});
  stage.addEventListener('focusout',()=>{paused=false;start()});
  render(); start();
})();