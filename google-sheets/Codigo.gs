/**
 * CAROLINA CAMACHO — Receção dos formulários do site
 * ---------------------------------------------------
 * Cada pedido feito no site (Simulação ou Contacto) é:
 *   1. guardado numa nova linha desta folha de cálculo;
 *   2. enviado por email para o endereço em EMAIL_AVISO.
 *
 * Instruções de instalação: ver COMO-CONFIGURAR.md
 */

// ===================== CONFIGURAÇÃO =====================

// Quem recebe o aviso de cada novo pedido (vários: separar por vírgulas)
var EMAIL_AVISO = 'britobernardo0@gmail.com';

// true = envia ao cliente um email automático a agradecer o contacto
// (sai do endereço da conta Google onde o script está instalado)
var RESPOSTA_AUTOMATICA = true;

// Proteção contra abuso: máximo de pedidos aceites por hora
var LIMITE_POR_HORA = 60;

// Opções da coluna "Estado"
var ESTADOS = ['Por contactar', 'Contactado', 'Proposta enviada', 'Fechado', 'Sem interesse'];

// ========================================================

var FORMULARIOS = {
  simulacao: {
    folha: 'Simulações',
    assunto: 'Novo pedido de Simulação Automóvel',
    // [campo do site, título da coluna, secção no email]
    campos: [
      ['nome', 'Nome', 'Dados do Condutor'],
      ['telefone', 'Telefone', 'Dados de Contacto'],
      ['email', 'Email', 'Dados de Contacto'],
      ['contacto_nome', 'Pessoa a Contactar', 'Dados de Contacto'],
      ['morada', 'Morada', 'Dados do Condutor'],
      ['codigo_postal', 'Código Postal', 'Dados do Condutor'],
      ['localidade', 'Localidade', 'Dados do Condutor'],
      ['profissao', 'Profissão', 'Dados do Condutor'],
      ['data_nascimento', 'Data de Nascimento', 'Dados do Condutor'],
      ['data_carta', 'Data da Carta', 'Dados do Condutor'],
      ['nif', 'NIF', 'Dados do Condutor'],
      ['marca', 'Marca', 'Dados do Veículo'],
      ['modelo', 'Modelo', 'Dados do Veículo'],
      ['matricula', 'Matrícula', 'Dados do Veículo'],
      ['ano', 'Ano', 'Dados do Veículo'],
      ['cilindrada', 'Cilindrada', 'Dados do Veículo'],
      ['lotacao', 'Lotação', 'Dados do Veículo'],
      ['peso_bruto', 'Peso Bruto', 'Dados do Veículo'],
      ['condutor_habitual', 'Condutor Habitual?', 'Dados do Veículo'],
      ['teve_seguro', 'Tem/Teve Seguro?', 'Dados do Veículo'],
      ['responsabilidade_civil', 'Responsabilidade Civil', 'Coberturas Pretendidas'],
      ['coberturas', 'Coberturas', 'Coberturas Pretendidas'],
      ['valor_veiculo', 'Valor do Veículo', 'Coberturas Pretendidas'],
      ['franquia', 'Franquia', 'Coberturas Pretendidas'],
      ['protocolo', 'Protocolo', 'Coberturas Pretendidas'],
      ['observacoes', 'Observações', 'Dados de Contacto']
    ],
    obrigatorios: ['nome', 'data_nascimento', 'data_carta', 'marca', 'modelo', 'matricula'],
    umDe: ['telefone', 'email'],
    // email automático para o cliente
    assuntoCliente: 'Recebemos o seu pedido de simulação — Carolina Camacho',
    tituloCliente: 'Recebemos o seu pedido de simulação',
    respostaCliente: 'Agradecemos o seu pedido de simulação de seguro automóvel. Confirmamos que o recebemos e que já está a ser tratado pela nossa equipa.',
    passosCliente: [
      'Analisamos os dados do condutor e da viatura.',
      'Comparamos as condições das seguradoras com que trabalhamos.',
      'Entramos em contacto consigo com a nossa melhor proposta, o mais brevemente possível.'
    ],
    // [título, campos do site] mostrados no resumo do pedido
    resumoCliente: [['Viatura', ['marca', 'modelo']], ['Matrícula', ['matricula']]]
  },
  contacto: {
    folha: 'Contactos',
    assunto: 'Nova mensagem de Contacto',
    campos: [
      ['nome', 'Nome', 'Mensagem'],
      ['email', 'Email', 'Mensagem'],
      ['assunto', 'Assunto', 'Mensagem'],
      ['mensagem', 'Mensagem', 'Mensagem']
    ],
    obrigatorios: ['nome', 'email', 'mensagem'],
    umDe: [],
    assuntoCliente: 'Obrigado pelo seu contacto — Carolina Camacho',
    tituloCliente: 'Recebemos a sua mensagem',
    respostaCliente: 'Agradecemos o seu contacto. Confirmamos que recebemos a sua mensagem e que já está a ser tratada pela nossa equipa.',
    passosCliente: [
      'Analisamos a sua mensagem.',
      'Entramos em contacto consigo o mais brevemente possível.'
    ],
    resumoCliente: [['Assunto', ['assunto']]]
  }
};

