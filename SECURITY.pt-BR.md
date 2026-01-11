# Política de Segurança

## Visão Geral

Este projeto é uma ferramenta baseada em API e processamento local para exportação e renderização de mensagens do Discord.
Ele **não fornece hospedagem, armazenamento de dados ou processamento remoto** de conteúdo.

O objetivo do projeto é transformar mensagens acessíveis via API oficial do Discord em formatos de transcript (JSON e HTML), mantendo controle total nas mãos do usuário final.

---

## Versões Suportadas

Apenas a **versão mais recente publicada** deste projeto recebe correções e atualizações de segurança.

Versões antigas não são mantidas ativamente.

---

## Reportando uma Vulnerabilidade

Se você identificar uma possível vulnerabilidade de segurança, **não abra uma issue pública**.

Por favor, reporte de forma privada por um dos canais abaixo:

- **GitHub Security Advisories**
- Contato direto pelo **servidor oficial do Discord**

Faremos o possível para analisar e responder aos relatos dentro de um prazo razoável.

---

## O Que É Considerado um Problema de Segurança

Os itens abaixo **podem ser considerados vulnerabilidades de segurança**, dependendo do impacto e contexto:

- Execução remota de código (RCE)
- Leitura ou escrita arbitrária de arquivos
- Acesso não autorizado a mensagens ou canais do Discord
- Vazamento de dados além dos transcripts explicitamente solicitados
- Vulnerabilidades de **Cross-Site Scripting (XSS)** no HTML gerado
- Bypass de permissões ou controles de acesso do Discord

---

## O Que NÃO É Considerado um Problema de Segurança

Os itens abaixo **não são considerados vulnerabilidades de segurança**:

- Uso indevido ou inadequado dos transcripts gerados pelo usuário
- Compartilhamento ou publicação de conteúdo exportado por decisão do usuário final
- Configuração incorreta de permissões do bot no Discord
- Uso de CDNs públicas (como highlight.js) para renderização client-side
- Riscos de segurança causados pela abertura do HTML gerado em ambientes não confiáveis
- Conteúdo fornecido pelo próprio Discord (mensagens, embeds, anexos, etc.)

---

## Escopo e Limitações

- Este projeto **não opera servidores ou serviços remotos**
- Nenhum dado é coletado, armazenado ou processado pelos mantenedores
- Todo acesso a dados do Discord ocorre **exclusivamente via API oficial**
- A renderização de transcripts ocorre **localmente**, no ambiente do usuário
- A segurança do ambiente final (browser, sistema operacional, hospedagem) é responsabilidade do usuário

---

## Divulgação Responsável

Este projeto segue práticas de **divulgação responsável**.

Pedimos que seja concedido um tempo razoável para investigação e correção antes de qualquer divulgação pública de vulnerabilidades reportadas.
