# James's Storybook

A magical storybook app for James (age 3) — pick a topic, choose your settings, and enjoy a unique story every time! Works beautifully on iPad.

## Features

- **12 story categories**: Dinosaurs, Animals, Cars, Construction, Farm, Space, Airplanes, Ocean, Knights, Superheroes, Trains, and Bugs
- **James is the hero** of every story
- **60+ hand-written stories** with tons of variety
- **Customizable length**: Short (3 min), Medium (10 min), Long (15 min)
- **Day/Night modes**: Energetic adventures or gentle bedtime stories
- **Read-aloud narration**: Built-in voice with play/pause controls
- **iPad optimized**: Large touch targets, child-friendly UI, installable as a home screen app
- **100% free**: No API keys or subscriptions needed
- **100% safe**: All stories are age-appropriate with happy endings

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npm run dev
```

Open http://localhost:3000 on your iPad (or any browser).

### 3. Add to iPad Home Screen (optional)

1. Open the app in Safari on the iPad
2. Tap the Share button (square with arrow)
3. Tap "Add to Home Screen"
4. Now it works like a real app!

## Deploy to the Internet (Vercel - Free!)

The easiest way to make this available on the iPad from anywhere:

1. Push this repo to GitHub (already done!)
2. Go to https://vercel.com and sign in with GitHub
3. Click "Import Project" and select this repo
4. Click Deploy!

Your app will be live at a URL like `https://james-storybook.vercel.app`.

## Tech Stack

- Next.js 14 (React)
- Tailwind CSS
- Framer Motion (animations)
- Web Speech API (browser narration)