var CAMPOS_LONGOS = ['observacoes', 'mensagem', 'coberturas'];
var COL_DATA = 'Recebido em', COL_ESTADO = 'Estado', COL_NOTAS = 'Notas', COL_RGPD = 'Consentimento RGPD';

// ---------- receção do pedido (chamado pelo site) ----------
function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // armadilha para robôs: finge sucesso e não guarda nada
    if (p.botcheck) return resposta(true, 'Enviado.');

    var def = FORMULARIOS[p.formulario];
    if (!def) return resposta(false, 'Formulário desconhecido.');

    var dados = {};
    def.campos.forEach(function (c) {
      dados[c[0]] = limpar(p[c[0]], CAMPOS_LONGOS.indexOf(c[0]) > -1 ? 5000 : 300);
    });

    // validação (repete a do site, para não depender do browser)
    for (var i = 0; i < def.obrigatorios.length; i++) {
      if (!dados[def.obrigatorios[i]]) return resposta(false, 'Faltam campos obrigatórios. Por favor verifique o formulário.');
    }
    if (def.umDe.length && !def.umDe.some(function (k) { return dados[k]; })) {
      return resposta(false, 'Indique o telefone/telemóvel ou o email.');
    }
    if (!p.consentimento_rgpd) {
      return resposta(false, 'Para enviarmos o pedido precisamos da sua autorização para tratar os dados.');
    }
    if (dados.email && !emailValido(dados.email)) {
      return resposta(false, 'O email indicado não é válido.');
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      if (excedeuLimite()) {
        return resposta(false, 'Estamos a receber muitos pedidos neste momento. Por favor tente mais tarde ou contacte-nos por telefone.');
      }
      guardar(def, dados);
    } finally {
      lock.releaseLock();
    }

    // o pedido já está guardado: uma falha no email não deve dar erro ao cliente
    try { enviarAviso(def, dados); } catch (err) { console.error('Falha no email de aviso: ' + err); }
    if (RESPOSTA_AUTOMATICA && dados.email) {
      try { enviarRespostaCliente(def, dados); } catch (err) { console.error('Falha na resposta automática: ' + err); }
    }

    return resposta(true, 'Enviado com sucesso.');
  } catch (err) {
    console.error(err);
    return resposta(false, 'Não foi possível enviar neste momento. Por favor tente novamente, ou contacte-nos por telefone.');
  }
}

// abrir o endereço no browser mostra isto (serve para confirmar que está ativo)
function doGet() {
  return ContentService.createTextOutput('Formulários Carolina Camacho: ativo.');
}

