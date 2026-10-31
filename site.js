(function(){
  // Menu op telefoon
  var knop=document.querySelector('.hamburger'),menu=document.querySelector('.menu');
  if(knop&&menu){knop.addEventListener('click',function(){
    var open=menu.classList.toggle('open');knop.setAttribute('aria-expanded',open?'true':'false');
  });}
  // Foto die niet laadt: verberg netjes, achtergrond blijft in stijl
  document.querySelectorAll('.foto img').forEach(function(img){
    img.addEventListener('error',function(){img.style.display='none';});
  });
  // Verschijnen bij scrollen
  var el=document.querySelectorAll('.kom');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(items){items.forEach(function(i){
      if(i.isIntersecting){i.target.classList.add('zicht');io.unobserve(i.target);}
    });},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    el.forEach(function(e){io.observe(e);});
  }else{el.forEach(function(e){e.classList.add('zicht');});}
  // App-ondersteuning
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js');});}
})();
