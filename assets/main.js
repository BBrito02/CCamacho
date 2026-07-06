
// ============================================================
// CONFIGURAÇÃO WEB3FORMS
// Substitua o valor abaixo pela chave de acesso (Access Key)
// recebida ao criar a conta gratuita em https://web3forms.com
// com o email geral@carolinacamacho.pt
// ============================================================
var WEB3FORMS_ACCESS_KEY = "COLOQUE_AQUI_A_SUA_CHAVE";

(function(){
  // mobile nav
  var btn=document.querySelector('.nav-toggle');
  var nav=document.getElementById('site-nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  // header shadow on scroll
  var header=document.querySelector('.site-header');
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>10);}
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
  // scroll reveals
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('[data-reveal],.timeline');
  if(reduced||!('IntersectionObserver' in window)){
    els.forEach(function(el){el.classList.add('in');});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el);});
  }
  // animated 40 counter in hero
  var forty=document.querySelector('.hero-40 .num');
  if(forty&&!reduced){
    var t0=null,dur=4500;
    function tick(t){
      if(!t0)t0=t;
      var p=Math.min((t-t0)/dur,1);
      p=1-Math.pow(1-p,3);
      forty.textContent=Math.round(p*40);
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ============ Web3Forms: envio dos formulários ============
  var keyOk = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "COLOQUE_AQUI_A_SUA_CHAVE";
  document.querySelectorAll('form.w3form').forEach(function(form){
    // preenche a chave no campo escondido (permite também o envio nativo sem JS)
    var keyInput=form.querySelector('input[name="access_key"]');
    if(keyInput&&keyOk)keyInput.value=WEB3FORMS_ACCESS_KEY;

    var status=form.querySelector('.form-status');
    var submitBtn=form.querySelector('button[type="submit"]');
    var btnText=submitBtn?submitBtn.innerHTML:'';

    function show(msg,type){
      if(!status)return;
      status.textContent=msg;
      status.className='form-status '+type;
      status.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});
    }

    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      if(!keyOk){
        show('O envio ainda não está configurado. Por favor contacte-nos por telefone ((+351) 212 744 377) ou email (geral@carolinacamacho.pt).','error');
        return;
      }
      var data=new FormData(form);
      // junta as coberturas selecionadas num único campo legível
      var cobs=data.getAll('coberturas[]');
      if(cobs.length){
        data.delete('coberturas[]');
        data.set('Coberturas Pretendidas',cobs.join('; '));
      }
      if(submitBtn){submitBtn.disabled=true;submitBtn.innerHTML='A enviar…';}
      fetch('https://api.web3forms.com/submit',{
        method:'POST',
        body:data
      }).then(function(r){return r.json();}).then(function(res){
        if(res.success){
          show('Pedido enviado com sucesso! Entraremos em contacto consigo o mais brevemente possível.','success');
          form.reset();
        }else{
          show('Não foi possível enviar. Por favor tente novamente, ou contacte-nos por telefone ou email.','error');
        }
      }).catch(function(){
        show('Não foi possível enviar. Verifique a sua ligação à internet e tente novamente.','error');
      }).finally(function(){
        if(submitBtn){submitBtn.disabled=false;submitBtn.innerHTML=btnText;}
      });
    });
  });
})();