// ---------- folha de cálculo ----------
function guardar(def, dados) {
  var folha = obterFolha(def);
  var cabecalho = folha.getRange(1, 1, 1, folha.getLastColumn()).getValues()[0];
  var porTitulo = {};
  def.campos.forEach(function (c) { porTitulo[c[1]] = mostrar(c[0], dados[c[0]]); });
  porTitulo[COL_DATA] = new Date();
  porTitulo[COL_ESTADO] = ESTADOS[0];
  porTitulo[COL_RGPD] = 'Sim';

  // colunas acrescentadas por si (ou reordenadas) continuam a funcionar
  var linha = cabecalho.map(function (t) {
    var v = porTitulo.hasOwnProperty(t) ? porTitulo[t] : '';
    return typeof v === 'string' ? semFormula(v) : v;
  });

  // o pedido mais recente fica sempre no topo (linha 2)
  folha.insertRowBefore(2);
  var r = folha.getRange(2, 1, 1, linha.length);
  r.setValues([linha])
    .setFontWeight('normal').setBackground(null).setFontColor('#13253a')
    .setVerticalAlignment('top').setWrap(false);
  var cData = cabecalho.indexOf(COL_DATA) + 1;
  if (cData) folha.getRange(2, cData).setNumberFormat('dd/mm/yyyy hh:mm');
  var cEstado = cabecalho.indexOf(COL_ESTADO) + 1;
  if (cEstado) folha.getRange(2, cEstado).setDataValidation(regraEstado());
}

function obterFolha(def) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var folha = ss.getSheetByName(def.folha);
  if (folha) return folha;

  folha = ss.insertSheet(def.folha);
  var titulos = [COL_DATA, COL_ESTADO]
    .concat(def.campos.map(function (c) { return c[1]; }))
    .concat([COL_RGPD, COL_NOTAS]);
  folha.getRange(1, 1, 1, titulos.length).setValues([titulos])
    .setFontWeight('bold').setBackground('#0c2d4d').setFontColor('#ffffff')
    .setVerticalAlignment('middle');
  folha.setFrozenRows(1);
  folha.setFrozenColumns(3); // data, estado e nome sempre visíveis
  folha.setRowHeight(1, 32);
  folha.setColumnWidth(1, 130);
  folha.setColumnWidth(2, 140);
  folha.setColumnWidth(3, 180);
  if (folha.getMaxColumns() > titulos.length) {
    folha.deleteColumns(titulos.length + 1, folha.getMaxColumns() - titulos.length);
  }
  folha.setColumnWidth(titulos.length, 260); // Notas

  aplicarCores(folha);

  var vazia = ss.getSheetByName('Folha1') || ss.getSheetByName('Sheet1');
  if (vazia && vazia.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(vazia);
  return folha;
}

// Cores da coluna "Estado". Para mudar uma cor, altere aqui e execute a função
// "atualizarCores" no editor (aplica-se às linhas que já existem).
var CORES_ESTADO = {
  'Por contactar':    { fundo: '#fff4c2', texto: '#7a5b00', negrito: true }, // amarelo
  'Contactado':       { fundo: '#d9f2e1', texto: '#1e6b3a' },                // verde
  'Proposta enviada': { fundo: '#d9f2e1', texto: '#1e6b3a' },                // verde
  'Fechado':          { fundo: '#b7e4c7', texto: '#14532d', negrito: true }, // verde mais forte
  'Sem interesse':    { fundo: '#fbe0de', texto: '#9e2b25' }                 // vermelho
};

function aplicarCores(folha) {
  var cabecalho = folha.getRange(1, 1, 1, folha.getLastColumn()).getValues()[0];
  var c = cabecalho.indexOf(COL_ESTADO) + 1;
  if (!c) return;
  // coluna inteira: não se desloca quando se inserem linhas
  var col = folha.getRange(1, c, folha.getMaxRows(), 1);
  var regras = Object.keys(CORES_ESTADO).map(function (estado) {
    var cor = CORES_ESTADO[estado];
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(estado)
      .setBackground(cor.fundo).setFontColor(cor.texto).setBold(!!cor.negrito)
      .setRanges([col]).build();
  });
  folha.setConditionalFormatRules(regras);
}

// Executar no editor depois de mudar as cores (atualiza os dois separadores)
function atualizarCores() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(FORMULARIOS).forEach(function (k) {
    var folha = ss.getSheetByName(FORMULARIOS[k].folha);
    if (folha) aplicarCores(folha);
  });
}

function regraEstado() {
  return SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(true).build();
}

