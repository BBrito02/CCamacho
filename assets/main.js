// ============================================================
// WEB3FORMS — as chaves (Access Keys) estão nos próprios
// formulários, no campo escondido de cada página:
//   simulacao.html  ->  <input ... name="access_key" value="...">
//   contactos.html  ->  <input ... name="access_key" value="...">
// Para mudar uma chave, edite o HTML da página respetiva.
// ============================================================
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
  var els=document.querySelectorAll('[data-reveal]');
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
  document.querySelectorAll('form.w3form').forEach(function(form){
    // a chave vem do campo escondido do próprio formulário
    var keyInput=form.querySelector('input[name="access_key"]');
    var keyOk=!!(keyInput&&keyInput.value.trim().length>=10);

    var status=form.querySelector('.form-status');
    var submitBtn=form.querySelector('button[type="submit"]');
    var btnText=submitBtn?submitBtn.innerHTML:'';

    // desativa as bolhas nativas do browser: a validação passa a ser nossa,
    // com destaque a vermelho de TODOS os campos em falta de uma só vez
    form.setAttribute('novalidate','novalidate');

    function markInvalid(el){
      el.classList.add('input-error');
      el.addEventListener('input',function(){el.classList.remove('input-error');},{once:true});
    }

    function show(msg,type){
      if(!status)return;
      status.textContent=msg;
      status.className='form-status '+type;
      status.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});
    }

    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      // 1) campos obrigatórios (e formatos, ex.: email) — destaca todos os inválidos
      var invalid=[];
      form.querySelectorAll('input,textarea,select').forEach(function(el){
        if(el.type==='hidden'||el.classList.contains('hp-field'))return;
        if(!el.checkValidity())invalid.push(el);
      });
      if(invalid.length){
        invalid.forEach(markInvalid);
        show('Por favor preencha corretamente os campos destacados a vermelho.','error');
        invalid[0].focus();
        return;
      }
      // 2) valida "pelo menos um" (ex.: telefone ou email)
      var reqOne=form.getAttribute('data-require-one');
      if(reqOne){
        var names=reqOne.split(',');
        var fields=names.map(function(n){return form.querySelector('[name="'+n+'"]');});
        var filled=fields.some(function(el){return el&&el.value.trim()!=='';});
        if(!filled){
          fields.forEach(function(el){if(el)markInvalid(el);});
          show('Para podermos contactá-lo, é obrigatório indicar o telefone/telemóvel ou o email.','error');
          if(fields[0])fields[0].focus();
          return;
        }
      }
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
