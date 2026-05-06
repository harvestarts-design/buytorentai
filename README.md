# BuyToRent AI

**Buy low. Rent high.**

This is a Vercel-ready Next.js prototype for a long-term rental investment analytics product.

## Included pages
- `/` — Homepage
- `/analyzer` — Property Deal Analyzer
- `/markets` — Market Finder
- `/alerts` — Deal Alerts / Buy Box
- `/early-access` — Early Access / Saved Searches demo

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Deploy to Vercel
1. Create a GitHub repo named `buytorent-ai`.
2. Upload this folder to the repo.
3. Go to Vercel and choose Add New Project.
4. Import the GitHub repo.
5. Use the default Next.js settings.
6. Deploy.
7. Add your custom domain: `buytorentai.com`.

## Connect your domain
In Vercel, go to Project Settings > Domains, add `buytorentai.com`, then copy the DNS records into your domain registrar.

## Recommended next upgrades
1. Connect the early-access form to Tally, ConvertKit, Mailchimp, or Supabase.
2. Add Supabase Auth for user accounts.
3. Store saved searches in Supabase.
4. Connect RentCast API for property/rent estimates.
5. Connect HUD FMR API for fair market rent data.
6. Add Stripe for paid plans.