// ---------- emails ----------
function enviarAviso(def, dados) {
  var seccoes = [], porSeccao = {};
  def.campos.forEach(function (c) {
    if (!dados[c[0]]) return;
    if (!porSeccao[c[2]]) { porSeccao[c[2]] = []; seccoes.push(c[2]); }
    porSeccao[c[2]].push([c[1], mostrar(c[0], dados[c[0]])]);
  });

  var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var contacto = [dados.telefone, dados.email].filter(String).join(' · ');
  var html = '<div style="font-family:Arial,Helvetica,sans-serif;color:#13253a;max-width:640px">' +
    '<h2 style="color:#0c2d4d;margin:0 0 4px">' + esc(def.assunto) + '</h2>' +
    '<p style="margin:0 0 6px;font-size:16px"><b>' + esc(dados.nome) + '</b>' + (contacto ? ' — ' + esc(contacto) : '') + '</p>' +
    '<p style="margin:0 0 18px"><a href="' + url + '" style="color:#1b5e96">Abrir a lista de pedidos</a></p>';
  var texto = def.assunto + '\n' + dados.nome + (contacto ? ' — ' + contacto : '') + '\n';
  seccoes.forEach(function (s) {
    html += '<h3 style="color:#0c2d4d;margin:20px 0 6px;font-size:15px">' + esc(s) + '</h3><table style="border-collapse:collapse;width:100%;font-size:14px">';
    texto += '\n== ' + s + ' ==\n';
    porSeccao[s].forEach(function (par) {
      html += '<tr><td style="padding:7px 12px;border-bottom:1px solid #e9f2f9;color:#1b5e96;font-weight:bold;width:38%;vertical-align:top">' + esc(par[0]) +
        '</td><td style="padding:7px 12px;border-bottom:1px solid #e9f2f9">' + esc(par[1]).replace(/\n/g, '<br>') + '</td></tr>';
      texto += par[0] + ': ' + par[1] + '\n';
    });
    html += '</table>';
  });
  html += '<p style="color:#5a6b7c;font-size:12px;margin-top:22px">O cliente deu consentimento RGPD para o tratamento destes dados.</p></div>';
  texto += '\nLista de pedidos: ' + url + '\n';

  var opcoes = { to: EMAIL_AVISO, subject: def.assunto + ' — ' + dados.nome, htmlBody: html, body: texto, name: 'Website Carolina Camacho' };
  if (dados.email) opcoes.replyTo = dados.email; // "Responder" vai direto ao cliente
  MailApp.sendEmail(opcoes);
}

// Dados da empresa usados na assinatura do email ao cliente
var EMPRESA = {
  nome: 'Carolina Camacho, Lda.',
  slogan: 'Mediação de Seguros · Há mais de 40 anos a pensar em si',
  telefone: '(+351) 212 744 377',
  telefoneLink: '+351212744377',
  email: 'geral@carolinacamacho.pt',
  morada: 'Avenida 25 Abril 36 - B, 1º - G, 2800-299 Almada',
  site: 'www.carolinacamacho.pt'
};

function enviarRespostaCliente(def, dados) {
  var html = emailCliente(def, dados);
  var logo = Utilities.newBlob(Utilities.base64Decode(LOGO_BASE64), 'image/png', 'logo-carolina-camacho.png');
  MailApp.sendEmail({
    to: dados.email,
    subject: def.assuntoCliente,
    htmlBody: html.html,
    body: html.texto,
    inlineImages: { logo: logo },
    name: EMPRESA.nome
  });
}

