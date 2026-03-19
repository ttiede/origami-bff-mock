# Origami BFF Mock — Deploy Guide

Mock GraphQL server that replicates the 26 BFF datasources used by the Origami app.

## Option 1: Render.com (recommended — easiest)

1. Push this repo to GitHub (public or private).
2. Go to https://render.com and sign in with GitHub.
3. Click **New > Web Service**.
4. Select the repository and set the **Root Directory** to `backend/bff-mock`.
5. Render will auto-detect `render.yaml`. Confirm the settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Click **Create Web Service**.
7. Your server will be live at `https://origami-bff-mock.onrender.com/graphql`.

> Free tier note: Render spins down the service after 15 min of inactivity.
> First request after idle takes ~30s to cold-start.

## Option 2: Railway.app

1. Go to https://railway.app and sign in with GitHub.
2. Click **New Project > Deploy from GitHub Repo**.
3. Select the repository.
4. In the service settings, set **Root Directory** to `backend/bff-mock`.
5. Add environment variable: `PORT = 8080`.
6. Railway auto-detects Node.js — it will run `npm install` then `npm start`.
7. Click **Deploy**. Railway assigns a public URL automatically.

> Free tier: 500 hours/month, 512 MB RAM. No credit card required for trial.

## Option 3: Fly.io

1. Install the Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Sign up / log in:
   ```bash
   fly auth signup
   # or
   fly auth login
   ```
3. From the `backend/bff-mock` directory, launch the app:
   ```bash
   fly launch --name origami-bff-mock --region gru --no-deploy
   ```
4. Deploy:
   ```bash
   fly deploy
   ```
5. Your server will be live at `https://origami-bff-mock.fly.dev/graphql`.

> Free tier: 3 shared-cpu VMs, 256 MB RAM each. Credit card required at signup.

## Testing the deployment

Once deployed, test with a simple curl:

```bash
curl -X POST https://<your-url>/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

Expected response:
```json
{"data":{"__typename":"Query"}}
```

## Local development

```bash
npm install
npm run dev
# Server runs at http://localhost:8080/graphql
```
