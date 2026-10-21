# Library Standalone (starter)

This is a starter scaffold for an independent online Library app. It is not yet the full previous AppDeploy app and does not include production AI, accounts, coins, premium entitlements, or a deployed database.

## Requirements
- Node.js 20+
- npm
- Android Studio for local Android builds (optional if using the GitHub Actions workflow)

## Run the web app
```bash
npm install
npm run dev
```

## Build the web app
```bash
npm run build
```

## Android
This scaffold includes Capacitor configuration and a GitHub Actions workflow. After installing dependencies:
```bash
npm run build
npx cap add android
npx cap sync android
```
Then open the generated `android` project in Android Studio. The workflow is a starting point and may need adjustment once the Android project is committed.

## Backend
The `backend/` directory contains a minimal Node.js health endpoint. Deploy it to a hosting provider of your choice and configure `VITE_API_BASE_URL` for the frontend. Do not put private API keys in frontend environment variables or the APK.
