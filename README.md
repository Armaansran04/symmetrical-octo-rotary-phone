# CurateAI — Beginner Setup Guide

This project contains a frontend (HTML/CSS/JavaScript) and an Express backend. It runs in demo mode without an API key, so you can test the interface before configuring AI.

## What you need

Install:
1. **Node.js LTS** from https://nodejs.org/
2. **Visual Studio Code** from https://code.visualstudio.com/ (recommended)

## Step 1 — Open the project

1. Extract `curateai_project.zip`.
2. Open Visual Studio Code.
3. Choose **File → Open Folder** and select the `curateai_project` folder.
4. Open **Terminal → New Terminal**.

## Step 2 — Install the packages

In the terminal, run:

```bash
npm install
```

Wait for it to finish.

## Step 3 — Start the website in demo mode

Run:

```bash
npm start
```

Open **http://localhost:3000** in your browser. Keep the terminal running while you use the site.

In demo mode, search, category filters, and bookmarks work, but the curation results are sample content.

## Step 4 — Enable real AI curation

1. Create an API key in the OpenAI developer platform: https://platform.openai.com/api-keys
2. API usage may require billing/credits; ChatGPT subscriptions and API billing are separate.
3. In VS Code, duplicate `.env.example` and name the copy `.env` (the filename must be exactly `.env`).
4. Open `.env` and replace `put_your_api_key_here` with your API key.
5. Save the file and restart the server (`Ctrl+C`, then `npm start`).

Keep the API key in `.env` only. Never paste it into `public/app.js`, HTML, screenshots, or a public GitHub repository. The `.gitignore` file excludes `.env`.

The default model is set in `.env` as `OPENAI_MODEL=gpt-5.5`. If your account does not have access to that model, change it to a model available to your API account.

## Step 5 — Test it

Try:
- `AI in Education`
- `Digital Marketing`
- `Climate Change`
- Save a card, then click **Saved**
- Change category filters
- Refresh the page and check that saved cards remain

## Troubleshooting

- **`npm` is not recognized:** Install Node.js LTS, close and reopen VS Code, then try again.
- **Cannot find package:** Run `npm install` in the project folder.
- **Port already in use:** Change `PORT=3000` in `.env` to `PORT=3001`, restart, and open `http://localhost:3001`.
- **AI request fails:** Check that the API key is correct, API billing/credits are enabled, and the selected model is available. Never share the API key in chat.
- **Website does not open:** Check the terminal for errors and ensure the server is still running.

## Important project limitation

This starter project asks the AI to propose useful resource ideas and summaries; it does not independently crawl the internet or verify articles. For production-quality content curation, connect a search/news API, store source metadata, verify links, and display citations for sources.
