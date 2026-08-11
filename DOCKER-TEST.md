# Deploy de teste

URLs públicas:

- Loja: `https://vps57731.publiccloud.com.br/test`
- Admin: `https://vps57731.publiccloud.com.br/test/adm`
- API: `https://vps57731.publiccloud.com.br/test/api`

O Docker publica apenas no localhost da VPS:

- `127.0.0.1:6868`: storefront
- `127.0.0.1:6969`: backend Medusa, incluindo Admin e API

O trecho a inserir no `server` HTTPS do Nginx está em `NGINX-TEST.conf`. Os demais blocos do Nginx não devem ser alterados.

## Build no PC

```powershell
docker compose --env-file .env.docker -f compose.test.yml build backend storefront
docker save --output medusa-images.tar medusa-test-backend:latest medusa-test-storefront:latest
```

Envie pelo FileZilla `medusa-images.tar`, `compose.test.yml` e `.env.docker`.

## Atualização na VPS

```bash
cd /var/www/e-commerce-99
docker compose --env-file .env.docker -f compose.test.yml down
docker load --input medusa-images.tar
rm -f medusa-images.tar
docker compose --env-file .env.docker -f compose.test.yml up -d --no-build
docker compose --env-file .env.docker -f compose.test.yml ps
```

O `down` sem `-v` preserva PostgreSQL e Redis.
