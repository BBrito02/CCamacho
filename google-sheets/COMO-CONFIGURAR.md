# Formulários do site → Google Sheets

Cada pedido feito no site (Simulação ou Contacto):

1. fica guardado numa nova linha de uma folha de cálculo do Google (o mais recente aparece sempre no topo);
2. é enviado por email. Para responder ao cliente, basta carregar em **Responder**.

A folha tem uma coluna **Estado** (*Por contactar → Contactado → Proposta enviada → Fechado / Sem interesse*) e uma coluna **Notas**. Os pedidos ainda por contactar aparecem destacados a amarelo.

> Esta pasta (`google-sheets/`) **não** precisa de ser enviada para o alojamento do site.

---

## Instalação (cerca de 15 minutos, feita uma única vez)

Faça tudo **com a conta Google que vai receber os pedidos**.

### 1. Criar a folha de cálculo
1. Abra <https://sheets.new> para criar uma folha nova.
2. Dê-lhe um nome, por exemplo **Pedidos do Site — Carolina Camacho**.

### 2. Colar o código
1. Na folha, abra o menu **Extensões → Apps Script**.
2. Apague todo o texto que aparece no editor.
3. Copie e cole o conteúdo completo do ficheiro `Codigo.gs` (que está nesta pasta).
4. No início do código, confirme o email em `EMAIL_AVISO`. É para lá que vão os avisos.
5. Carregue no ícone de disquete (**Guardar**).

### 3. Executar a configuração inicial
1. Na barra de cima do editor, escolha a função **configurar** e carregue em **Executar**.
2. O Google pede autorização. Carregue em **Rever autorizações** e escolha a conta.
3. Vai aparecer o aviso *"A Google não validou esta app"*. É normal, porque o script é seu e não foi publicado na loja do Google. Carregue em **Avançadas → Aceder a … (não seguro)** e depois em **Permitir**.
4. Volte à folha de cálculo: devem ter aparecido os separadores **Simulações** e **Contactos**. Também deve ter chegado um email "configuração concluída".

### 4. Publicar como aplicação web
1. No editor, carregue em **Implementar → Nova implementação**.
2. Na roda dentada ao lado de "Selecionar tipo", escolha **Aplicação Web**.
3. Preencha assim:
   - **Executar como:** *Eu*
   - **Quem tem acesso:** *Qualquer pessoa*

   (Isto é o que permite ao site **enviar** pedidos. Ninguém consegue **ler** a folha, que continua privada.)
4. Carregue em **Implementar** e copie o **URL da aplicação Web**. É um endereço que começa por `https://script.google.com/` e termina em `/exec`.

### 5. Ligar o site
1. Abra o ficheiro `assets/main.js` do site.
2. Logo no início, cole o endereço entre as aspas:
   ```js
   var FORM_ENDPOINT = 'https://script.google.com/macros/s/..../exec';
   ```
3. Envie o `main.js` atualizado para o alojamento.

### 6. Testar
Faça um pedido de simulação no site. Em poucos segundos deve aparecer uma linha nova na folha **Simulações** e chegar o email de aviso. Depois, apague a linha de teste.

---

## Uso no dia a dia
- **Telemóvel:** instale a app **Google Sheets** para ver os pedidos em qualquer lado.
- **Estado:** escolha o valor na lista da coluna Estado. Para ver só o que falta tratar, use **Dados → Criar um filtro** e filtre por "Por contactar".
- **Colunas extra:** pode acrescentar colunas suas (ex.: "Seguradora", "Valor proposto"). O site continua a funcionar, mas **não mude o nome das colunas que já existem**.
- **Partilhar:** se outra pessoa precisar de ver os pedidos, use o botão **Partilhar** e escolha pessoas concretas. Nunca use "Qualquer pessoa com o link".

## Alterar o código mais tarde
Depois de editar o script, carregue em **Implementar → Gerir implementações**, depois no lápis, e em **Versão** escolha **Nova versão**, seguida de **Implementar**. Assim o endereço mantém-se igual e não é preciso mexer no site. Se em vez disso criar uma *nova implementação*, o endereço muda.

## Mudar para outra conta Google
1. Repita a instalação completa (passos 1 a 6) na nova conta, com o `EMAIL_AVISO` correto.
2. Substitua o endereço em `assets/main.js` pelo novo e envie-o para o alojamento.
3. Na conta antiga: **Implementar → Gerir implementações → Arquivar**, e apague a folha de testes. Assim não fica lá nenhum dado de clientes.

## Resposta automática ao cliente
Quando o cliente indica um email, recebe uma mensagem automática a agradecer o contacto e a dizer que a empresa entrará em contacto em breve. Esse email sai do endereço da conta Google onde o script está instalado, e as respostas do cliente chegam a essa caixa.
- O email tem título, resumo do pedido, próximos passos, contactos da empresa e o logótipo no fim.
- Para mudar os textos, edite no código `assuntoCliente`, `tituloCliente`, `respostaCliente` e `passosCliente` (um por formulário). Os contactos da assinatura estão em `EMPRESA`.
- Para ver como fica, execute a função **testarEmailCliente** no editor. Envia um exemplo para o `EMAIL_AVISO`.
- Para desligar, mude para `RESPOSTA_AUTOMATICA = false`.

Depois de qualquer alteração, publique uma nova versão (ver acima).

## Cores da coluna Estado
*Por contactar* a amarelo, *Contactado* e *Proposta enviada* a verde, *Fechado* a verde mais forte, *Sem interesse* a vermelho.
Para mudar as cores, edite `CORES_ESTADO` no código e execute a função **atualizarCores** no editor.
