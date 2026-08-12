# Boilerplate de E-commerce com Medusa e Next.js

Boilerplate full-stack para criar lojas virtuais headless sem começar do zero. O projeto reúne um backend de comércio eletrônico, painel administrativo e storefront em um monorepo pronto para customização.

Ele serve como base para diferentes operações de e-commerce: altere identidade visual, catálogo, regiões, moedas, meios de pagamento, logística e regras de negócio conforme as necessidades de cada loja.

## O que está incluído

- Backend headless com Medusa 2.18.
- Painel administrativo para produtos, pedidos, clientes, estoque e configurações.
- Storefront com Next.js 15 e React 19.
- Catálogo com produtos, variantes, categorias e coleções.
- Carrinho, promoções e checkout.
- Contas de clientes, endereços e histórico de pedidos.
- Regiões, países e moedas configuráveis.
- Canais de venda e publishable API keys.
- PostgreSQL para persistência e Redis para sessões.
- Turborepo para gerenciar os aplicativos do monorepo.
- Docker Compose para ambientes de teste e implantação.

## Arquitetura

```text
.
├── apps/
│   ├── backend/       # Medusa, APIs Store/Admin e painel administrativo
│   └── storefront/    # Loja Next.js consumindo a Store API
├── docker/            # Imagens e scripts de inicialização
├── compose.test.yml   # PostgreSQL, Redis, backend e storefront
├── NGINX-TEST.conf    # Rotas para publicação sob /test
├── turbo.json         # Pipeline do monorepo
└── package.json       # Scripts e workspaces npm
```

O navegador acessa a storefront e o Admin. Ambos consomem o backend Medusa, que centraliza catálogo, preços, clientes, carrinhos, pedidos e integrações. PostgreSQL e Redis permanecem privados.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Backend | Medusa 2.18, Node.js e TypeScript |
| Admin | Medusa Admin, React e Vite |
| Storefront | Next.js 15, React 19 e Tailwind CSS |
| Banco | PostgreSQL 15+ |
| Sessões | Redis 7+ |
| Monorepo | npm workspaces e Turborepo |
| Deploy | Docker Compose e Nginx |

## Pré-requisitos locais

- Node.js 20 ou superior.
- npm 10.
- PostgreSQL 15 ou superior.
- Redis, recomendado para reproduzir o ambiente de implantação.

## Instalação local

Instale as dependências na raiz:

```bash
npm install
```

Crie os arquivos locais de ambiente:

```bash
cp apps/backend/.env.template apps/backend/.env
cp apps/storefront/.env.template apps/storefront/.env.local
```

Configure ao menos:

- `DATABASE_URL` no backend.
- `JWT_SECRET` e `COOKIE_SECRET` com valores seguros.
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` na storefront.

Execute as migrations:

```bash
cd apps/backend
npm exec medusa db:migrate
cd ../..
```

Crie um usuário administrador:

```bash
cd apps/backend
npm exec medusa user -e admin@example.com -p 'troque-esta-senha'
cd ../..
```

Inicie todo o monorepo:

```bash
npm run dev
```

Endereços locais:

- Storefront: `http://localhost:8000`
- Backend: `http://localhost:9000`
- Admin: `http://localhost:9000/app`

Também é possível iniciar cada aplicação separadamente:

```bash
npm run backend:dev
npm run storefront:dev
```

## Configuração inicial da loja

Depois de entrar no Admin:

