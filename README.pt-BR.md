# discord-message-transcript

🌍 Leia este documento em:
- 🇺🇸 [English](README.md)

Uma biblioteca modular para exportar mensagens do Discord em **JSON** ou **HTML**, com fidelidade visual e suporte para arquivamento de longo prazo.

---

## 📖 Índice

- [discord-message-transcript](#discord-message-transcript)
  - [📖 Índice](#-índice)
  - [📦 Estrutura do Projeto](#-estrutura-do-projeto)
    - [`discord-message-transcript` (pacote principal)](#discord-message-transcript-pacote-principal)
    - [`discord-message-transcript-base` (apenas renderização)](#discord-message-transcript-base-apenas-renderização)
  - [✨ Funcionalidades](#-funcionalidades)
  - [🧩 Conteúdo Suportado](#-conteúdo-suportado)
  - [🔦 Realce de Sintaxe](#-realce-de-sintaxe)
  - [🖼️ Imagens](#️-imagens)
  - [🔢 Controle e Limpeza de Mensagens](#-controle-e-limpeza-de-mensagens)
  - [🧪 Uso e API](#-uso-e-api)
    - [Instalação](#instalação)
    - [Funções](#funções)
      - [`createTranscript(channel, options)`](#createtranscriptchannel-options)
      - [`renderHTMLFromJSON(jsonString, options)`](#renderhtmlfromjsonjsonstring-options)
  - [🔐 Permissões e Acesso](#-permissões-e-acesso)
  - [⚠️ Aviso Legal, Políticas do Discord e Responsabilidade do Usuário](#️-aviso-legal-políticas-do-discord-e-responsabilidade-do-usuário)
    - [Aviso Importante](#aviso-importante)
    - [Responsabilidade e Conformidade](#responsabilidade-e-conformidade)
  - [🛡️ Privacidade e Tratamento de Dados](#️-privacidade-e-tratamento-de-dados)
  - [📜 Licença](#-licença)
  - [💬 Suporte, Contato e Contribuições](#-suporte-contato-e-contribuições)
    - [Suporte e Dúvidas](#suporte-e-dúvidas)
    - [Solicitação de Funcionalidades](#solicitação-de-funcionalidades)
    - [Contribuições](#contribuições)

---

## 📦 Estrutura do Projeto

Este repositório é um **monorepo gerenciado com pnpm**, contendo dois pacotes npm:

### `discord-message-transcript` (pacote principal)

- Depende de `discord.js`
- Utiliza `discord-message-transcript-base`
- Busca mensagens diretamente de canais do Discord
- Converte mensagens em um **transcript estruturado em JSON**
- Pode exportar transcripts como:
  - **JSON**
  - **HTML**
- Indicado para:
  - Bots
  - Sistemas de ticket
  - Logs de moderação
  - Backup de mensagem dos canais

---

### `discord-message-transcript-base` (apenas renderização)

- ❌ Não depende de `discord.js`
- Converte transcript **JSON → HTML**
- Projetado para ambientes sem acesso ao Discord:
  - Websites
  - Aplicações frontend
  - Hospedagem estática
- Ideal para armazenar arquivos `.json` leves e renderizá-los posteriormente

Essa separação mantém a coleta de dados do Discord e a renderização totalmente desacopladas.

---

## ✨ Funcionalidades

- Renderização com visual semelhante ao Discord
- Saída HTML em arquivo único (HTML + CSS + JS)
- Formato intermediário em JSON leve
- Opções de exportação altamente configuráveis
- Incorporação opcional de imagens para arquivamento de longo prazo
- Suporte a Markdown com realce de sintaxe
- Nenhum serviço externo ou armazenamento remoto
- Nenhum rastreamento, telemetria ou analytics

---

## 🧩 Conteúdo Suportado

Os transcripts podem incluir:

- Markdown do Discord (negrito, itálico, sublinhado, títulos, citações, blocos de código, etc.)
- Embeds
- Componentes v1
- Componentes v2
- Enquetes (polls)
- Anexos
- Reações

---

## 🔦 Realce de Sintaxe

O HTML gerado utiliza **[highlight.js](https://highlightjs.org/)** para fornecer realce de sintaxe em blocos de código.

- Este é o **único recurso externo** utilizado
- Incluído via CDN no HTML gerado
- Carregado **apenas no momento da renderização**
- Não é necessário para a geração do JSON
- O realce de sintaxe é realizado **inteiramente no lado do cliente (client-side)**

---

## 🖼️ Imagens

Por padrão, os transcripts utilizam URLs da CDN do Discord para imagens.

Quando a incorporação de imagens está habilitada:
- As imagens são incorporadas em Base64
- O tamanho do arquivo final aumenta
- As imagens no transcript permanecem disponíveis mesmo que os links da CDN do Discord expirem

Quando a incorporação de imagens **não** está habilitada:
- O transcript continuará funcionando normalmente
- As imagens serão carregadas a partir de suas URLs originais da CDN do Discord
- Funcionalidades relacionadas a imagens podem deixar de funcionar caso esses links expirem

Essa opção é útil para arquivamento de longo prazo e auditorias.

---

## 🔢 Controle e Limpeza de Mensagens

- A quantidade de mensagens exportadas pode ser personalizada
- Mensagens vazias podem ser removidas automaticamente:
  - Mensagens que ficam vazias após filtragem de conteúdo
  - Mensagens com elementos removidos ou não suportados

Isso garante transcripts mais limpos e legíveis.

---

## 🧪 Uso e API

Este projeto fornece dois pacotes: `discord-message-transcript` e `discord-message-transcript-base`.

### Instalação

```bash
# Para o pacote principal (requer discord.js)
npm install discord-message-transcript
yarn add discord-message-transcript
pnpm add discord-message-transcript

# Para o pacote base (apenas renderizador)
npm install discord-message-transcript-base
yarn add discord-message-transcript-base
pnpm add discord-message-transcript-base
```

### Funções

#### `createTranscript(channel, options)`

Busca mensagens de um canal do Discord e gera um transcript. Esta função está disponível apenas no pacote `discord-message-transcript`.

-   **`channel`**: O canal do Discord para buscar as mensagens.
-   **`options`**: Um objeto com as seguintes propriedades:
    -   `fileName`: O nome do arquivo a ser gerado. (Padrão: `Transcript-{nome-do-canal}-{id-do-canal}`)
    -   `includeAttachments`: Se deve incluir anexos de mensagens. (Padrão: `true`)
    -   `includeButtons`: Se deve incluir botões de mensagens. (Padrão: `true`)
    -   `includeComponents`: Se deve incluir componentes de mensagens. (Padrão: `true`)
    -   `includeEmpty`: Se deve incluir mensagens vazias. (Padrão: `false`)
    -   `includeEmbeds`: Se deve incluir embeds de mensagens. (Padrão: `true`)
    -   `includePolls`: Se deve incluir enquetes de mensagens. (Padrão: `true`)
    -   `includeReactions`: Se deve incluir reações de mensagens. (Padrão: `true`)
    -   `includeV2Components`: Se deve incluir componentes de mensagens V2. (Padrão: `true`)
    -   `localDate`: A localidade a ser usada para datas. (Padrão: `'en-GB'`)
    -   `quantity`: A quantidade máxima de mensagens a serem buscadas. (Padrão: `0` - todas as mensagens)
    -   `returnFormat`: O formato do transcript.
        -   `ReturnFormat.HTML`: (Padrão) Retorna um transcript em HTML.
        -   `ReturnFormat.JSON`: Retorna um transcript em JSON.
    -   `returnType`: O formato de retorno do transcript.
        -   `ReturnType.Attachment`: (Padrão) Retorna um objeto `AttachmentBuilder`.
        -   `ReturnType.String`: Retorna uma string.
        -   `ReturnType.Buffer`: Retorna um `Buffer`.
        -   `ReturnType.Stream`: Retorna um `Stream`.
        -   `ReturnType.Uploadable`: Retorna um objeto `Uploadable`.
    -   `saveImages`: Se deve salvar imagens localmente. (Padrão: `false`)
    -   `selfContained`: Se deve incluir todos os ativos em um único arquivo. (Padrão: `false`)
    -   `timeZone`: O fuso horário a ser usado para datas. (Padrão: `'UTC'`)

#### `renderHTMLFromJSON(jsonString, options)`

Converte uma string de transcript JSON em um transcript HTML. Esta função está disponível em ambos os pacotes.

-   **`jsonString`**: A string do transcript JSON.
-   **`options`**: Um objeto com as seguintes propriedades:
    -   `returnType`: O formato de retorno do transcript.
        -   **`discord-message-transcript`**:
            -   `ReturnType.Attachment`: (Padrão) Retorna um objeto `AttachmentBuilder`.
            -   `ReturnType.String`: Retorna uma string.
            -   `ReturnType.Buffer`: Retorna um `Buffer`.
            -   `ReturnType.Stream`: Retorna um `Stream`.
            -   `ReturnType.Uploadable`: Retorna um objeto `Uploadable`.
        -   **`discord-message-transcript-base`**:
            -   `ReturnType.String`: (Padrão) Retorna uma string.
            -   `ReturnType.Buffer`: Retorna um `Buffer`.
            -   `ReturnType.Stream`: Retorna um `Stream`.
            -   `ReturnType.Uploadable`: Retorna um objeto `Uploadable`.
    -   `selfContained`: Se deve incluir todos os ativos em um único arquivo. (Padrão: `false`)

---

## 🔐 Permissões e Acesso

- O bot precisa estar logado
- Nenhuma intent privilegiada de gateway é necessária
- Intents obrigatórias por contexto:
  - **Mensagens Diretas (DMs / DMs em grupo):**
    - `DirectMessages`
  - **Canais de servidores (Guilds):**
    - `Guilds`
    - `GuildMessages`
- Canais suportados:
  - Canais de texto de servidores
  - Threads
  - Mensagens privadas
  - DMs em grupo

As mensagens são acessadas **apenas** em canais onde o bot está explicitamente autorizado e possui as permissões:
- `ViewChannel`
- `ReadMessageHistory`

---

## ⚠️ Aviso Legal, Políticas do Discord e Responsabilidade do Usuário

Este projeto **não é afiliado, endossado ou mantido pela Discord Inc.**

Discord é uma marca registrada da Discord Inc.

A aparência visual dos transcripts gerados é **implementada de forma independente** e **inspirada na interface do Discord**, com o objetivo de fornecer familiaridade e legibilidade.

Esta biblioteca acessa dados de mensagens **exclusivamente por meio da API oficial do Discord**, e apenas em servidores e canais onde o bot possui permissão explícita para leitura de mensagens.

### Aviso Importante

- Esta biblioteca **não redistribui, publica ou compartilha conteúdo automaticamente**
- Todos os transcripts são gerados **apenas mediante solicitação explícita do usuário**
- O conteúdo exportado é obtido **somente de canais onde o bot possui permissão para leitura do histórico**
- Qualquer armazenamento, compartilhamento, publicação ou redistribuição dos transcripts gerados é **inteiramente de responsabilidade do usuário**

### Responsabilidade e Conformidade

Apesar de este projeto ser desenvolvido para operar com a API oficial do Discord e respeitar suas regras publicadas, **não há garantia de que todos os casos de uso estejam em conformidade com as políticas da plataforma**.

Ao utilizar este projeto, você concorda que é responsável por garantir conformidade com:

1. **Discord Developer Policy**  
   https://support-dev.discord.com/hc/en-us/articles/8563934450327-Discord-Developer-Policy

2. **Discord Developer Terms of Service**  
   https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service

3. **Discord Privacy Policy**  
   https://discord.com/privacy

4. Leis e regulamentações locais aplicáveis  
5. Regras específicas de servidores e requisitos de consentimento, quando aplicável

Os mantenedores deste projeto **não se responsabilizam** pela forma como os transcripts gerados são armazenados, compartilhados, publicados ou utilizados.

---

## 🛡️ Privacidade e Tratamento de Dados

- Nenhum dado é armazenado remotamente por este projeto
- Nenhum dado é transmitido a terceiros
- Nenhum scraping fora da API do Discord
- Nenhum rastreamento ou analytics de usuários

Todos os transcripts gerados ficam exclusivamente sob controle do usuário final.

---

## 📜 Licença

Licenciado sob a **Apache License 2.0**.  
Veja o arquivo `LICENSE` para mais informações.

---

## 💬 Suporte, Contato e Contribuições

Se você precisar de ajuda, tiver dúvidas ou quiser relatar um problema, há algumas opções:

### Suporte e Dúvidas
- Abra uma **Issue no GitHub** para:
  - Relatar bugs
  - Tirar dúvidas de uso
  - Esclarecer comportamentos ou limitações
- Você também pode entrar em contato diretamente pelo **Discord** para suporte e discussões:  
  👉 **Discord:** https://discord.gg/4ACFdtRQMy

### Solicitação de Funcionalidades
- Ideias e sugestões de melhorias são bem-vindas
- Envie via **Issues do GitHub** ou discuta no Discord
- Todas as solicitações serão avaliadas conforme escopo, viabilidade e objetivos do projeto

### Contribuições
No momento, este projeto **não está aberto para contribuições externas de código**.

Isso ajuda a garantir:
- Arquitetura consistente
- APIs públicas estáveis
- Comportamento previsível

Ainda assim, feedback, ideias e sugestões são sempre bem-vindos e apreciados.

---

Obrigado pelo interesse neste projeto e por respeitar sua direção de desenvolvimento.