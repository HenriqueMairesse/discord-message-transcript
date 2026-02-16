<div align="center">
  <a href="https://discord.gg/4ACFdtRQMy"><img alt="Discord Server" src="https://img.shields.io/discord/1338602296665182221?style=plastic&logo=discord&logoColor=white&label=Discord&labelColor=5865F2"></a>
  <a href="https://www.npmjs.com/package/discord-message-transcript"><img alt="NPM Version" src="https://img.shields.io/npm/v/discord-message-transcript?registry_uri=https%3A%2F%2Fregistry.npmjs.org%2F&style=plastic&color=orange"></a>
  <a href="https://www.npmjs.com/package/discord-message-transcript"><img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/discord-message-transcript?style=plastic&label=Downloads"></a>
</div>

# discord-message-transcript

<p align="center">
  <video src="assets/discord-message-transcript_demo.mp4" autoplay loop muted width="720"></video>
</p>

🌍 Leia este documento em:
- 🇺🇸 [English](README.md)

Uma biblioteca modular para exportar mensagens do Discord em **JSON** ou **HTML**, com fidelidade visual e suporte para arquivamento de longo prazo.

---

## 📖 Índice
> Clique em qualquer seção para ir diretamente para ela.

- [discord-message-transcript](#discord-message-transcript)
  - [📖 Índice](#-índice)
  - [📦 Estrutura do Projeto](#-estrutura-do-projeto)
    - [`discord-message-transcript` (pacote principal)](#discord-message-transcript-pacote-principal)
    - [`discord-message-transcript-base` (apenas renderização)](#discord-message-transcript-base-apenas-renderização)
  - [✨ Funcionalidades](#-funcionalidades)
  - [🔒 Segurança](#-segurança)
  - [🧩 Conteúdo Suportado](#-conteúdo-suportado)
  - [🔦 Realce de Sintaxe](#-realce-de-sintaxe)
  - [🖼️ Arquivos e Arquivamento de Longo Prazo](#️-arquivos-e-arquivamento-de-longo-prazo)
    - [`saveImages`](#saveimages)
    - [`cdnOptions`](#cdnoptions)
  - [🔢 Controle e Limpeza de Mensagens](#-controle-e-limpeza-de-mensagens)
  - [🧪 Uso e API](#-uso-e-api)
    - [Instalação](#instalação)
    - [Funções](#funções)
      - [`createTranscript(channel, options)`](#createtranscriptchannel-options)
      - [`renderHTMLFromJSON(jsonString, options)`](#renderhtmlfromjsonjsonstring-options)
  - [⚙️ Performance e Processamento Paralelo (Avançado)](#️-performance-e-processamento-paralelo-avançado)
  - [🔐 Permissões e Acesso](#-permissões-e-acesso)
  - [⚠️ Aviso Legal, Políticas do Discord e Responsabilidade do Usuário](#️-aviso-legal-políticas-do-discord-e-responsabilidade-do-usuário)
    - [Aviso Importante](#aviso-importante)
    - [Responsabilidade e Conformidade do Usuário](#responsabilidade-e-conformidade-do-usuário)
  - [🛡️ Privacidade e Tratamento de Dados](#️-privacidade-e-tratamento-de-dados)
  - [📜 Licença](#-licença)
  - [💬 Suporte, Contato e Contribuições](#-suporte-contato-e-contribuições)
    - [Suporte e Dúvidas](#suporte-e-dúvidas)
    - [Solicitação de Funcionalidades](#solicitação-de-funcionalidades)
    - [Contribuições](#contribuições)


## 📦 Estrutura do Projeto

Este repositório é um **monorepo pnpm** contendo dois pacotes npm:

### `discord-message-transcript` (pacote principal)

- Depende de `discord.js`
- Utiliza `discord-message-transcript-base`
- Busca mensagens diretamente dos canais do Discord
- Converte mensagens em um **transcript estruturado em JSON**
- Pode exportar transcripts como:
  - **JSON**
  - **HTML**
- Indicado para:
  - Bots
  - Sistemas de ticket
  - Logs de moderação
  - Backups de canais

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

- Renderização com visual semelhante ao do Discord
- Saída HTML em arquivo único (HTML + CSS + JS)
- Formato intermediário leve em JSON
- Opções de exportação totalmente personalizáveis
- Incorporação de imagens ou upload para CDN para armazenamento de longo prazo
- Renderização de Markdown com realce de sintaxe
- Sem serviços externos
- Sem rastreamento, telemetria ou analytics

---

## 🔒 Segurança

Esta biblioteca gera transcript em HTML que podem ser abertas em um navegador.
Para prevenir XSS e injeção de conteúdo malicioso, URLs e assets são sanitizados por padrão.

**`safeMode` vem ativado por padrão.**

Quando ativado, a biblioteca irá:
- Sanitizar URLs de imagens
- Bloquear protocolos inseguros (data:, file:)
- Restringir imagens SVG externas
- Resolver attachment:// de forma segura
- Aplicar proteções ao baixar assets para base64 ou processamento em CDN
- Escapar todo o texto das mensagens

Desativar o safeMode — **NÃO RECOMENDADO**
```
createTranscript(channel, {
  safeMode: false
})
```

Desativar o `safeMode` ignora as verificações de segurança de URLs e permite que qualquer URL externa de imagem seja embutida ou encaminhada para CDNs configuradas.

⚠️ Desative apenas se você confiar totalmente na origem das mensagens.
⚠️ O texto das mensagens é sempre escapado e não pode ser desativado.
⚠️ Desativar pode introduzir riscos de XSS e SSRF.

Para mais detalhes, consulte SECURITY.pt-BR.md.

## 🧩 Conteúdo Suportado

Os transcripts podem incluir:

- Markdown do Discord (negrito, itálico, sublinhado, títulos, citações, blocos de código, etc.)
- Embeds
- Componentes v1
- Componentes v2
- Enquetes (Polls)
- Anexos
- Reações

---

## 🔦 Realce de Sintaxe

O HTML gerado usa **[highlight.js](https://highlightjs.org/)** para fornecer realce de sintaxe para blocos de código.

- Este é o **único recurso externo** utilizado
- Incluído via um link de CDN no HTML gerado
- Carregado **apenas no momento da renderização**
- Não é necessário para a geração do JSON
- O realce de sintaxe é realizado **inteiramente no lado do cliente (client-side)**

---

## 🖼️ Arquivos e Arquivamento de Longo Prazo

Por padrão, os transcripts referenciam URLs da CDN do Discord para assets como imagens, avatares e anexos. Esses URLs podem expirar com o tempo, fazendo com que os assets quebrem. Para garantir o arquivamento de longo prazo, a biblioteca oferece duas soluções: `saveImages` e `cdnOptions`.

### `saveImages`
Quando `saveImages: true`, todas as imagens (exceto GIFs) são baixadas e incorporadas diretamente no arquivo HTML como dados Base64.
- ✅ **Prós:** Garante que as imagens sempre carregarão, totalmente autocontido.
- ❌ **Contras:** Aumenta significativamente o tamanho do arquivo final.

### `cdnOptions`
Isso permite que você envie automaticamente todos os assets (imagens, vídeos, áudio, etc.) para sua própria Rede de Distribuição de Conteúdo (CDN), substituindo as URLs do Discord pelas suas.
- ✅ **Prós:** Garante disponibilidade a longo prazo sem inflar o tamanho do arquivo. A solução mais robusta para arquivamento.
- ❌ **Contras:** Requer a configuração de um serviço de CDN de terceiros.

Se nenhuma das opções for usada, os transcripts ainda funcionarão corretamente, mas dependerão das URLs originais do Discord, que podem não ser adequadas para armazenamento permanente.

OBS: Quando `cdnOptions` está definido, `saveImages` será ignorado!

---

## 🔢 Controle e Limpeza de Mensagens

- O número de mensagens exportadas pode ser personalizado com a opção `quantity`.
- Mensagens vazias podem ser removidas automaticamente definindo `includeEmpty: false` (Padrão). Isso remove:
  - Mensagens que se tornam vazias após a filtragem de conteúdo (por exemplo, removendo anexos).
  - Mensagens com elementos não suportados ou removidos.

Isso garante transcripts limpos e legíveis.

---

## 🧪 Uso e API

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

Busca mensagens de um canal do Discord e gera um transcript. Esta é a função principal do pacote.

-   **`channel`**: O canal do Discord de onde buscar as mensagens.
-   **`options`**: Um objeto para personalizar a geração do transcript. Todas as propriedades são opcionais.

**Exemplo Básico:**
```javascript
const { createTranscript } = require('discord-message-transcript');

const channel = // seu objeto de canal do discord.js
const attachment = await createTranscript(channel);

channel.send({
    files: [attachment],
});
```

**Referência de Opções:**

- `disableWarnings`: Desativa todos os avisos para manter o console limpo. **Atenção**: Vai esconder problemas como URLs inseguras ou uso de fallbacks. (Default: `false`)
- `fileName`: O nome do arquivo a ser gerado. (Padrão: `Transcript-{nome-do-canal}-{id-do-canal}`)
- `quantity`: O número máximo de mensagens a serem buscadas. (Padrão: `0` - todas as mensagens)
- `returnFormat`: O formato do transcript (`ReturnFormat.HTML` ou `ReturnFormat.JSON`). (Padrão: `ReturnFormat.HTML`)
- `returnType`: O formato para retornar o transcript (`ReturnType.Attachment`, `String`, `Buffer`, etc.). (Padrão: `Attachment`)
- `safeMode`: Ativa o modo seguro, bloqueando URLs, images ou HTML potêncialmente inseguros de serem incluídos no transcript. **Atenção**: desabilitar pode permitir conteúdo inseguro aparecer. (Padrão: true)
- `saveImages`: Se deve incorporar imagens como Base64. (Padrão: `false`)
- `selfContained`: Se deve incluir todos os assets (CSS, JS) em um único arquivo HTML. (Padrão: `false`)
- `watermark`: Se deve incluir a marca d'água "Transcript generated by...". (Padrão: `true`)
- `localDate` / `timeZone`: Para formatação de data e hora.
- `include...`: Um conjunto de flags booleanas (`includeAttachments`, `includeEmbeds`, etc.) para controlar quais elementos da mensagem são incluídos. (Padrão: `true` para todos)
- `cdnOptions`: Um objeto para configurar uploads para CDN. Veja abaixo para mais detalhes.

---

**Exemplos de `cdnOptions`**

O objeto `cdnOptions` permite que você envie automaticamente assets para uma CDN.

**Propriedades Comuns:**
Esses booleanos controlam quais tipos de arquivo são enviados. Se omitidos, o padrão é `true`.
- `includeImage`: Envia imagens padrão (PNG, JPEG, WEBP).
- `includeVideo`: Envia vídeos e GIFs.
- `includeAudio`: Envia arquivos de áudio.
- `includeOthers`: Envia qualquer outro tipo de arquivo.

**Provedor: Cloudinary**
```javascript
const options = {
    cdnOptions: {
        provider: 'CLOUDINARY',
        includeImage: true,
        cloudName: 'your-cloud-name',
        apiKey: 'your-api-key',
        apiSecret: 'your-api-secret',
    }
};
```

**Provedor: Uploadcare**
```javascript
const options = {
    cdnOptions: {
        provider: 'UPLOADCARE',
        includeImage: true,
        includeVideo: true,
        publicKey: 'your-public-key',
        cdnDomain: 'your.cdnDomain.net'
    }
};
```

**Provedor: Custom (Personalizado)**
Você pode fornecer sua própria função de upload assíncrona.
```javascript
// Sua função de upload personalizada
async function myUploader(url, contentType, customData) {
    console.log(`Enviando ${url} do tipo ${contentType}`);
    console.log(`Dados personalizados recebidos: ${customData.welcomeWorld}`);

    // ... sua lógica de upload aqui ...
    const newUrl = `https://my.cdn.com/path/to/new/asset`;

    return newUrl;
}

const options = {
    cdnOptions: {
        provider: 'CUSTOM',
        includeImage: true,
        resolver: myUploader,
        customData: { welcomeWorld: 'Hi!' } // Opcional: passe qualquer dado para o seu resolver
    }
};
```

---

#### `renderHTMLFromJSON(jsonString, options)`

Converte uma string de transcript JSON em um transcript HTML. Esta função está disponível em ambos os pacotes, `discord-message-transcript` e o mais leve `discord-message-transcript-base`.

-   **`jsonString`**: A string do transcript JSON.
-   **`options`**: Um objeto para personalizar a renderização (`returnType`, `selfContained`, `watermark`).

---

## ⚙️ Performance e Processamento Paralelo (Avançado)

Para gerar transcripts rapidamente, esta biblioteca realiza operações de rede intensivas em paralelo. Isso inclui:
- Enviar assets para uma CDN.
- Baixar imagens para converter para Base64 (`saveImages`).

Por padrão, a biblioteca realizará até **12 operações de CDN** e **6 conversões para Base64** simultaneamente. Embora isso seja rápido, pode ser intensivo em recursos. Você pode controlar esse comportamento para reduzir a carga na rede/CPU ou para evitar rate limits.

**Como Controlar a Concorrência:**

Importe e chame `setCDNConcurrency` ou `setBase64Concurrency` no início da sua aplicação.

```javascript
import { createTranscript, setCDNConcurrency, setBase64Concurrency } from 'discord-message-transcript';

// Define o número máximo de uploads concorrentes para a CDN como 5
setCDNConcurrency(5);

// Define o número máximo de conversões concorrentes para Base64 como 3
setBase64Concurrency(3);

// Agora, quando você chamar createTranscript, ele respeitará esses limites.
async function generate(channel) {
    const transcript = await createTranscript(channel, {
        saveImages: true,
        // ... outras opções
    });

    // ...
}
```

---

## 🔐 Permissões e Acesso

- O bot deve estar logado.
- Nenhuma intent privilegiada é necessária.
- **Intents Obrigatórias por Contexto:**
  - Mensagens Diretas (DMs / DMs em Grupo): `DirectMessages`
  - Canais de Servidor: `Guilds`, `GuildMessages`

- Canais suportados:
  - Canais de texto de servidor
  - Threads
  - Mensagens privadas
  - DMs em grupo

As mensagens são acessadas **somente** de canais onde:
- O bot tem acesso explícito, como em Mensagens Diretas ou DMs em Grupo das quais participa.
- O bot tem permissão para:
  - `ViewChannel`
  - `ReadMessageHistory`

---

## ⚠️ Aviso Legal, Políticas do Discord e Responsabilidade do Usuário

Este projeto **não é afiliado, endossado ou mantido pela Discord Inc.** Discord é uma marca registrada da Discord Inc.

A aparência visual dos transcripts gerados é **implementada de forma independente** e **inspirada na interface de usuário do Discord**, com o objetivo de fornecer familiaridade e legibilidade.

Esta biblioteca acessa dados de mensagens **exclusivamente através da API oficial do Discord**.

### Aviso Importante

- Esta biblioteca **não redistribui, publica ou compartilha** qualquer conteúdo automaticamente.
- Todos os transcripts são gerados **apenas a pedido explícito do usuário**.
- O conteúdo das mensagens exportadas é obtido **somente de canais onde o bot tem permissão para ler o histórico de mensagens**.
- Qualquer armazenamento, compartilhamento, publicação ou redistribuição dos transcripts gerados, isso inclui qualquer arquivo que foi enviado para a sua CDN configurada, se usada, é de **inteira responsabilidade do usuário**.

### Responsabilidade e Conformidade do Usuário

Embora este projeto seja projetado para operar usando a API oficial do Discord e respeitar as regras publicadas do Discord, **não garante que todos os casos de uso possíveis estejam em conformidade com as políticas do Discord**.

Ao usar este projeto, você reconhece que é responsável por garantir a conformidade com:
1. **Política de Desenvolvedor do Discord**  
   https://support-dev.discord.com/hc/en-us/articles/8563934450327-Discord-Developer-Policy

2. **Termos de Serviço do Desenvolvedor do Discord**  
   https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service

3. **Política de Privacidade do Discord**  
   https://discord.com/privacy

4. Leis e regulamentos locais aplicáveis  

5. Regras específicas do servidor e requisitos de consentimento do usuário, quando aplicável.
   
Os mantenedores deste projeto **não são responsáveis** por como os transcripts gerados e os arquivos enviados para a CDN são armazenados, compartilhados, publicados ou de outra forma utilizados.

---

## 🛡️ Privacidade e Tratamento de Dados

- Nenhum dado é armazenado remotamente por este projeto.
- Nenhum dado é transmitido a terceiros (exceto para sua CDN configurada, se usada).
- Nenhuma raspagem de dados (scraping) fora da API do Discord.
- Nenhum rastreamento de usuário ou analytics.

Todos os transcripts gerados existem exclusivamente sob o controle do usuário final.

---

## 📜 Licença

Licenciado sob a **Apache License 2.0**.  
Veja o arquivo `LICENSE` para mais informações.

---

## 💬 Suporte, Contato e Contribuições

### Suporte e Dúvidas
- **Issues do GitHub:** Para relatórios de bugs, perguntas e esclarecimentos.
- **Discord:** Para suporte e discussão em https://discord.gg/4ACFdtRQMy

### Solicitação de Funcionalidades
- Por favor, envie ideias através das **Issues do GitHub** ou discuta-as no Discord.

### Contribuições
No momento, este projeto **não está aberto para contribuições de código externas** para garantir a estabilidade e uma arquitetura consistente. No entanto, feedback e ideias são sempre bem-vindos.

---

Obrigado pelo seu interesse neste projeto e por respeitar sua direção de desenvolvimento.