1. Crie ou revise a região, moeda e países atendidos.
2. Configure um Sales Channel.
3. Crie uma Publishable API Key e associe-a ao canal.
4. Informe essa chave em `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
5. Configure localização, estoque, entrega e meios de pagamento.
6. Crie produtos, variantes, preços e imagens.
7. Publique os produtos e associe-os ao Sales Channel da loja.

Um produto só aparece corretamente quando está publicado, pertence ao canal de venda usado pela chave pública, possui preço para a região atual e tem estoque disponível ou controle de estoque desativado.

## Variáveis principais

### Backend

| Variável | Finalidade |
| --- | --- |
| `DATABASE_URL` | Conexão PostgreSQL |
| `REDIS_URL` | Conexão Redis |
| `STORE_CORS` | Origens autorizadas para a Store API |
| `ADMIN_CORS` | Origens autorizadas para o Admin |
| `AUTH_CORS` | Origens autorizadas para autenticação |
| `JWT_SECRET` | Assinatura de tokens |
| `COOKIE_SECRET` | Assinatura de cookies |
| `ADMIN_PATH` | Caminho público do painel |
| `FILE_UPLOAD_DIR` | Diretório persistente de uploads |
| `FILE_BACKEND_URL` | URL pública usada nas imagens enviadas |

### Storefront

| Variável | Finalidade |
| --- | --- |
| `MEDUSA_BACKEND_INTERNAL_URL` | URL usada pelo servidor Next.js dentro da rede |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | URL pública da API |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Chave pública associada ao Sales Channel |
| `NEXT_PUBLIC_BASE_URL` | URL pública da loja |
| `NEXT_PUBLIC_BASE_PATH` | Prefixo opcional, como `/test` |
| `NEXT_PUBLIC_DEFAULT_REGION` | País padrão em formato ISO, como `gb` |

Valores `NEXT_PUBLIC_*` e caminhos do Admin são incorporados aos bundles durante o build. Recrie a aplicação correspondente depois de alterá-los.

## Docker

Copie o exemplo e revise URLs, senhas e chaves:

```bash
cp .env.docker.example .env.docker
```

Para construir e subir no mesmo host:

```bash
docker compose --env-file .env.docker -f compose.test.yml up --build -d
```

Para construir no computador e transferir as imagens para uma VPS:

```bash
docker compose --env-file .env.docker -f compose.test.yml build backend storefront
docker save --output medusa-images.tar medusa-test-backend:latest medusa-test-storefront:latest
```

Na VPS:

```bash
docker load --input medusa-images.tar
docker compose --env-file .env.docker -f compose.test.yml up -d --no-build
```

O `--no-build` evita gerar cache pesado de compilação na VPS. Consulte [DOCKER-TEST.md](DOCKER-TEST.md) para o procedimento atual e [NGINX-TEST.conf](NGINX-TEST.conf) para as rotas de proxy.

## Scripts úteis

| Comando | Ação |
| --- | --- |
| `npm run dev` | Inicia os aplicativos em desenvolvimento |
| `npm run build` | Compila todo o monorepo |
| `npm run lint` | Executa as verificações de código |
| `npm run test` | Executa as tarefas de teste disponíveis |
| `npm run backend:dev` | Inicia somente o Medusa |
| `npm run storefront:dev` | Inicia somente a storefront |
| `npm run docker:test:up` | Constrói e inicia a stack Docker |
| `npm run docker:test:down` | Encerra a stack preservando os volumes |
| `npm run docker:test:logs` | Acompanha os logs da stack |

## Customização do boilerplate

Pontos comuns de evolução:

- Substituir marca, cores, fontes e componentes da storefront.
- Integrar Stripe ou outro provedor de pagamento.
- Configurar fulfillment, transportadoras e cálculo de frete.
- Criar módulos Medusa para regras específicas do negócio.
- Adicionar workflows, subscribers e jobs.
- Estender o painel administrativo com widgets e páginas próprias.
- Integrar CMS, busca, analytics, ERP ou marketplace.
- Criar ambientes separados para desenvolvimento, homologação e produção.

Evite inserir regras de negócio diretamente nas rotas HTTP. No backend Medusa, mantenha essas regras em workflows, steps e serviços de módulos.

## Segurança

- Nunca versione `.env`, `.env.local` ou `.env.docker`.
- Use segredos longos e diferentes para JWT, cookies e banco.
- Não publique PostgreSQL ou Redis na internet.
- Restrinja CORS às origens reais da aplicação.
- Use HTTPS em ambientes públicos.
- Não use as credenciais de exemplo em produção.

## Referências

- [Documentação do Medusa](https://docs.medusajs.com)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Turborepo](https://turbo.build/repo/docs)