// Constrói o email ao cliente (HTML + versão em texto simples)
function emailCliente(def, dados) {
  var NAVY = '#0c2d4d', GOLD = '#c9a03c', INK = '#13253a', MUTED = '#5a6b7c', LINE = '#e3edf5', SKY = '#f3f8fc';
  var quando = Utilities.formatDate(new Date(), 'Europe/Lisbon', "dd/MM/yyyy 'às' HH:mm");

  var resumo = def.resumoCliente.map(function (r) {
    var v = r[1].map(function (k) { return dados[k]; }).filter(String).join(' ');
    return [r[0], v];
  }).filter(function (r) { return r[1]; });
  resumo.push(['Data do pedido', quando]);

  var linhasResumo = resumo.map(function (r, i) {
    var borda = i < resumo.length - 1 ? 'border-bottom:1px solid ' + LINE + ';' : '';
    return '<tr><td style="padding:10px 0;' + borda + 'color:' + MUTED + ';font-size:13px;width:42%">' + esc(r[0]) + '</td>' +
      '<td style="padding:10px 0;' + borda + 'color:' + INK + ';font-size:14px;font-weight:bold">' + esc(r[1]) + '</td></tr>';
  }).join('');

  var passos = def.passosCliente.map(function (p, i) {
    return '<tr><td style="vertical-align:top;padding:0 14px 14px 0;width:28px">' +
      '<div style="width:28px;height:28px;line-height:28px;border-radius:14px;background:' + NAVY + ';color:#ffffff;text-align:center;font-weight:bold;font-size:13px">' + (i + 1) + '</div></td>' +
      '<td style="vertical-align:top;padding:4px 0 14px;color:' + INK + ';font-size:15px;line-height:1.5">' + esc(p) + '</td></tr>';
  }).join('');

  var html =
    '<div style="margin:0;padding:0;background:#eef3f8">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f8"><tr><td align="center" style="padding:28px 12px">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">' +

    // faixa superior
    '<tr><td style="background:' + NAVY + ';height:6px;line-height:6px;font-size:0;border-bottom:3px solid ' + GOLD + '">&nbsp;</td></tr>' +

    // título e introdução
    '<tr><td style="padding:36px 40px 8px">' +
    '<p style="margin:0 0 6px;color:' + GOLD + ';font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Confirmação de receção</p>' +
    '<h1 style="margin:0 0 22px;color:' + NAVY + ';font-size:24px;line-height:1.3;font-weight:bold">' + esc(def.tituloCliente) + '</h1>' +
    '<p style="margin:0 0 14px;color:' + INK + ';font-size:15px;line-height:1.6">Caro(a) ' + esc(dados.nome) + ',</p>' +
    '<p style="margin:0;color:' + INK + ';font-size:15px;line-height:1.6">' + esc(def.respostaCliente) + '</p>' +
    '</td></tr>' +

    // resumo do pedido
    '<tr><td style="padding:24px 40px 8px">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + SKY + ';border:1px solid ' + LINE + ';border-radius:10px">' +
    '<tr><td style="padding:16px 22px 6px;color:' + NAVY + ';font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase">Resumo do pedido</td></tr>' +
    '<tr><td style="padding:0 22px 10px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + linhasResumo + '</table></td></tr>' +
    '</table></td></tr>' +

    // próximos passos
    '<tr><td style="padding:26px 40px 6px">' +
    '<p style="margin:0 0 16px;color:' + NAVY + ';font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase">Próximos passos</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0">' + passos + '</table>' +
    '</td></tr>' +

    // contactos
    '<tr><td style="padding:10px 40px 30px">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ' + LINE + '"><tr><td style="padding-top:22px">' +
    '<p style="margin:0 0 10px;color:' + INK + ';font-size:15px;line-height:1.6"><b>Precisa de falar connosco?</b> Estamos ao seu dispor:</p>' +
    '<p style="margin:0;color:' + INK + ';font-size:14px;line-height:1.9">' +
    '<span style="color:' + MUTED + '">Telefone:</span> <a href="tel:' + EMPRESA.telefoneLink + '" style="color:' + NAVY + ';text-decoration:none;font-weight:bold">' + EMPRESA.telefone + '</a><br>' +
    '<span style="color:' + MUTED + '">Email:</span> <a href="mailto:' + EMPRESA.email + '" style="color:' + NAVY + ';text-decoration:none;font-weight:bold">' + EMPRESA.email + '</a><br>' +
    '<span style="color:' + MUTED + '">Morada:</span> ' + EMPRESA.morada +
    '</p></td></tr></table>' +
    '</td></tr>' +

    // assinatura com logótipo
    '<tr><td style="padding:0 40px 34px">' +
    '<p style="margin:0 0 18px;color:' + INK + ';font-size:15px;line-height:1.6">Com os melhores cumprimentos,<br><b>A equipa Carolina Camacho</b></p>' +
    '<img src="cid:logo" width="220" alt="Carolina Camacho — gestão e mediação de seguros" style="display:block;width:220px;max-width:100%;height:auto;border:0">' +
    '<p style="margin:10px 0 0;color:' + MUTED + ';font-size:12px">' + esc(EMPRESA.slogan) + '</p>' +
    '</td></tr>' +

    // rodapé
    '<tr><td style="background:' + SKY + ';padding:16px 40px;color:' + MUTED + ';font-size:11px;line-height:1.6;border-top:1px solid ' + LINE + '">' +
    'Recebeu este email porque submeteu um pedido em <a href="https://' + EMPRESA.site + '" style="color:' + MUTED + '">' + EMPRESA.site + '</a>. ' +
    'Os seus dados são tratados exclusivamente para responder ao seu pedido, de acordo com o RGPD.' +
    '</td></tr>' +

    '</table></td></tr></table></div>';

  var texto = def.tituloCliente.toUpperCase() + '\n\n' +
    'Caro(a) ' + dados.nome + ',\n\n' + def.respostaCliente + '\n\n' +
    'RESUMO DO PEDIDO\n' + resumo.map(function (r) { return '- ' + r[0] + ': ' + r[1]; }).join('\n') + '\n\n' +
    'PRÓXIMOS PASSOS\n' + def.passosCliente.map(function (p, i) { return (i + 1) + '. ' + p; }).join('\n') + '\n\n' +
    'Precisa de falar connosco?\nTelefone: ' + EMPRESA.telefone + '\nEmail: ' + EMPRESA.email + '\nMorada: ' + EMPRESA.morada + '\n\n' +
    'Com os melhores cumprimentos,\nA equipa Carolina Camacho\n' + EMPRESA.nome + ' — ' + EMPRESA.slogan + '\n' + EMPRESA.site;

  return { html: html, texto: texto };
}

