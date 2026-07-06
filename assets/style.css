
:root{
  --ink:#13253A;
  --navy:#0C2D4D;
  --navy-deep:#071B30;
  --blue:#1B5E96;
  --blue-bright:#2E7FBE;
  --sky:#E9F2F9;
  --sky-line:#CFE1EF;
  --paper:#FAFCFE;
  --white:#FFFFFF;
  --gold:#C9A03C;
  --gold-soft:#E8CE8E;
  --font-display:"Bricolage Grotesque",Georgia,serif;
  --font-body:"Public Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
  --radius:16px;
  --shadow:0 10px 30px rgba(12,45,77,.08);
  --shadow-lift:0 22px 44px rgba(12,45,77,.16);
  --maxw:1140px;
  --ease:cubic-bezier(.22,.9,.3,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:var(--font-body);color:var(--ink);background:var(--paper);
  line-height:1.65;font-size:1rem;-webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
img{max-width:100%;display:block}
a{color:var(--blue)}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{
  outline:3px solid var(--blue-bright);outline-offset:2px;border-radius:4px;
}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}

/* ============ motion primitives ============ */
[data-reveal]{opacity:0;transform:translateY(26px);transition:opacity .7s var(--ease),transform .7s var(--ease);transition-delay:var(--d,0s)}
[data-reveal].in{opacity:1;transform:none}
@keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes floatA{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.08)}}
@keyframes floatB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,24px) scale(.94)}}
@keyframes drift40{0%,100%{transform:translateY(-52%)}50%{transform:translateY(-48%)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes lineGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition:none!important}
  [data-reveal]{opacity:1;transform:none}
}

/* ============ header ============ */
.site-header{
  position:sticky;top:0;z-index:60;
  background:rgba(255,255,255,.9);backdrop-filter:blur(12px);
  border-bottom:1px solid transparent;
  transition:border-color .3s ease,box-shadow .3s ease;
}
.site-header.scrolled{border-color:var(--sky-line);box-shadow:0 6px 24px rgba(12,45,77,.08)}
.header-inner{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:78px}
.brand{display:flex;align-items:center;gap:12px;text-decoration:none}
.brand img{height:46px;width:auto}
.nav-toggle{display:none;background:none;border:1px solid var(--sky-line);border-radius:10px;
  padding:8px 12px;cursor:pointer;color:var(--navy);font:inherit}
