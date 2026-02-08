# Deployment Instructions: Email Alert System

To make your "CONSOLE LOGIN" work on the live GitHub website, you must deploy the Email Alert System to the cloud.

## Step 1: Push Email Alert System to GitHub
1. Create a **new repository** on GitHub (e.g., named `email-alert-backend`).
2. Open a terminal in `e:\Email_Alert\email-alert-system`.
3. Run these commands (replace `<YOUR_REPO_URL>` with the one from GitHub):
   ```bash
   git remote add origin <YOUR_REPO_URL>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Import your `email-alert-backend` repository.
4. **Environment Variables**:
   Current `.env.local` values must be added in Vercel under **Settings > Environment Variables**:
   - `GMAIL_USER`: `prakharsaxena230706@gmail.com`
   - `GMAIL_APP_PASSWORD`: `dxnn eiwe qjol vdtm`
5. Click **Deploy**.

## Step 3: Update Sol-Ark Frontend
1. Once deployed, copy the **Deployment URL** (e.g., `https://email-alert-backend.vercel.app`).
2. Open `C:\Users\hp\OneDrive\Desktop\Sol-Ark\index.html`.
3. Search for the `<iframe>` near the bottom (inside `console-overlay`).
4. Replace `https://YOUR-VERCEL-URL.vercel.app` with your **actual URL**.
5. Save and push your `Sol-Ark` code to GitHub.

## Verify
- Open your live Sol-Ark GitHub Page.
- Click "CONSOLE LOGIN".
- The email system should load securely inside the overlay.