// Envia para EMAIL_AVISO um exemplo do email que o cliente recebe (executar no editor)
function testarEmailCliente() {
  var exemplo = { nome: 'João Silva', email: EMAIL_AVISO, marca: 'Renault', modelo: 'Clio', matricula: 'AA-00-BB' };
  enviarRespostaCliente(FORMULARIOS.simulacao, exemplo);
}

// ---------- utilitários ----------
function resposta(ok, msg) {
  return ContentService.createTextOutput(JSON.stringify({ success: ok, message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

function limpar(v, max) {
  if (v === undefined || v === null) return '';
  v = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  if (max <= 300) v = v.replace(/\s+/g, ' ');
  return v.trim().slice(0, max);
}

// impede que um texto seja interpretado como fórmula na folha de cálculo
function semFormula(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function mostrar(campo, v) {
  if (!v) return '';
  if (v === 'sim') return 'Sim';
  if (v === 'nao') return 'Não';
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (m && campo.indexOf('data_') === 0) return m[3] + '/' + m[2] + '/' + m[1];
  return v;
}

function emailValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function excedeuLimite() {
  var cache = CacheService.getScriptCache();
  var chave = 'pedidos_' + Math.floor(Date.now() / 3600000);
  var n = Number(cache.get(chave) || 0);
  if (n >= LIMITE_POR_HORA) return true;
  cache.put(chave, String(n + 1), 3700);
  return false;
}

// ---------- instalação (executar uma vez a partir do editor) ----------
// Cria os separadores "Simulações" e "Contactos", pede as autorizações
// necessárias e envia um email de teste para EMAIL_AVISO.
function configurar() {
  obterFolha(FORMULARIOS.simulacao);
  obterFolha(FORMULARIOS.contacto);
  atualizarCores();
  MailApp.sendEmail(EMAIL_AVISO, 'Formulários do site — configuração concluída',
    'Está tudo pronto. Os pedidos feitos no site vão aparecer nesta folha de cálculo:\n' +
    SpreadsheetApp.getActiveSpreadsheet().getUrl());
}


// ---------- logótipo (imgs/logo-carolina-camacho.png, em base64) ----------
// Aparece no fim do email ao cliente. Não é preciso alterar.
var LOGO_BASE64 =
  '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';
