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
    assuntoCliente: 'Recebemos o seu pedido de simulação — Carolina Camacho',
    respostaCliente: 'Obrigado pelo seu pedido de simulação. Já o recebemos e iremos entrar em contacto consigo o mais brevemente possível com a nossa melhor proposta.'
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
    respostaCliente: 'Obrigado pelo seu contacto. Já recebemos a sua mensagem e iremos entrar em contacto consigo o mais brevemente possível.'
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

function enviarRespostaCliente(def, dados) {
  var nome = dados.nome.split(' ')[0];
  var corpo = 'Olá ' + nome + ',\n\n' + def.respostaCliente +
    '\n\nSe precisar de falar connosco antes disso, pode ligar-nos para o (+351) 212 744 377 ou responder a este email.\n\n' +
    'Com os melhores cumprimentos,\nCarolina Camacho, Lda.\nAvenida 25 Abril 36 - B, 1º - G, 2800-299 Almada';
  MailApp.sendEmail({ to: dados.email, subject: def.assuntoCliente, body: corpo, name: 'Carolina Camacho, Lda.' });
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
