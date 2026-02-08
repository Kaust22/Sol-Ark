# Deployment Instructions: Email Alert System

To make your "CONSOLE LOGIN" work on the live GitHub website, you must deploy the Email Alert System to the cloud.

## Step 1: Push Email Alert System to GitHub
1. Open a terminal in `e:\Email_Alert\email-alert-system`.
2. We have already configured the remote to `https://github.com/Kaust22/Sol-Ark.git`.
3. Run this command to push the backend code to a **new branch** called `email-system`:
   ```bash
   git checkout -b email-system
   git push -u origin email-system
   ```
   *(Note: using a separate branch prevents overwriting your main website code)*

## Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Import the `Sol-Ark` repository.
4. **CRITICAL**: In the "Import Project" screen, look for **"Production Branch"** or **"Branch"** settings and ensure you select `email-system`.
   *(If Vercel imports `main` by default, go to Settings > Git > Production Branch and change it to `email-system`)*.
5. **Environment Variables**:
   Add these under **Environment Variables**:
   - `GMAIL_USER`: `prakharsaxena230706@gmail.com`
   - `GMAIL_APP_PASSWORD`: `dxnn eiwe qjol vdtm`
6. Click **Deploy**.

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
