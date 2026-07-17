# Dr. Felipe Benthien — Site (Hub)

Site institucional e hub de projetos do Dr. Felipe Benthien — pneumologista,
medicina do sono e performance, em Jaraguá do Sul/SC.

Conceito: um **site central focado em exames** que funciona como porta de
entrada e distribui para os sub-projetos ("sites dentro do site").

## Estrutura

| Página | Arquivo | Função |
|---|---|---|
| Hub / Home | `index.html` | Autoridade + exames + ecossistema |
| Protocolo Reset do Sono (120 dias) | `protocolo.html` | Produto premium |
| Curso Reset do Sono | `curso.html` | Produto digital (Hotmart) |
| Comunidade Reset do Sono | `comunidade.html` | Comunidade |
| Quiz de Diagnóstico do Sono | `quiz.html` | Triagem / captação |

- `css/styles.css` — design system completo (paleta bordô #8A1027 / grafite #515151 / branco)
- `js/main.js` — nav, scroll-reveal, contadores, FAQ, modais, quiz multi-etapas, exit-intent

## Recursos de interação
- Navbar fixa com dropdown "Programas" e menu mobile
- Scroll reveal + contadores animados
- Modal de agendamento (WhatsApp), quiz interativo com resultado, popup de captação (exit-intent)
- Botão flutuante de WhatsApp
- FAQ em acordeão

## ⚠️ Placeholders a substituir antes do go-live
1. **Número de WhatsApp**: hoje está `5547999999999` em todos os links `wa.me`.
   Buscar/substituir por o número real.
2. **Links de compra do curso** (`curso.html`): `href="#"` nos botões → URL da Hotmart.
3. **Fotos**: os blocos com `.media-note` ("Foto do Dr...", "Mapa...") marcam onde
   entram imagens reais (retrato do doutor, consultório, lifestyle, Google Maps embed).
4. **Redes sociais** (footer): `href="#"` → Instagram / YouTube reais.
5. **Números do hero** (`data-count`): 12 anos, 4000+ pacientes, 4.9★ — ajustar aos reais.
6. **Blog**: os 3 posts são exemplos; conectar ao blog real quando existir.

## Publicação
Site 100% estático — pode subir direto no Netlify (arrastar a pasta) ou
qualquer hospedagem. Sem build step.
