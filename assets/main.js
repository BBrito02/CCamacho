// ============================================================
// FORMULÁRIOS — os pedidos são guardados numa folha do Google
// Sheets e enviados por email (ver google-sheets/COMO-CONFIGURAR.md).
// Cole abaixo, entre as aspas, o endereço da "Aplicação Web"
// (termina em /exec):
var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw3pci49LAn-jbb64HA0yg-uEUGXWI_cOsKohc8sT-ExVE47JSNeSnce42lhryFJxbveg/exec';
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

  // ============ Formulários (envio para o Google Sheets) ============
  var MSG={
    required:'Este campo é obrigatório.',
    email:'Indique um email válido (ex.: nome@exemplo.pt).',
    consent:'Para continuar precisamos da sua autorização.',
    date:'Indique uma data válida.',
    pattern:'O formato não é válido.'
  };
  function todayISO(){
    var d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());
    return d.toISOString().slice(0,10);
  }
  // NIF português: 9 dígitos com dígito de controlo (módulo 11)
  function validNIF(v){
    if(!/^\d{9}$/.test(v))return false;
    var s=0;for(var i=0;i<8;i++)s+=(+v[i])*(9-i);
    var r=s%11,c=r<2?0:11-r;
    return c===+v[8];
  }
  // formatação automática enquanto se escreve
  var FORMAT={
    digits:function(v){return v.replace(/\D/g,'');},
    cp:function(v){
      v=v.replace(/\D/g,'').slice(0,7);
      return v.length>4?v.slice(0,4)+'-'+v.slice(4):v;
    },
    plate:function(v){
      v=v.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
      return (v.match(/.{1,2}/g)||[]).join('-');
    }
  };
  function customCheck(el,form){
    var v=el.value.trim(),msg='';
    if(v){
      if(el.dataset.check==='nif'&&!validNIF(v))msg='Este NIF não é válido. Verifique os 9 dígitos.';
      if(el.dataset.check==='year'){
        var max=new Date().getFullYear()+1;
        if(!/^\d{4}$/.test(v)||+v<1950||+v>max)msg='Indique um ano entre 1950 e '+max+'.';
      }
      if(el.type==='date'&&v>todayISO())msg='A data não pode ser no futuro.';
      if(!msg&&el.dataset.after){
        var ref=form.querySelector('#'+el.dataset.after);
        if(ref&&ref.value&&v<=ref.value)msg=el.dataset.afterMsg||'A data não é válida.';
      }
    }
    el.setCustomValidity(msg);
  }
  function errorText(el){
    var v=el.validity;
    if(v.customError)return el.validationMessage;
    if(v.valueMissing)return el.type==='checkbox'?MSG.consent:MSG.required;
    if(v.typeMismatch)return MSG.email;
    if(v.patternMismatch)return el.dataset.msg||MSG.pattern;
    if(v.badInput||v.rangeUnderflow||v.rangeOverflow)return MSG.date;
    return el.validationMessage;
  }
  function errId(el){return (el.id||el.name)+'-err';}
  function showError(el,msg){
    el.classList.add('input-error');
    el.setAttribute('aria-invalid','true');
    var id=errId(el),p=document.getElementById(id);
    if(!p){
      p=document.createElement('p');
      p.className='field-error';p.id=id;
      var box=el.closest('.field');
      if(box)box.appendChild(p);
      else{var lab=el.closest('label')||el;lab.parentNode.insertBefore(p,lab.nextSibling);}
      var d=el.getAttribute('aria-describedby');
      el.setAttribute('aria-describedby',d?d+' '+id:id);
    }
    p.textContent=msg;
  }
  function clearError(el){
    el.classList.remove('input-error');
    el.removeAttribute('aria-invalid');
    var id=errId(el),p=document.getElementById(id);
    if(p){
      p.remove();
      var d=(el.getAttribute('aria-describedby')||'').split(' ').filter(function(x){return x&&x!==id;}).join(' ');
      if(d)el.setAttribute('aria-describedby',d);else el.removeAttribute('aria-describedby');
    }
  }
  function fieldsIn(box){
    return Array.prototype.filter.call(box.querySelectorAll('input,textarea,select'),function(el){
      return el.type!=='hidden'&&el.type!=='radio'&&!el.classList.contains('hp-field')&&!el.closest('[hidden]');
    });
  }

  document.querySelectorAll('form.w3form').forEach(function(form){
    var status=form.querySelector('.form-status');
    var submitBtn=form.querySelector('button[type="submit"]');
    var btnText=submitBtn?submitBtn.innerHTML:'';

    // validação feita por nós: mensagens por campo, em português
    form.setAttribute('novalidate','novalidate');
    form.querySelectorAll('input[type="date"]').forEach(function(el){el.max=todayISO();});

    function validateField(el,display){
      customCheck(el,form);
      var ok=el.checkValidity();
      if(ok)clearError(el);else if(display)showError(el,errorText(el));
      return ok;
    }
    // "pelo menos um" (ex.: telefone ou email)
    function checkRequireOne(box){
      var reqOne=form.getAttribute('data-require-one');
      if(!reqOne)return true;
      var fields=reqOne.split(',').map(function(n){return form.querySelector('[name="'+n+'"]');}).filter(Boolean);
      if(!fields.length||!box.contains(fields[0]))return true;
      if(fields.some(function(el){return el.value.trim()!=='';}))return true;
      fields.forEach(function(el){showError(el,'Indique o telefone/telemóvel ou o email.');});
      return false;
    }
    // valida um bloco (um passo, ou o formulário inteiro); devolve o 1.º campo inválido
    function validateBox(box){
      var first=null;
      fieldsIn(box).forEach(function(el){if(!validateField(el,true)&&!first)first=el;});
      if(!checkRequireOne(box)&&!first){
        first=form.querySelector('[name="'+form.getAttribute('data-require-one').split(',')[0]+'"]');
      }
      return first;
    }

    function show(msg,type){
      if(!status)return;
      status.textContent=msg;
      status.className='form-status '+type;
      status.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});
    }
    function hideStatus(){if(status){status.textContent='';status.className='form-status';}}

    // formatação + validação em tempo real
    form.addEventListener('input',function(e){
      var el=e.target,f=FORMAT[el.dataset&&el.dataset.format];
      if(f){var nv=f(el.value);if(nv!==el.value)el.value=nv;}
      if(el.classList.contains('input-error'))validateField(el,true);
      // ao preencher telefone ou email, limpa o aviso "pelo menos um" dos dois
      var reqOne=form.getAttribute('data-require-one');
      if(reqOne&&reqOne.split(',').indexOf(el.name)>-1&&el.value.trim()){
        reqOne.split(',').forEach(function(n){
          var o=form.querySelector('[name="'+n+'"]');
          if(o&&o!==el&&o.classList.contains('input-error')&&!o.value.trim())clearError(o);
        });
      }
    });
    form.addEventListener('change',function(e){
      var el=e.target;
      if(el.type==='checkbox'&&el.classList.contains('input-error'))validateField(el,true);
      // datas dependentes (ex.: carta depois do nascimento)
      form.querySelectorAll('[data-after="'+el.id+'"]').forEach(function(dep){
        if(dep.value)validateField(dep,true);
      });
    });
    form.addEventListener('focusout',function(e){
      var el=e.target;
      if(!el.matches||!el.matches('input,textarea,select')||el.type==='checkbox'||el.type==='radio')return;
      if(el.value.trim()!==''||el.classList.contains('input-error'))validateField(el,true);
    });

    // "a pessoa a contactar é o próprio condutor"
    var same=form.querySelector('#mesmo-condutor'),cWrap=form.querySelector('#cnome-wrap');
    function syncSame(){if(same&&cWrap)cWrap.hidden=same.checked;}
    if(same){same.addEventListener('change',syncSame);syncSame();}

    // ---------- assistente por passos ----------
    var steps=form.querySelectorAll('.step'),cur=0,go=null,nextBtn=null;
    if(form.classList.contains('wizard')&&steps.length>1){
      var stepper=form.querySelector('.stepper');
      var actions=form.querySelector('.form-actions');
      form.classList.add('is-wizard');
      if(stepper)stepper.hidden=false;
      var prevBtn=document.createElement('button');
      prevBtn.type='button';prevBtn.className='btn btn-ghost';
      prevBtn.innerHTML='<span class="arr arr-back">&larr;</span> Anterior';
      nextBtn=document.createElement('button');
      nextBtn.type='button';nextBtn.className='btn btn-blue';
      nextBtn.innerHTML='Seguinte <span class="arr">&rarr;</span>';
      var counter=document.createElement('span');
      counter.className='step-count';
      actions.insertBefore(counter,actions.firstChild);
      actions.insertBefore(prevBtn,counter);
      actions.appendChild(nextBtn);

      go=function(i,focus){
        cur=i;
        steps.forEach(function(s,k){s.classList.toggle('active',k===i);});
        if(stepper)stepper.querySelectorAll('li').forEach(function(li,k){
          li.classList.toggle('done',k<i);
          var b=li.querySelector('button');
          if(k===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');
        });
        form.style.setProperty('--progress',(i/(steps.length-1)));
        var last=i===steps.length-1;
        prevBtn.hidden=i===0;nextBtn.hidden=last;
        if(submitBtn)submitBtn.hidden=!last;
        counter.textContent='Passo '+(i+1)+' de '+steps.length;
        hideStatus();
        if(focus){
          var top=form.getBoundingClientRect().top;
          if(top<0)window.scrollTo({top:window.scrollY+top-100,behavior:reduced?'auto':'smooth'});
          steps[i].setAttribute('tabindex','-1');
          steps[i].focus({preventScroll:true});
        }
      };
      // avança até ao passo "target", validando cada passo pelo caminho
      function advanceTo(target){
        while(cur<target){
          var bad=validateBox(steps[cur]);
          if(bad){
            go(cur,false);
            show('Por favor corrija os campos assinalados para continuar.','error');
            bad.focus();
            return;
          }
          cur++;
        }
        go(target,true);
      }
      nextBtn.addEventListener('click',function(){advanceTo(cur+1);});
      prevBtn.addEventListener('click',function(){go(cur-1,true);});
      if(stepper)stepper.addEventListener('click',function(e){
        var b=e.target.closest('[data-goto]');if(!b)return;
        var t=+b.dataset.goto;
        if(t<=cur)go(t,true);else advanceTo(t);
      });
      go(0,false);
    }

    // ---------- painel de agradecimento ----------
    function showDone(){
      var done=document.createElement('div');
      done.className='form-done';
      done.innerHTML='<span class="done-ic" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>'+
        '<h3 tabindex="-1"></h3><p></p><button type="button" class="btn btn-ghost">Enviar outro pedido</button>';
      done.querySelector('h3').textContent=form.dataset.successTitle||'Enviado com sucesso!';
      done.querySelector('p').textContent=form.dataset.successText||'Entraremos em contacto consigo o mais brevemente possível.';
      done.querySelector('button').addEventListener('click',function(){
        form.reset();
        fieldsIn(form).forEach(clearError);
        done.remove();
        form.classList.remove('is-done');
        syncSame();
        if(go)go(0,true);
      });
      form.appendChild(done);
      form.classList.add('is-done');
      form.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
      done.querySelector('h3').focus({preventScroll:true});
    }

    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      // Enter num passo intermédio = "Seguinte"
      if(go&&cur<steps.length-1){nextBtn.click();return;}
      var bad=validateBox(form);
      if(bad){
        if(go){
          var k=Array.prototype.findIndex.call(steps,function(s){return s.contains(bad);});
          if(k>-1&&k!==cur)go(k,false);
        }
        show('Por favor corrija os campos assinalados a vermelho.','error');
        bad.focus();
        return;
      }
      if(!/^https:\/\/script\.google\.com\//.test(FORM_ENDPOINT)){
        show('O envio ainda não está configurado. Por favor contacte-nos por telefone ((+351) 212 744 377) ou email (geral@carolinacamacho.pt).','error');
        return;
      }
      var data=new FormData(form);
      // junta as coberturas selecionadas num único campo legível
      var cobs=data.getAll('coberturas[]');
      data.delete('coberturas[]');
      if(cobs.length)data.set('coberturas',cobs.join('; '));
      // contacto = próprio condutor
      if(same&&same.checked)data.set('contacto_nome',(data.get('nome')||'')+' (o próprio condutor)');
      if(submitBtn){submitBtn.disabled=true;submitBtn.innerHTML='A enviar…';}
      fetch(FORM_ENDPOINT,{
        method:'POST',
        body:new URLSearchParams(data)
      }).then(function(r){
        return r.json().catch(function(){return {success:false};});
      }).then(function(res){
        if(res.success){hideStatus();showDone();}
        else show((res.message||'Não foi possível enviar.')+(res.message?'':' Por favor tente novamente, ou contacte-nos por telefone ((+351) 212 744 377) ou email (geral@carolinacamacho.pt).'),'error');
      }).catch(function(){
        show('Não foi possível enviar. Verifique a sua ligação à internet e tente novamente.','error');
      }).finally(function(){
        if(submitBtn){submitBtn.disabled=false;submitBtn.innerHTML=btnText;}
      });
    });
  });
})();
