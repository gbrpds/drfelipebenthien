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

## Recursos de interação (design system 2.0)
- **Lenis** (smooth scroll) — carregado via CDN unpkg
- **Grifo animado** — highlight bordô que se desenha no scroll nas palavras-chave
- **Mega-menu** "Programas" (3 colunas) + dropdown + menu mobile
- **Hero** com foto de fundo (duotone), palavra rotativa, anti-flash e cards de credencial
- **Marquee** infinito de serviços
- **Exames por intenção** — seção sticky scroll-driven (Ronco/Cansaço/CPAP/Performance) com carrossel
- **Chat de objeções** — mensagens surgem com "digitando…" e fundo animado
- **Depoimentos** em mural duplo (duas fileiras em direções opostas)
- **Story slideshow** na seção Sobre (estilo Instagram)
- **Diferenciais** em acordeão com imagem sticky
- **Progressive blur** no topo/base da viewport
- Scroll reveal + contadores, modais (agendamento/quiz/lead exit-intent), FAQ acordeão, WhatsApp flutuante

## Tipografia & paleta
- Fontes: **Host Grotesk** (display) · **DM Sans** (texto) · **Fraunces** (itálico serifado dos destaques)
- Fundo off-white quente + bordô #8A1027 / grafite #515151

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
