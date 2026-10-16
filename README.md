<div style="display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center; margin-bottom: 1rem;">
  <img src="./themes/glassmorphism/images/profile.png" alt="Prefeitura de Ilhabela" width="120" height="120" style="border-radius: 50%; margin-bottom: 1rem;">

<h1> Linkyee Prefeitura de Ilhabela</h1>


---
  <div alt= "stacks">
    <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
    <img src="https://img.shields.io/badge/ruby-%23CC342D.svg?style=for-the-badge&logo=ruby&logoColor=white" alt="Ruby">
    <img src="https://img.shields.io/badge/Shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Shell Script">
    <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/yaml-%23ffffff.svg?style=for-the-badge&logo=yaml&logoColor=151515" alt="YAML">
  </div>


</div>

Página oficial de links da Prefeitura de Ilhabela, construída com o
[linkyee](https://github.com/ZhgChgLi/linkyee) e publicada no GitHub Pages.
O projeto gera um site estático: os dados são lidos de arquivos YAML, os
plugins Ruby são executados durante o build e o HTML final é gravado em
`_output/`.

Este documento é o guia de uso e manutenção do projeto. Ele explica onde cada
parte do código fica, como alterar o conteúdo da página, como testar
localmente e como publicar uma mudança com segurança.

## Índice

- [Visão geral](#visão-geral)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração da página](#configuração-da-página)
- [Como editar o conteúdo](#como-editar-o-conteúdo)
- [Temas e aparência](#temas-e-aparência)
- [Plugins e dados dinâmicos](#plugins-e-dados-dinâmicos)
- [Fluxo de manutenção](#fluxo-de-manutenção)
- [Testes e pré-visualização local](#testes-e-pré-visualização-local)
- [Publicação no GitHub Pages](#publicação-no-github-pages)
- [Docker](#docker)
- [Solução de problemas](#solução-de-problemas)

## Visão geral

O fluxo de geração é:

```text
config.yml
    ├── conteúdo, links, redes sociais e opções
    └── plugins configurados
             │
             ▼
      scaffold.rb
    ├── executa os plugins Ruby
    ├── renderiza as expressões Liquid
    ├── copia o tema escolhido
    └── publica o resultado em _output/
```

O workflow [build.yml](./.github/workflows/build.yml) executa esse processo
no GitHub Actions quando há alteração na branch `main`, manualmente ou uma
vez por dia. A publicação é feita na branch `gh-pages`.

> **Importante:** a pasta `_output/` é gerada automaticamente. Não edite
> arquivos dentro dela. Altere `config.yml`, `themes/`, `plugins/` ou
> `scaffold.rb` e gere novamente o site.

## Estrutura do projeto

| Caminho | Responsabilidade |
| --- | --- |
| [`config.yml`](./config.yml) | Configuração principal: tema, perfil, links, redes sociais, rodapé e plugins. |
| [`scaffold.rb`](./scaffold.rb) | Script Ruby que lê a configuração, executa plugins e renderiza o site. |
| [`themes/`](./themes/) | Temas visuais. Cada subpasta contém `index.html`, `styles.css` e `scripts.js`. O padrão é o glassmorphism. |
| [`plugins/`](./plugins/) | Plugins Ruby que consultam dados externos durante o build. |
| [`plugins/README.md`](./plugins/README.md) | Referência técnica para criação e manutenção de plugins. |
| [`assets/`](./assets/) | Arquivos compartilhados, incluindo suporte à internacionalização. |
| [`examples/`](./examples/) | Exemplos de configurações, como o site multilíngue. |
| [`_output/`](./_output/) | Site gerado. É recriado pelo build e não deve ser editado manualmente. |
| [`preview.sh`](./preview.sh) | Gera o site, observa alterações e inicia um servidor local. |
| [`deploy.sh`](./deploy.sh) | Script usado pelo GitHub Actions para publicar em `gh-pages`. |
| [`Dockerfile`](./Dockerfile) | Imagem Docker com Ruby, dependências e o processo de rebuild. |
| [`docker-compose.yml`](./docker-compose.yml) | Execução local do site em um contêiner. |
| [`Gemfile`](./Gemfile) | Dependências Ruby do gerador. |

## Pré-requisitos

Para desenvolver diretamente na máquina:

- Windows -> WSL;
- Linux -> Bash;
- Ruby 3.4.2 ou compatível;
- Bundler;
- Python 3 ou Ruby com WEBrick, para o servidor local;
- Git.

No Windows, os scripts `.sh` devem ser executados pelo **Git Bash** ou pelo
**WSL**. Como alternativa, use Docker, descrito mais adiante.

Instale as dependências uma única vez, na raiz do projeto:

```bash
bundle install
```

As dependências principais são Liquid, Nokogiri e bibliotecas padrão
empacotadas no [`Gemfile`](./Gemfile).

## Configuração da página

Quase toda manutenção diária acontece em [`config.yml`](./config.yml). O
arquivo é YAML e também aceita expressões Liquid, avaliadas durante o build.

### Aparência e idioma

```yaml
theme: glassmorphism
lang: "pt-br"
i18n:
  default_locale: pt-br
  locales:
    pt-br: locales/pt-br.yml
    en: locales/en.yml
    es: locales/es.yml
    fr: locales/fr.yml
color_scheme: auto
```

- `theme` deve corresponder ao nome de uma pasta em [`themes/`](./themes/).
- `lang` define o idioma do atributo HTML `lang`.
- `i18n.locales` define as versões disponíveis e aponta para seus catálogos
  YAML. O build gera uma pasta para cada idioma (`/pt-br/`, `/en/`, `/es/` e
  `/fr/`) e uma página raiz de seleção.
- A página raiz identifica automaticamente o idioma preferido pelo navegador
  usando `navigator.languages`/`navigator.language`, redireciona para a versão
  correspondente e usa `pt-br` como fallback. Não há seleção manual de idioma.
- Cada catálogo pode substituir textos do perfil, links, rodapé e os textos de
  interface em `ui`. Os arquivos oficiais ficam em [`locales/`](./locales/).
- `color_scheme` pode ser `auto`, `light` ou `dark`. Em `auto`, o tema
  acompanha a preferência do sistema do visitante.

### Perfil

```yaml
title: "Ilhabela"
avatar: "./images/profile.jpeg"
name: "Prefeitura de Ilhabela"
tagline: >-
  Capital Nacional da Vela
```

O caminho de `avatar` é relativo ao tema. Para trocar a imagem, substitua o
arquivo correspondente em `themes/<tema>/images/`, utilize o nome do arquivo profile.jpg, e mantenha o caminho
coerente com o `config.yml`.

### Links principais

Cada item em `links` tem a seguinte estrutura:

```yaml
links:
  - link:
      icon: "fa-solid fa-globe"
      text: "Portal da Prefeitura"
      url: "https://www.ilhabela.sp.gov.br"
      alt: "Portal da Prefeitura de Ilhabela"
      title: "Portal da Prefeitura de Ilhabela"
      target: "_blank"
```

- `icon`: classe do [Font Awesome](https://fontawesome.com/search?o=r&m=free).
- `text`: texto visível; pode conter HTML e Liquid.
- `url`: endereço de destino.
- `alt`: descrição para acessibilidade.
- `title`: texto de apoio exibido pelo navegador.
- `target`: use `_blank` para abrir uma nova aba ou `_self` para reutilizar a
  aba atual.
- `latest: true`: aplica a indicação visual de conteúdo mais recente nos
  temas que suportam esse recurso.

Para adicionar um link, copie um bloco existente, altere os campos e preserve
o recuo YAML. Um recuo incorreto impede a geração da página.

### Redes sociais

Os itens de `socials` seguem o mesmo padrão, mas usam `social`:

```yaml
socials:
  - social:
      icon: "fa-brands fa-instagram"
      url: "https://www.instagram.com/prefeituradeilhabelaoficial/"
      title: "Instagram da Prefeitura de Ilhabela"
      alt: "Instagram da Prefeitura de Ilhabela"
      target: "_blank"
```

### Rodapé e ano automático

`footer` e `copyright` aceitam HTML e Liquid. O gerador fornece `year`,
`month`, `day` e `today` automaticamente:

```yaml
footer: "Prefeitura Municipal de Ilhabela"
copyright: "© {{ year }} Powered by linkyee"
```

## Como editar o conteúdo

### Alteração comum de texto ou endereço

1. Abra [`config.yml`](./config.yml).
2. Localize o bloco de perfil, `links`, `socials` ou rodapé.
3. Altere somente o valor necessário.
4. Execute o build local.
5. Abra a página gerada e verifique o link, o texto e a aparência em celular.
6. Faça commit e abra um pull request ou envie a alteração para `main`.

### Alteração do layout

O arquivo [`themes/glassmorphism/index.html`](./themes/glassmorphism/index.html)
define a marcação HTML e as expressões Liquid. O CSS fica em
[`themes/glassmorphism/styles.css`](./themes/glassmorphism/styles.css), e o
JavaScript opcional em `scripts.js`.

Para alterar o tema atualmente publicado:

1. Edite os arquivos da pasta do tema escolhido.
2. Preserve os campos esperados por `config.yml`, como `links`, `socials`,
   `title`, `name`, `tagline` e `footer`.
3. Mantenha foco visível, contraste adequado, responsividade e suporte a
   `prefers-reduced-motion`.
4. Teste em largura de 320 px ou maior e nos modos claro e escuro.

Para criar um novo tema, copie uma pasta existente para `themes/<novo-nome>/`,
mantenha os três arquivos (`index.html`, `styles.css` e `scripts.js`) e altere
`theme:` no `config.yml`.

## Plugins e dados dinâmicos

Plugins são classes Ruby executadas no build. O projeto inclui:

| Plugin | Uso |
| --- | --- |
| `GithubRepoStarsCountPlugin` | Quantidade de estrelas de repositórios. |
| `GithubLastCommitPlugin` | SHA, data e mensagem do último commit. |
| `GithubProfilePlugin` | Seguidores e repositórios públicos de um usuário. |
| `RSSFeedPlugin` | Últimos itens de um feed RSS ou Atom. |
| `CountdownPlugin` | Dias até ou desde uma data. |
| `YouTubeChannelLatestVideoPlugin` | Último vídeo de um canal. |

Os plugins são habilitados em `config.yml`:

```yaml
plugins:
  - RSSFeedPlugin:
      - https://www.ilhabela.sp.gov.br/portal/rss
```

O resultado pode ser usado em qualquer texto renderizado por Liquid:

```yaml
text: "{{ vars.RSSFeedPlugin['https://www.ilhabela.sp.gov.br/portal/rss'][0].title }}"
url: "{{ vars.RSSFeedPlugin['https://www.ilhabela.sp.gov.br/portal/rss'][0].url }}"
```

Consulte [`plugins/README.md`](./plugins/README.md) antes de criar ou alterar
um plugin. Essa documentação explica o contrato da classe `Plugin`, acesso
HTTP, cache, JSON, Liquid e tratamento de erros.

### Regras para plugins

- O arquivo deve ser `plugins/NomeDoPlugin.rb` e a classe deve ter o mesmo
  nome.
- A classe deve herdar de `Plugin` e implementar `execute`.
- Retorne sempre o mesmo formato de dados, inclusive quando a fonte externa
  falhar.
- __**Não coloque tokens, chaves de API ou senhas no código ou no `config.yml`.**__
- Para dados autenticados, use secrets do GitHub Actions e leia-os com
  `ENV["NOME_DO_SECRET"]`.

O build registra a falha de um plugin e continua a geração, mas o valor
correspondente pode aparecer vazio. Sempre confira o log e o HTML gerado.

## Fluxo de manutenção

### Antes de editar

- Confirme se a mudança é de conteúdo (`config.yml`), visual (`themes/`) ou
  comportamento de build/plugin (`scaffold.rb` ou `plugins/`).
- Verifique se há alterações locais com `git status`.
- Não edite `_output/` nem arquivos gerados.

### Depois de editar

Execute:

```bash
bundle exec ruby ./scaffold.rb
```

Depois confira:

- `_output/index.html` foi gerado;
- todos os links abrem o destino correto;
- imagens e ícones aparecem;
- não há `{{ ... }}` ou mensagens de erro no HTML;
- a página funciona em modo claro, escuro e em telas pequenas, responsivo.

Para mudanças no tema, atualize as imagens de prévia somente se necessário,
usando [`scripts/screenshot-themes.sh`](./scripts/screenshot-themes.sh) com
Playwright instalado.

### Commits e publicação

Prefira commits pequenos e descritivos, por exemplo:

```text
Atualiza link do portal de serviços
Ajusta contraste do tema glassmorphism
Corrige feed de notícias da Prefeitura
```

Não inclua arquivos com secrets, credenciais ou dados pessoais. O workflow
ignora alterações apenas documentais em alguns casos, então uma mudança no
README não dispara publicação; alterações em `config.yml`, temas e plugins
disparam o build.

## Testes e pré-visualização local

O modo recomendado para desenvolvimento é:

```bash
./preview.sh
```

Acesse <http://localhost:8080>. O script recompila ao detectar alterações em
`themes/`, `plugins/`, `config.yml` e `scaffold.rb`; basta atualizar o
navegador.

É possível testar outro tema sem alterar permanentemente o arquivo:

```bash
./preview.sh minimal-mono
```

Ao interromper com `Ctrl+C`, o `config.yml` original é restaurado. Para usar
outra porta:

```bash
PORT=4000 ./preview.sh
```

O teste mínimo para qualquer alteração é:

```bash
bundle exec ruby ./scaffold.rb
```

Se houver falha, corrija o erro indicado no terminal antes de publicar.

## Docker

Quando Ruby ou Bash não estiverem disponíveis, execute a aplicação em Docker:

```bash
docker compose up -d --build
```

A página ficará disponível em <http://localhost:8080>. Para alterar a porta
ou a frequência de atualização dos plugins:

```bash
PORT=8081 REBUILD_INTERVAL=3600 docker compose up -d --build
```

O volume Docker `plugin-cache` conserva o cache dos plugins entre reinícios.
Para acompanhar os logs:

```bash
docker compose logs -f linkyee
```

## Solução de problemas

### O build falha com erro de YAML

Confira indentação, aspas e listas em `config.yml`. YAML é sensível a espaços;
use espaços, não tabulações. Compare com os blocos já existentes.

### Um link dinâmico aparece vazio

Execute `bundle exec ruby ./scaffold.rb` e leia os avisos no terminal. A fonte
externa pode estar indisponível, ter alterado o formato ou exigir credencial.
Confirme também se o nome do plugin e a chave usada em `vars.<Plugin>` estão
exatos.

### O tema não é encontrado

O valor de `theme:` deve ser exatamente o nome de uma pasta em
[`themes/`](./themes/). Por exemplo, `glassmorphism` e `minimal-mono` são
válidos; nomes de arquivos ou caminhos completos não são.

### O navegador mostra uma versão antiga

Atualize a página sem usar cache. O `preview.sh` envia cabeçalhos
`no-cache`; no GitHub Pages, aguarde a conclusão do workflow e teste em uma
janela anônima.

### O GitHub Actions não publicou

Abra o job **Automatic build**, leia o primeiro erro e reproduza localmente.
Verifique especialmente permissões de escrita do workflow, dependências Ruby,
URLs dos feeds e alterações de YAML. Não execute `deploy.sh` manualmente:
ele exige o ambiente do GitHub Actions.

## Links úteis

- [Repositório original do linkyee](https://github.com/ZhgChgLi/linkyee)
- [GitHub Pages](https://docs.github.com/pt/pages)
- [Documentação de plugins](./plugins/README.md)
- [Exemplo de internacionalização](./examples/i18n/)
