# Asuka Planner 🌸

Mobile-first planner web app built with **Next.js 14 + TypeScript + Tailwind CSS + Firestore**.

## Features

- Intro login screen with “Let’s go” button (no auth flow)
- Home dashboard with:
  - Hamburger navigation
  - Nishi-Waseda weather (Open-Meteo current temperature + icon)
  - Interactive day picker calendar + Today shortcut
  - Date-based card lists for trips/events/todos plus wishlist
- Firestore-backed CRUD for:
  - Trips
  - Events
  - Todos
  - Wishlist
- Participants tag input
- Completion behavior:
  - Todo/wishlist items can be toggled complete by tapping the card
  - Trips/events are treated as completed automatically after end date/time
- Past events view

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Firestore
- react-day-picker
- date-fns
- Vitest

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
```

3. Run development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Firebase Notes

- Firebase app initialization lives in `lib/firebase.ts`.
- Firestore CRUD helpers live in `lib/firestore.ts`.
- API keys are loaded only through environment variables.

## Tests

```bash
npm run test
```

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Set all `NEXT_PUBLIC_FIREBASE_*` variables in Vercel Project Settings → Environment Variables.
4. Deploy.

## Manual Testing Checklist

- Open app on mobile viewport.
- Tap **Let’s go** and confirm navigation to Home.
- Verify weather and temperature render for Nishi-Waseda.
- Navigate calendar months and tap **Today**.
- Create, edit, and delete each record type.
- Toggle todo/wishlist completion by tapping cards.
- Verify past events page shows historical items.
