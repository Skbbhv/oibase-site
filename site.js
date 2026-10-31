(function(){
  document.documentElement.classList.add('js');
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

  // ── Formulieren ──
  function melding(veld,tekst){
    var m=veld.parentNode.querySelector('.foutmelding');
    if(!tekst){if(m)m.remove();return;}
    if(!m){m=document.createElement('p');m.className='foutmelding';veld.parentNode.appendChild(m);}
    m.textContent=tekst;
  }
  function controleer(blok){
    var ok=true,eerste=null;
    blok.querySelectorAll('input,textarea').forEach(function(v){
      if(v.type==='hidden'||v.classList.contains('honing'))return;
      var goed=v.checkValidity();
      if(v.type==='radio'){
        var groep=blok.querySelectorAll('input[name="'+v.name+'"]'),gekozen=false,verplicht=false;
        groep.forEach(function(r){if(r.checked)gekozen=true;if(r.required)verplicht=true;});
        goed=!verplicht||gekozen;
        if(v===groep[0]){var k=v.closest('.keuzes');var m=k.nextElementSibling&&k.nextElementSibling.classList.contains('foutmelding')?k.nextElementSibling:null;
          if(!goed){if(!m){m=document.createElement('p');m.className='foutmelding';k.parentNode.insertBefore(m,k.nextSibling);}m.textContent='Maak een keuze.';}
          else if(m)m.remove();}
        if(!goed){ok=false;eerste=eerste||v;}
        return;
      }
      if(v.type==='file'&&v.files&&v.files[0]){
        var max=parseFloat(v.form.getAttribute('data-maxmb')||'8');
        if(v.files[0].size>max*1024*1024){v.setCustomValidity('Bestand is te groot (maximaal '+max+' MB).');goed=false;}
        else v.setCustomValidity('');
      }
      if(v.type==='checkbox'){ if(v.required&&!v.checked){goed=false;} }
      if(v.type!=='checkbox')v.classList.toggle('fout',!goed);
      if(v.type==='checkbox'&&v.required){var a=v.closest('.akkoord');if(a)a.style.color=goed?'':'#ff8080';}
      else if(v.type!=='checkbox')melding(v,goed?'':(v.validationMessage||'Vul dit veld in.'));
      if(!goed){ok=false;eerste=eerste||v;}
    });
    if(eerste){var d=eerste.closest('.keuzes')||eerste;d.scrollIntoView({behavior:'smooth',block:'center'});if(eerste.type!=='radio')setTimeout(function(){eerste.focus({preventScroll:true});},300);}
    return ok;
  }
  document.querySelectorAll('form.gewoonform').forEach(function(f){
    f.noValidate=true;
    f.addEventListener('submit',function(e){
      if(!controleer(f)){e.preventDefault();return;}
      var k=f.querySelector('[type=submit]');if(k){k.disabled=true;k.textContent='Bezig met versturen…';}
    });
  });
  document.querySelectorAll('form.stappenform').forEach(function(f){
    f.noValidate=true;
    var stappen=f.querySelectorAll('.stap'),bol=f.querySelectorAll('.voortgang li'),nu=1;
    function toon(n){
      nu=n;f.setAttribute('data-stap',n);
      stappen.forEach(function(s,i){s.classList.toggle('actief',i===n-1);});
      bol.forEach(function(b,i){b.classList.toggle('actief',i===n-1);b.classList.toggle('klaar',i<n-1);});
      var top=f.getBoundingClientRect().top+window.scrollY-110;
      if(window.scrollY>top)window.scrollTo({top:top,behavior:'smooth'});
    }
    toon(1);
    f.querySelector('.verder').addEventListener('click',function(){if(controleer(stappen[nu-1]))toon(nu+1);});
    f.querySelector('.terug').addEventListener('click',function(){if(nu>1)toon(nu-1);});
    // Stap 1: na keuze direct door
    stappen[0].querySelectorAll('input[type=radio]').forEach(function(r){r.addEventListener('change',function(){setTimeout(function(){if(nu===1)toon(2);},250);});});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'&&nu<stappen.length){e.preventDefault();f.querySelector('.verder').click();}});
    f.addEventListener('submit',function(e){
      for(var i=0;i<stappen.length;i++){if(!controleer(stappen[i])){e.preventDefault();toon(i+1);controleer(stappen[i]);return;}}
      var k=f.querySelector('.verstuur');k.disabled=true;k.textContent='Bezig met versturen…';
    });
  });

  // App-ondersteuning
  if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js');});}
})();