.site-nav ul{display:flex;gap:4px;list-style:none;align-items:center}
.site-nav a{
  position:relative;display:block;padding:10px 14px;border-radius:999px;
  text-decoration:none;color:var(--navy);
  font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  transition:color .2s ease;
}
.site-nav a::after{
  content:"";position:absolute;left:14px;right:14px;bottom:6px;height:2px;
  background:var(--gold);border-radius:2px;transform:scaleX(0);transform-origin:left;
  transition:transform .25s var(--ease);
}
.site-nav a:hover::after{transform:scaleX(1)}
.site-nav a[aria-current="page"]{background:var(--navy);color:#fff}
.site-nav a[aria-current="page"]::after{display:none}
.site-nav .nav-cta{background:var(--gold);color:var(--navy-deep);margin-left:8px}
.site-nav .nav-cta::after{display:none}
.site-nav .nav-cta:hover{background:var(--gold-soft)}
@media (max-width:900px){
  .nav-toggle{display:inline-flex;align-items:center;gap:8px}
  .site-nav{display:none;position:absolute;left:0;right:0;top:100%;
    background:#fff;border-bottom:1px solid var(--sky-line);box-shadow:var(--shadow)}
  .site-nav.open{display:block}
  .site-nav ul{flex-direction:column;align-items:stretch;padding:12px 16px 18px;gap:4px}
  .site-nav a{border-radius:10px}
  .site-nav .nav-cta{margin-left:0;text-align:center}
}

/* ============ buttons ============ */
.btn{
  position:relative;display:inline-flex;align-items:center;gap:10px;
  padding:14px 28px;border-radius:999px;border:0;cursor:pointer;
  font:700 .82rem/1 var(--font-body);letter-spacing:.09em;text-transform:uppercase;
  text-decoration:none;overflow:hidden;
  transition:transform .2s var(--ease),box-shadow .2s var(--ease),background .2s ease;
}
.btn:hover{transform:translateY(-3px)}
.btn:active{transform:translateY(-1px)}
.btn .arr{transition:transform .2s var(--ease)}
.btn:hover .arr{transform:translateX(4px)}
.btn-gold{background:var(--gold);color:var(--navy-deep);box-shadow:0 10px 24px rgba(201,160,60,.35)}
.btn-gold:hover{box-shadow:0 16px 32px rgba(201,160,60,.45)}
.btn-outline{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.55)}
.btn-outline:hover{background:rgba(255,255,255,.12)}
.btn-blue{background:var(--navy);color:#fff;box-shadow:0 10px 24px rgba(12,45,77,.25)}
.btn-blue:hover{background:var(--blue)}

/* ============ hero (home) ============ */
.hero{
  position:relative;overflow:hidden;color:#fff;
  background:linear-gradient(160deg,var(--navy) 0%,var(--navy-deep) 75%);
  min-height:88vh;display:flex;align-items:center;
}
.blob{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
.blob-a{width:560px;height:560px;right:-120px;top:-160px;background:rgba(46,127,190,.5);animation:floatA 14s ease-in-out infinite}
.blob-b{width:420px;height:420px;left:-140px;bottom:-160px;background:rgba(27,94,150,.45);animation:floatB 18s ease-in-out infinite}
.hero-grid-lines{
  position:absolute;inset:0;pointer-events:none;opacity:.35;
  background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);
  background-size:72px 72px;
  mask-image:radial-gradient(700px 500px at 30% 40%,#000,transparent 75%);
  -webkit-mask-image:radial-gradient(700px 500px at 30% 40%,#000,transparent 75%);
}
.hero-inner{position:relative;padding:110px 0;max-width:660px}
.hero .eyebrow{color:#BBD8EF}
.hero h1{
  font-family:var(--font-display);font-size:clamp(2.6rem,5.8vw,4.4rem);
  line-height:1.03;font-weight:600;letter-spacing:-.015em;margin:16px 0 26px;
}
.hero h1 .u{
  background-image:linear-gradient(var(--gold),var(--gold));
  background-repeat:no-repeat;background-position:0 92%;background-size:100% .12em;
}
.hero p{color:#D9E7F3;margin-bottom:16px;max-width:56ch;font-size:1.06rem}
.hero-actions{display:flex;flex-wrap:wrap;gap:14px;margin-top:34px}
.fade-1{animation:fadeUp .8s var(--ease) .05s both}
.fade-2{animation:fadeUp .8s var(--ease) .18s both}
.fade-3{animation:fadeUp .8s var(--ease) .32s both}
.fade-4{animation:fadeUp .8s var(--ease) .46s both}
.hero-40{
  position:absolute;right:-30px;top:50%;
  font-family:var(--font-display);font-weight:700;
  font-size:clamp(15rem,30vw,27rem);line-height:1;
  color:transparent;-webkit-text-stroke:2px rgba(201,160,60,.42);
  user-select:none;pointer-events:none;
  animation:drift40 9s ease-in-out infinite;
}
@media (max-width:960px){.hero-40{opacity:.4}}
.hero-scroll{
  position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
  color:#8FB4D4;font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
}

/* ============ sections ============ */
.eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  font-size:.74rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--blue);
}
.eyebrow::before{content:"";width:26px;height:2px;background:var(--gold);border-radius:2px}
.section{padding:96px 0}
.section h2,h2.disp{
  font-family:var(--font-display);font-weight:600;letter-spacing:-.015em;
  font-size:clamp(1.8rem,3.6vw,2.6rem);color:var(--navy);
  margin:12px 0 24px;line-height:1.12;
}
.section h3{font-family:var(--font-display);font-weight:600;font-size:1.3rem;color:var(--navy);margin:0 0 10px}
.section p{max-width:70ch;margin-bottom:14px}
.lede{font-size:1.12rem}

/* inner page hero */
.page-head{
  position:relative;overflow:hidden;color:#fff;
  background:linear-gradient(160deg,var(--navy),var(--navy-deep));
  padding:96px 0 84px;
}
.page-head .blob-a{width:440px;height:440px;right:-100px;top:-180px}
.page-head .eyebrow{color:#BBD8EF}
.page-head h1{
  font-family:var(--font-display);font-weight:600;letter-spacing:-.015em;
  font-size:clamp(2.2rem,5vw,3.4rem);margin-top:14px;line-height:1.06;
  animation:fadeUp .8s var(--ease) .08s both;
}
.page-head p{color:#D9E7F3;max-width:62ch;margin-top:16px;font-size:1.05rem;animation:fadeUp .8s var(--ease) .2s both}
.page-head .eyebrow{animation:fadeUp .8s var(--ease) 0s both}

/* split */
.split{display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center}
@media (max-width:880px){.split{grid-template-columns:1fr;gap:40px}}
.photo-frame{position:relative}
.photo-frame img{border-radius:var(--radius);box-shadow:var(--shadow-lift)}
.photo-frame::after{
  content:"";position:absolute;inset:auto -18px -18px auto;width:56%;height:56%;
  border:2px solid var(--gold);border-radius:var(--radius);z-index:-1;
  top:38px;left:38px;
}

/* nav cards (home) */
.cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
@media (max-width:880px){.cards3{grid-template-columns:1fr}}
.nav-card{
  position:relative;display:block;text-decoration:none;color:var(--ink);
  background:#fff;border:1px solid var(--sky-line);border-radius:var(--radius);
  padding:30px 28px 26px;overflow:hidden;
  transition:transform .25s var(--ease),box-shadow .25s var(--ease),border-color .25s ease;
}
.nav-card::before{
  content:"";position:absolute;left:0;right:0;top:0;height:4px;
  background:linear-gradient(90deg,var(--gold),var(--blue-bright));
  transform:scaleX(0);transform-origin:left;transition:transform .3s var(--ease);
}
.nav-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lift);border-color:transparent}
.nav-card:hover::before{transform:scaleX(1)}
.nav-card .ic{
  width:52px;height:52px;border-radius:14px;background:var(--sky);color:var(--blue);
  display:flex;align-items:center;justify-content:center;margin-bottom:18px;
  transition:background .25s ease,color .25s ease;
}
.nav-card:hover .ic{background:var(--navy);color:var(--gold-soft)}
.nav-card h3{font-family:var(--font-display);font-weight:600;font-size:1.2rem;color:var(--navy);margin-bottom:8px}
.nav-card p{font-size:.95rem;color:#4A5D70;margin:0}
.nav-card .go{
  display:inline-flex;align-items:center;gap:6px;margin-top:16px;
  font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);
}
.nav-card:hover .go{color:var(--navy)}

/* feature cards grid (sobre nós / serviços) */
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:36px}
@media (max-width:960px){.feat-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){.feat-grid{grid-template-columns:1fr}}
.feat{
  background:#fff;border:1px solid var(--sky-line);border-radius:var(--radius);
  padding:28px 26px;transition:transform .25s var(--ease),box-shadow .25s var(--ease);
}
.feat:hover{transform:translateY(-6px);box-shadow:var(--shadow-lift)}
.feat .ic{
  width:48px;height:48px;border-radius:12px;background:var(--sky);color:var(--blue);
  display:flex;align-items:center;justify-content:center;margin-bottom:16px;
}
.feat p{font-size:.97rem;margin:0;color:#38495B}
.feat h3{font-size:1.08rem;margin-bottom:8px}

.qa-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:36px}
@media (max-width:820px){.qa-grid{grid-template-columns:1fr}}
.qa-card{
  background:#fff;border:1px solid var(--sky-line);border-radius:var(--radius);
  padding:30px 28px;position:relative;overflow:hidden;
  transition:transform .25s var(--ease),box-shadow .25s var(--ease);
}
.qa-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lift)}
.qa-card::before{
  content:"";position:absolute;left:0;top:0;bottom:0;width:4px;
  background:linear-gradient(var(--gold),var(--blue-bright));
}
.qa-card h3{font-size:1.15rem;margin-bottom:10px}
.qa-card p{font-size:.97rem;margin-bottom:8px;color:#38495B}
.qa-card ul{margin:10px 0 0 20px;color:#38495B;font-size:.97rem}
.qa-card li{margin-bottom:8px}

/* dark band */
.dark-band{
  position:relative;overflow:hidden;color:#fff;
  background:linear-gradient(150deg,var(--navy),var(--navy-deep));
  padding:96px 0;
}
.dark-band .blob-a{width:480px;height:480px;right:-140px;bottom:-220px;top:auto;background:rgba(46,127,190,.4)}
.dark-band .eyebrow{color:#BBD8EF}
.dark-band h2{color:#fff;font-family:var(--font-display);font-weight:600;letter-spacing:-.015em;font-size:clamp(1.8rem,3.6vw,2.6rem);margin:12px 0 24px;line-height:1.12}
.dark-band p{color:#CFE0EF;max-width:70ch;margin-bottom:14px}
.dark-band .hl{color:var(--gold-soft);font-weight:600}

/* timeline (sinistros) */
.timeline{position:relative;margin:40px 0 10px;padding-left:64px;display:grid;gap:22px;list-style:none}
.timeline::before{
  content:"";position:absolute;left:23px;top:8px;bottom:8px;width:2px;
  background:linear-gradient(var(--gold),var(--blue-bright));
  transform-origin:top;
}
.timeline.in::before{animation:lineGrow 1.2s var(--ease) both}
.timeline li{position:relative;counter-increment:tl;background:#fff;border:1px solid var(--sky-line);
  border-radius:var(--radius);padding:20px 22px;transition:transform .25s var(--ease),box-shadow .25s var(--ease)}
.timeline li:hover{transform:translateX(6px);box-shadow:var(--shadow)}
.timeline{counter-reset:tl}
.timeline li::before{
  content:counter(tl,decimal-leading-zero);
  position:absolute;left:-64px;top:14px;width:48px;height:48px;
  display:flex;align-items:center;justify-content:center;
  background:var(--navy);color:var(--gold-soft);border-radius:50%;
  font-family:var(--font-display);font-weight:700;font-size:.95rem;
  box-shadow:0 0 0 6px var(--paper),0 8px 18px rgba(12,45,77,.2);
}

/* check list */
.check-list{list-style:none;display:grid;gap:12px;margin:22px 0}
.check-list li{
  position:relative;padding:16px 18px 16px 54px;background:#fff;
  border:1px solid var(--sky-line);border-radius:var(--radius);
  transition:transform .25s var(--ease),box-shadow .25s var(--ease);
}
.check-list li:hover{transform:translateX(6px);box-shadow:var(--shadow)}
.check-list li::before{
  content:"";position:absolute;left:18px;top:19px;width:22px;height:22px;
  background:var(--blue) url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>') center/12px no-repeat;
  border-radius:50%;
}

.download{
  display:inline-flex;align-items:center;gap:12px;margin:10px 0 4px;
  padding:16px 26px;background:var(--navy);border-radius:14px;color:#fff;
  text-decoration:none;font-weight:700;font-size:.9rem;letter-spacing:.04em;
  box-shadow:0 12px 26px rgba(12,45,77,.25);
  transition:transform .2s var(--ease),background .2s ease,box-shadow .2s var(--ease);
}
.download:hover{transform:translateY(-3px);background:var(--blue);box-shadow:0 18px 34px rgba(12,45,77,.3)}

/* CTA band */
.cta-band{
  position:relative;overflow:hidden;color:#fff;text-align:center;
  background:linear-gradient(140deg,var(--blue) 0%,var(--navy-deep) 80%);
  padding:88px 0;
}
.cta-band .blob-a{width:420px;height:420px;left:-120px;top:-160px;right:auto;background:rgba(201,160,60,.22)}
.cta-band h2{color:#fff;font-family:var(--font-display);font-weight:600;font-size:clamp(1.8rem,3.8vw,2.7rem);letter-spacing:-.015em;line-height:1.1;margin-bottom:14px}
.cta-band p{color:#D9E7F3;max-width:56ch;margin:0 auto 30px}

/* ============ forms ============ */
form.card{
  background:#fff;border:1px solid var(--sky-line);border-radius:var(--radius);
  box-shadow:var(--shadow);padding:38px;margin-top:34px;
}
fieldset{border:0;margin:0 0 36px}
fieldset:last-of-type{margin-bottom:10px}
legend{
  font-family:var(--font-display);font-weight:600;font-size:1.25rem;color:var(--navy);
  padding:0 0 8px;border-bottom:2px solid var(--sky);width:100%;margin-bottom:20px;
}
.grid{display:grid;gap:16px}
.g2{grid-template-columns:repeat(2,1fr)}
.g3{grid-template-columns:repeat(3,1fr)}
.g5{grid-template-columns:repeat(5,1fr)}
@media (max-width:760px){.g3,.g5{grid-template-columns:repeat(2,1fr)}}
@media (max-width:520px){.g2,.g3,.g5{grid-template-columns:1fr}}
.field label{display:block;font-size:.76rem;font-weight:700;letter-spacing:.07em;
  text-transform:uppercase;color:var(--blue);margin-bottom:6px}
.field input,.field select,.field textarea{
  width:100%;padding:13px 15px;border:1px solid var(--sky-line);border-radius:11px;
  font:inherit;color:var(--ink);background:var(--paper);
  transition:border-color .2s ease,box-shadow .2s ease;
}
.field input:focus,.field textarea:focus{border-color:var(--blue-bright);box-shadow:0 0 0 4px rgba(46,127,190,.12)}
textarea{min-height:130px;resize:vertical}
.radio-row{
  display:flex;flex-wrap:wrap;align-items:center;gap:18px;
  padding:15px 17px;background:var(--paper);border:1px solid var(--sky-line);border-radius:11px;
}
.radio-row>span{font-size:.86rem;font-weight:600;color:var(--navy);flex:1;min-width:220px}
.radio-row label{display:inline-flex;align-items:center;gap:8px;font-size:.92rem}
.coverage{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media (max-width:700px){.coverage{grid-template-columns:1fr}}
.coverage label{
  display:flex;align-items:flex-start;gap:10px;padding:13px 15px;
  background:var(--paper);border:1px solid var(--sky-line);border-radius:11px;
  font-size:.93rem;cursor:pointer;
  transition:border-color .2s ease,background .2s ease;
}
.coverage label:hover{border-color:var(--blue-bright);background:var(--sky)}
.coverage input{margin-top:3px}
input[type=checkbox],input[type=radio]{accent-color:var(--blue);width:16px;height:16px}
.form-notes{font-size:.85rem;color:#5A6B7C;margin-top:18px}
.form-notes p{margin-bottom:4px}
.form-actions{margin-top:28px}
.form-status{display:none;margin-top:18px;padding:16px 20px;border-radius:12px;font-weight:600;font-size:.95rem}
.form-status.success{display:block;background:#E8F5EC;color:#1E6B3A;border:1px solid #BFE3CC}
.form-status.error{display:block;background:#FBEDEC;color:#9E2B25;border:1px solid #F0C9C6}
.hp-field{position:absolute;left:-9999px;opacity:0;height:0;width:0;overflow:hidden}

/* ============ contactos ============ */
.contact-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:52px;align-items:start}
@media (max-width:900px){.contact-grid{grid-template-columns:1fr}}
.contact-card{
  background:#fff;border:1px solid var(--sky-line);border-radius:var(--radius);
  box-shadow:var(--shadow);padding:32px;
}
.contact-list{list-style:none;display:grid;gap:20px}
.contact-list li{display:flex;gap:16px;align-items:flex-start}
.contact-list .ic{
  flex:none;width:44px;height:44px;border-radius:12px;background:var(--sky);color:var(--blue);
  display:flex;align-items:center;justify-content:center;
}
.contact-list .lbl{
  display:block;font-size:.72rem;font-weight:700;letter-spacing:.18em;
  text-transform:uppercase;color:var(--blue);margin-bottom:2px;
}
.contact-list a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--sky-line);transition:color .2s ease}
.contact-list a:hover{color:var(--blue)}
.map{margin-top:28px;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--sky-line)}
.map iframe{display:block;width:100%;height:320px;border:0}

/* ============ insurers marquee ============ */
.insurers{padding:64px 0;text-align:center;overflow:hidden;background:#fff;border-top:1px solid var(--sky-line)}
.insurers .eyebrow{justify-content:center;margin-bottom:30px}
.marquee{overflow:hidden;position:relative}
.marquee::before,.marquee::after{
  content:"";position:absolute;top:0;bottom:0;width:90px;z-index:2;pointer-events:none;
}
.marquee::before{left:0;background:linear-gradient(90deg,#fff,transparent)}
.marquee::after{right:0;background:linear-gradient(-90deg,#fff,transparent)}
.marquee-track{display:flex;gap:20px;width:max-content;animation:marquee 28s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
.marquee-track span{
  display:inline-flex;align-items:center;justify-content:center;
  background:#fff;border:1px solid var(--sky-line);border-radius:14px;
  padding:16px 26px;min-height:80px;min-width:160px;
}
.marquee-track img{max-height:44px;width:auto;filter:grayscale(45%);opacity:.85;transition:filter .2s ease,opacity .2s ease}
.marquee-track span:hover img{filter:none;opacity:1}
@media (prefers-reduced-motion:reduce){
  .marquee-track{animation:none;flex-wrap:wrap;justify-content:center;width:auto}
  .marquee-track .dup{display:none}
}

/* ============ footer ============ */
.site-footer{background:var(--navy-deep);color:#B9CCDD;padding:64px 0 32px}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px}
@media (max-width:820px){.footer-grid{grid-template-columns:1fr;gap:28px}}
.footer-brand{font-family:var(--font-display);font-weight:600;font-size:1.3rem;color:#fff}
.footer-brand small{display:block;font-family:var(--font-body);font-weight:400;font-size:.82rem;color:#8FA9C0;margin-top:6px;letter-spacing:.05em}
.footer-h{font-size:.72rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#7E97AE;margin-bottom:14px}
.footer-nav{list-style:none;display:grid;gap:8px}
.footer-nav a{color:#C9DAE9;text-decoration:none;font-size:.92rem;transition:color .2s ease}
.footer-nav a:hover{color:var(--gold-soft)}
.footer-contact{font-size:.92rem;display:grid;gap:8px}
.footer-contact a{color:#C9DAE9;text-decoration:none}
.footer-contact a:hover{color:var(--gold-soft)}
.social{display:inline-flex;align-items:center;gap:10px;color:#fff;text-decoration:none;
  font-size:.8rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-top:18px;
  transition:color .2s ease}
.social:hover{color:var(--gold-soft)}
.copyright{border-top:1px solid rgba(255,255,255,.12);margin-top:44px;padding-top:22px;
  font-size:.76rem;letter-spacing:.08em;text-transform:uppercase;color:#7E97AE}
