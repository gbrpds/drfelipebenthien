/* Diagnóstico do Sono — Método DERAA (fiel à lógica original do Dr. Felipe).
   10 perguntas · 5 pilares · Índice de Sono · retrato com radar + maior gargalo. */
(function () {
  "use strict";

  var PILARES = {
    desconexao:  { letra: "D", nome: "Desconexão",      curto: "Desconexão",  color: "#4F8EF7",
      diag: { bom: "Você protege bem sua janela de sono dos estímulos noturnos.", atencao: "Telas e notificações ainda invadem parte da sua hora de dormir.", critico: "Seu cérebro chega na cama em modo de alerta — telas e estímulos até o último minuto." },
      acao: "Deixe o celular carregando fora do quarto e corte telas 30 min antes de deitar." },
    energia:     { letra: "E", nome: "Energia",         curto: "Energia",     color: "#34C759",
      diag: { bom: "Sua energia se mantém ao longo do dia — sinal de sono restaurador.", atencao: "Sua energia oscila: o sono restaura, mas não por completo.", critico: "Você acorda esgotado e arrasta o cansaço pelo dia — seu sono não está restaurando." },
      acao: "Pegue 10 min de luz natural ao acordar e, se cochilar, no máximo 20 min antes das 15h." },
    rotina:      { letra: "R", nome: "Rotina",          curto: "Rotina",      color: "#FF9F0A",
      diag: { bom: "Seu relógio biológico tem a previsibilidade de que precisa.", atencao: "Seus horários variam o suficiente para confundir seu relógio.", critico: "Sem horários fixos, seu corpo não sabe a que horas liberar melatonina." },
      acao: "Fixe um horário para acordar — e mantenha amanhã, mesmo no fim de semana." },
    alimentacao: { letra: "A", nome: "Alimentação",     curto: "Alimentação", color: "#E8854F",
      diag: { bom: "Seu ritmo alimentar respeita as janelas metabólicas do sono.", atencao: "O horário das refeições e da cafeína ainda atrapalha seu sono.", critico: "Jantar tarde e cafeína à tarde estão jogando contra o seu sono profundo." },
      acao: "Antecipe e leve o jantar, e corte cafeína a partir das 14h." },
    atividade:   { letra: "A", nome: "Atividade Física", curto: "Atividade",  color: "#BF5AF2",
      diag: { bom: "Você se movimenta na medida e no horário certo — seu sono agradece.", atencao: "Falta movimento (ou ele está no horário errado) para gerar pressão de sono.", critico: "Sedentarismo ou treino tarde demais: seu corpo não acumula cansaço bom para a noite." },
      acao: "Faça 20 min de caminhada ao sol e encerre treinos intensos até 3h antes de dormir." }
  };
  var ORDER = ["desconexao", "energia", "rotina", "alimentacao", "atividade"];

  var QUESTIONS = [
    { id: "d1", pilar: "desconexao", label: "Você usa o celular na cama antes de dormir?", options: [["Nunca",0],["Às vezes",1],["Frequentemente",3],["Todo dia",4]] },
    { id: "d2", pilar: "desconexao", label: "Quanto tempo antes de dormir você para de usar telas?", options: [["Mais de 1h",0],["30–60 min",1],["Menos de 30 min",3],["Uso até dormir",4]] },
    { id: "e1", pilar: "energia", label: "Você acorda sentindo que não descansou, mesmo dormindo horas suficientes?", options: [["Raramente",0],["Às vezes",1],["Frequentemente",3],["Todo dia",4]] },
    { id: "e2", pilar: "energia", label: "Sua energia despenca à tarde ou você sente necessidade de cochilar?", options: [["Nunca",0],["Raramente",1],["Às vezes",2],["Quase todo dia",4]] },
    { id: "r1", pilar: "rotina", label: "Você dorme e acorda nos mesmos horários todos os dias?", options: [["Sempre",0],["Quase sempre",1],["Raramente",3],["Nunca",4]] },
    { id: "r2", pilar: "rotina", label: "Nos fins de semana, seu horário de dormir muda mais de 1 hora?", options: [["Não muda",0],["Muda 1–2h",2],["Muda mais de 2h",4]] },
    { id: "a1", pilar: "alimentacao", label: "Você faz refeições pesadas nas últimas 2 horas antes de dormir?", options: [["Nunca",0],["Às vezes",1],["Frequentemente",3],["Todo dia",4]] },
    { id: "a2", pilar: "alimentacao", label: "Você consome cafeína (café, chá preto, energético) depois das 15h?", options: [["Nunca",0],["Às vezes",1],["Frequentemente",3],["Todo dia",4]] },
    { id: "f1", pilar: "atividade", label: "Você pratica atividade física regularmente?", options: [["Todo dia",0],["3–4x por semana",1],["1–2x por semana",3],["Raramente ou nunca",4]] },
    { id: "f2", pilar: "atividade", label: "Quando você costuma se exercitar?", options: [["De manhã",0],["À tarde",0],["À noite",3],["Não pratico",4]] }
  ];

  var FAIXAS = {
    excelente: { label: "Sono Restaurador", desc: "Seu sono está trabalhando a seu favor. Pequenos ajustes finos elevam ainda mais sua recuperação.", color: "#2f9e44" },
    bom:       { label: "Sono Funcional",   desc: "Você dorme, mas seu sono ainda deixa recuperação na mesa. Há pilares claros para destravar.", color: "#7ca50a" },
    atencao:   { label: "Sono em Alerta",   desc: "Seu sono está cobrando um preço silencioso na sua energia e no seu humor. É hora de agir.", color: "#e08600" },
    critico:   { label: "Sono em Débito",   desc: "Seu corpo está acumulando uma dívida de sono que afeta corpo, mente e disposição todos os dias.", color: "#d1332a" }
  };
  var FAIXA_COPY = {
    excelente: "Seu sono está em boa forma — Sono Restaurador. 🌙 Raro e ótimo. Mas “bom” não é “à prova de recaída” — pequenos sabotadores derrubam isso rápido. Dá pra blindar o que você já conquistou.",
    bom: "Seu sono é Funcional — você se vira, mas não descansa de verdade. Você funciona no dia a dia, mas deixa energia, foco e humor na mesa toda noite. É o sono que parece “ok”... até você sentir como é dormir de verdade.",
    atencao: "Seu sono está em Alerta. Seu corpo já paga a conta: as noites não restauram o que o dia gasta. Quanto mais tempo nesse padrão, mais fundo o buraco — e mais difícil sair sozinho.",
    critico: "Seu sono está em Débito — o nível mais crítico. Faz tempo que seu corpo opera no vermelho: dorme, mas não repara. Isso não se resolve com “uma boa noite” — é preciso reconstruir o sono na sequência certa. A boa notícia: tem caminho, e começa por entender o seu maior gargalo. 👇"
  };
  var GARGALO_COPY = {
    desconexao: "Sua mente não desliga na hora de dormir. Você deita e o pensamento acelera — o corpo está pronto, a cabeça não. É o gatilho que mais rouba o início do seu sono.",
    energia: "Você acorda sem combustível. Seu corpo não completa as fases profundas que recarregam de verdade — por isso o cansaço persiste mesmo dormindo horas.",
    rotina: "Seus horários estão desregulando seu relógio interno. Sem ritmo, o corpo nunca sabe a hora de soltar o sono — e você paga com noites bagunçadas.",
    alimentacao: "O que e quando você come atrapalha seu sono sem você perceber. Cafeína, horário e refeições pesadas sabotam a noite pela porta dos fundos.",
    atividade: "Seu corpo passa o dia sem gastar a energia que precisaria pra “pedir” sono à noite. Movimento é um dos reguladores mais subestimados do sono profundo."
  };
  var BRIDGE_COPY = "Esse retrato é o ponto de partida. O que vem depois — recolocar cada pilar no lugar, na ordem certa — é exatamente o que o Dr. Felipe Benthien organizou no Protocolo Reset do Sono: o mesmo método que ele aplica no consultório, em aulas curtas pra você aplicar em casa. Sem remédio. No seu ritmo. Começando pelo seu maior gargalo.";
  var RONCO_COPY = "Um ponto que merece atenção: suas respostas mostram sinais de ronco/apneia. Isso pode ser mais do que sono ruim — e nenhuma avaliação online confirma ou descarta sozinha. No seu caso, o ideal é uma avaliação presencial com um especialista em sono. O Protocolo te ajuda a cuidar da base, mas a avaliação vem primeiro.";
  var DISCLAIMER = "Esta é uma avaliação educativa do seu sono — não é um diagnóstico médico e não substitui consulta ou exame. Em caso de sintomas persistentes, procure um médico.";

  function calc(answers) {
    var raw = { desconexao:0, energia:0, rotina:0, alimentacao:0, atividade:0 };
    QUESTIONS.forEach(function (q) { raw[q.pilar] += answers[q.id] || 0; });
    var pilares = ORDER.map(function (k) { return { key:k, raw:raw[k], saude: Math.round((1 - raw[k]/8) * 100) }; });
    var rawGlobal = ORDER.reduce(function (s,k){ return s+raw[k]; }, 0);
    var indice = Math.round((1 - rawGlobal/40) * 100);
    var faixa = indice >= 80 ? "excelente" : indice >= 60 ? "bom" : indice >= 40 ? "atencao" : "critico";
    var critico = pilares.reduce(function (w,p){ return p.saude < w.saude ? p : w; }).key;
    return { indice: indice, faixa: faixa, pilares: pilares, critico: critico };
  }
  function band(s) { return s >= 67 ? "bom" : s >= 34 ? "atencao" : "critico"; }
  function hasApnea(a) { return (a.e1||0) >= 3 && (a.e2||0) >= 4; }
  function esc(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  // Radar SVG (5 eixos) — polígono de saúde por pilar
  function radar(pilares) {
    var size = 300, c = size/2, R = c - 46, n = 5;
    function pt(i, r) { var ang = -Math.PI/2 + i*2*Math.PI/n; return [c + r*Math.cos(ang), c + r*Math.sin(ang)]; }
    var svg = '<svg class="qr-radar" viewBox="0 0 '+size+' '+size+'" role="img" aria-label="Radar dos 5 pilares do sono">';
    // grelha
    for (var g=1; g<=4; g++){ var pts=[]; for(var i=0;i<n;i++){var p=pt(i, R*g/4); pts.push(p[0].toFixed(1)+","+p[1].toFixed(1));} svg += '<polygon points="'+pts.join(" ")+'" fill="none" stroke="#e4d8d4" stroke-width="1"/>'; }
    for (var i2=0;i2<n;i2++){ var e=pt(i2,R); svg += '<line x1="'+c+'" y1="'+c+'" x2="'+e[0].toFixed(1)+'" y2="'+e[1].toFixed(1)+'" stroke="#e4d8d4" stroke-width="1"/>'; }
    // dados
    var dp=[]; pilares.forEach(function(p,i){ var r=R*(p.saude/100); var q=pt(i,r); dp.push(q[0].toFixed(1)+","+q[1].toFixed(1)); });
    svg += '<polygon points="'+dp.join(" ")+'" fill="rgba(138,16,39,.22)" stroke="#8a1027" stroke-width="2"/>';
    pilares.forEach(function(p,i){ var r=R*(p.saude/100); var q=pt(i,r); svg += '<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="3.5" fill="#8a1027"/>'; });
    // rótulos
    pilares.forEach(function(p,i){ var l=pt(i,R+22); var anchor = Math.abs(l[0]-c)<10 ? "middle" : (l[0]>c ? "start":"end");
      svg += '<text x="'+l[0].toFixed(1)+'" y="'+(l[1]+4).toFixed(1)+'" text-anchor="'+anchor+'" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#515151">'+PILARES[p.key].curto+'</text>'; });
    svg += '</svg>';
    return svg;
  }

  var root = document.getElementById("quizRoot");
  if (!root) return;
  var answers = {}, sel = {}, idx = 0; // idx: 0..9 pergunta atual

  function renderIntro() {
    var chips = ORDER.map(function(k){ var m=PILARES[k]; return '<div class="qp"><b style="color:'+m.color+';border-color:'+m.color+'55;background:'+m.color+'1a">'+m.letra+'</b><span>'+m.curto+'</span></div>'; }).join("");
    root.innerHTML =
      '<div class="quizd"><div class="quizd-card" style="text-align:center">' +
        '<span class="quizd-eyebrow">Avaliação completa · Método DERAA</span>' +
        '<h1 style="font-family:var(--font-head);font-size:clamp(1.8rem,3.6vw,2.6rem);color:var(--ink);margin:20px 0 12px;line-height:1.12">Qual é a real saúde do seu sono?</h1>' +
        '<p style="color:var(--graphite);line-height:1.6;max-width:46ch;margin:0 auto">10 perguntas analisam os 5 pilares que mais impactam seu sono. No final, você recebe o <strong style="color:var(--ink)">retrato do seu sono</strong> com seu Índice de Sono e o pilar exato que está te sabotando.</p>' +
        '<div class="quizd-pillars">'+chips+'</div>' +
        '<p class="quizd-count" style="margin-bottom:16px">Leva 2 minutos · 100% gratuito</p>' +
        '<button class="btn btn-primary btn-lg btn-block" id="quizStart">Começar minha avaliação →</button>' +
      '</div></div>';
    document.getElementById("quizStart").addEventListener("click", function(){ idx=0; renderQuestion(); });
  }

  function renderQuestion() {
    var q = QUESTIONS[idx];
    var pct = (idx/QUESTIONS.length)*100;
    var opts = q.options.map(function(o,i){
      var isSel = sel[q.id] === i;
      return '<button class="q-opt'+(isSel?' sel':'')+'" data-i="'+i+'" data-score="'+o[1]+'"><span class="q-dot"></span>'+esc(o[0])+'</button>';
    }).join("");
    root.innerHTML =
      '<div class="quizd"><div class="quizd-card">' +
        '<div class="quizd-progress"><div class="quizd-progress-bar" style="width:'+pct+'%"></div></div>' +
        '<span class="quizd-count">Pergunta '+(idx+1)+' de '+QUESTIONS.length+'</span>' +
        '<h2 class="quizd-q">'+esc(q.label)+'</h2>' +
        '<div class="q-opts">'+opts+'</div>' +
        (idx>0 ? '<button class="quizd-back" id="quizBack">← Voltar</button>' : '') +
      '</div></div>';
    Array.prototype.forEach.call(root.querySelectorAll(".q-opt"), function(btn){
      btn.addEventListener("click", function(){
        sel[q.id] = parseInt(btn.getAttribute("data-i"),10);
        answers[q.id] = parseInt(btn.getAttribute("data-score"),10);
        Array.prototype.forEach.call(root.querySelectorAll(".q-opt"), function(b){ b.classList.remove("sel"); });
        btn.classList.add("sel");
        setTimeout(function(){
          if (idx < QUESTIONS.length - 1) { idx++; renderQuestion(); }
          else renderResult();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 240);
      });
    });
    var back = document.getElementById("quizBack");
    if (back) back.addEventListener("click", function(){ idx--; renderQuestion(); window.scrollTo({top:0,behavior:"smooth"}); });
  }

  function renderResult() {
    var r = calc(answers);
    var fx = FAIXAS[r.faixa];
    var crit = PILARES[r.critico];
    var bars = r.pilares.map(function(p){
      var m = PILARES[p.key];
      return '<div class="qr-bar"><div class="qr-bar__top"><span class="qr-bar__name">'+m.nome+'</span><span class="qr-bar__val">'+p.saude+'/100 · '+({bom:"bom",atencao:"atenção",critico:"crítico"}[band(p.saude)])+'</span></div>' +
        '<div class="qr-bar__track"><div class="qr-bar__fill" style="width:'+p.saude+'%;background:'+m.color+'"></div></div></div>';
    }).join("");
    var ronco = hasApnea(answers) ? '<div class="qr-warning"><strong>⚠️ Atenção:</strong> '+esc(RONCO_COPY)+'</div>' : '';
    root.innerHTML =
      '<div class="quizd" style="max-width:680px"><div class="quizd-card">' +
        '<div class="qr-head">' +
          '<p class="qr-scorelbl">Seu Índice de Sono</p>' +
          '<div class="qr-score">'+r.indice+'<small>/100</small></div>' +
          '<span class="qr-faixa" style="color:'+fx.color+';background:'+fx.color+'1a">'+fx.label+'</span>' +
          '<p class="qr-desc">'+esc(FAIXA_COPY[r.faixa])+'</p>' +
        '</div>' +
        radar(r.pilares) +
        '<div class="qr-bars">'+bars+'</div>' +
        '<div class="qr-block"><h3>Seu maior gargalo: '+crit.nome+'</h3><p>'+esc(GARGALO_COPY[r.critico])+'</p>' +
          '<div class="qr-acao"><strong>Primeiro passo:</strong> '+esc(crit.acao)+'</div></div>' +
        ronco +
        '<p class="qr-bridge">'+esc(BRIDGE_COPY)+'</p>' +
        '<div class="qr-cta">' +
          '<a class="btn btn-primary btn-lg" href="protocolo.html">Ver o Protocolo Reset do Sono →</a>' +
          '<p class="qr-sub">Feito por um médico do sono · não é remédio · você aplica em casa</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:16px">' +
            '<a class="btn btn-ghost" href="reset-7-noites.html">Começar pelo Reset em 7 Noites</a>' +
            (hasApnea(answers) ? '<a class="btn btn-ghost" href="https://wa.me/5547992474764" target="_blank" rel="noopener">Agendar avaliação presencial</a>' : '') +
          '</div>' +
        '</div>' +
        '<p class="qr-disc">'+esc(DISCLAIMER)+'</p>' +
        '<p style="text-align:center;margin-top:16px"><button class="quizd-back" id="quizRestart">↺ Refazer a avaliação</button></p>' +
      '</div></div>';
    var rs = document.getElementById("quizRestart");
    if (rs) rs.addEventListener("click", function(){ answers={}; sel={}; idx=0; renderIntro(); window.scrollTo({top:0,behavior:"smooth"}); });
  }

  renderIntro();
})();
