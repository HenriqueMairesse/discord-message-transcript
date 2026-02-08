# Política de Segurança

## Visão Geral

Este projeto gera transcrições em HTML a partir de mensagens do Discord e pode, opcionalmente, encaminhar URLs de assets externos (imagens, vídeos, áudios ou qualquer outro tipo de arquivo) para uma CDN configurada pelo usuário antes de gerar o HTML final.

Por padrão, os assets não são baixados por esta biblioteca. Quando recursos de CDN estão habilitados, as URLs são encaminhadas diretamente ao provedor configurado (por exemplo, Cloudinary ou Uploadcare), que realiza o download de forma independente.

Manipuladores de CDN personalizados podem implementar sua própria lógica de download, que é totalmente controlada pelo usuário final.

Este projeto não fornece hospedagem, armazenamento persistente de dados ou qualquer infraestrutura de processamento remoto operada pelos mantenedores. Todo o processamento ocorre no ambiente onde a biblioteca é executada.

---

## Versões Suportadas

Apenas a **versão mais recente publicada** deste projeto recebe correções e atualizações de segurança.

Versões antigas não são mantidas ativamente.

---

## Comportamento de Segurança Padrão

Por padrão, esta biblioteca aplica múltiplas verificações de segurança ao gerar transcrições em HTML, incluindo a sanitização do conteúdo das mensagens e a validação de URLs de assets externos.

Essas proteções são ativadas por meio do `safeMode` (habilitado por padrão).

Desativar o `safeMode` ignora as verificações de segurança de URLs e pode permitir que conteúdo externo potencialmente inseguro seja incorporado às transcrições HTML geradas.

O conteúdo de texto é sempre escapado e não pode ser desativado.

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
- Falsificação de requisição no lado do servidor (SSRF) ao baixar assets externos

---

## O Que NÃO É Considerado um Problema de Segurança

Os itens abaixo **não são considerados vulnerabilidades de segurança**:

- Uso indevido ou inadequado dos transcripts gerados pelo usuário
- Compartilhamento ou publicação de conteúdo exportado por decisão do usuário final
- Configuração incorreta de permissões do bot no Discord
- Uso de CDNs públicas (como highlight.js) para renderização client-side
- Riscos de segurança causados pela abertura do HTML gerado em ambientes não confiáveis
- Uso de CDNs de terceiros para renderização no lado do cliente
- Problemas de segurança causados por desativar explicitamente os mecanismos de segurança integrados (ex.: safeMode: false)
- Riscos introduzidos pela modificação manual do HTML gerado
- Abertura das transcrições em ambientes que desativam intencionalmente as proteções de segurança do navegador

---

## Escopo e Limitações

- Este projeto **não opera servidores ou serviços remotos**
- Nenhum dado é coletado, armazenado ou processado por infraestrutura operada pelos mantenedores
- Todo acesso a dados do Discord ocorre **exclusivamente via API oficial**
- A renderização de transcripts ocorre **localmente**, no ambiente do usuário
- A segurança do ambiente onde a transcrição é aberta ou hospedada (navegador, sistema operacional, servidor web ou infraestrutura de terceiros) é responsabilidade do usuário final.

---

## Divulgação Responsável

Este projeto segue práticas de **divulgação responsável**.

Pedimos que seja concedido um tempo razoável para investigação e correção antes de qualquer divulgação pública de vulnerabilidades reportadas.
