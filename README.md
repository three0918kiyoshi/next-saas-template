# Next SaaS Template (Next.js + Prisma + Postgres)

Vercel への即デプロイと、VPS での Docker 運用の両方に対応したスターターキットです。

## ディレクトリ構成

```
.
├── .github/workflows/ci.yml
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── nginx/default.conf
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   └── users/route.ts
│   │   ├── users/
│   │   │   ├── UserClient.tsx
│   │   │   └── page.tsx
│   │   ├── setup/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/prisma.ts
└── .env.example
```

## 機能

- Next.js App Router + TypeScript (src 構成)
- Prisma + Postgres
- Health check API: `GET /api/health`
- Users CRUD (最小):
  - `GET /api/users`
  - `POST /api/users`
- 画面:
  - `/` トップ（セットアップ手順へのリンク）
  - `/users` ユーザー一覧 + 追加フォーム

## セットアップ (ローカル開発)

1. `.env.example` をコピーして `.env` を作成

```bash
cp .env.example .env
```

2. Postgres を起動

```bash
docker compose up -d
```

3. 依存関係をインストール

```bash
npm install
```

4. Prisma をセットアップ

```bash
npm run db:migrate
npm run db:seed
```

5. 開発サーバーを起動

```bash
npm run dev
```

## Prisma コマンド

- `npm run db:generate` : Prisma Client 生成
- `npm run db:migrate` : 開発用マイグレーション
- `npm run db:migrate:deploy` : 本番用マイグレーション
- `npm run db:seed` : サンプルデータ投入

## Vercel デプロイ

1. Vercel の Project Settings で `DATABASE_URL` を設定
2. そのままデプロイ

Neon のようにコネクションプールを使う場合は、マイグレーション用に
プールを使わない `DIRECT_URL` も設定してください。

`npm run build` に `prisma generate` を含め、さらに `postinstall` でも生成するため、
ビルド時に Prisma Client が確実に生成されます。

## VPS (Docker) 運用

### Web + DB (同一ホスト)

```bash
# db を含めて起動
DATABASE_URL="postgresql://postgres:postgres@db:5432/next_saas?schema=public" \
  docker compose -f docker-compose.prod.yml --profile local-db up -d --build
```

### Web + 外部 DB (RDS など)

```bash
DATABASE_URL="postgresql://USER:PASSWORD@YOUR_DB_HOST:5432/DB_NAME?schema=public" \
  docker compose -f docker-compose.prod.yml up -d --build
```

### Nginx リバースプロキシ (任意)

```bash
DATABASE_URL="postgresql://postgres:postgres@db:5432/next_saas?schema=public" \
  docker compose -f docker-compose.prod.yml --profile local-db --profile nginx up -d --build
```

`nginx/default.conf` を必要に応じて編集してください。

## GitHub Actions

`.github/workflows/ci.yml` で以下を実行します。

- ESLint
- TypeScript typecheck
- Prisma migrate (Postgres サービスを起動して `migrate deploy`)

## トラブルシュート

- **Prisma Client が見つからない**
  - `npm run db:generate` を実行してください。

- **マイグレーションエラー**
  - `DATABASE_URL` が正しいか確認してください。
  - Neon などのコネクションプール環境では `DIRECT_URL` を設定してください。
  - 開発時は `npm run db:migrate` を利用してください。

- **Vercel でビルドが失敗する**
  - 環境変数 `DATABASE_URL` が設定されていることを確認してください。

## 前提

- 認証・課金などの外部有料サービスは含めません。
- DB は Postgres 固定で `DATABASE_URL` に統一しています。
