# James's Storybook 📖✨

A magical storybook app for James (age 3) — pick a topic, choose your settings, and get a unique story every time! Works beautifully on iPad.

## Features

- **12 story categories**: Dinosaurs, Animals, Cars, Construction, Farm, Space, Airplanes, Ocean, Knights, Superheroes, Trains, and Bugs
- **James is the hero** of every story
- **Customizable length**: Short (3 min), Medium (10 min), Long (15 min)
- **Day/Night modes**: Energetic adventures or gentle bedtime stories
- **Narration**: Built-in read-aloud with play/pause controls
- **Endless variety**: AI-generated stories so James never hears the same story twice
- **iPad optimized**: Large touch targets, child-friendly UI, installable as a home screen app
- **100% safe**: All stories are age-appropriate with happy endings

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your API key

Copy the example env file and add your Anthropic API key:

```bash
cp .env.example .env
```

Edit `.env` and add your key from https://console.anthropic.com/:

```
ANTHROPIC_API_KEY=sk-ant-...
```

> **No API key?** The app still works! It will use built-in fallback stories.

### 3. Run the app

```bash
npm run dev
```

Open http://localhost:3000 on your iPad (or any browser).

### 4. Add to iPad Home Screen (optional)

1. Open the app in Safari on the iPad
2. Tap the Share button (square with arrow)
3. Tap "Add to Home Screen"
4. Now it works like a real app!

## Voice Cloning with ElevenLabs (Optional - Dad's Voice!)

To narrate stories in Dad's voice:

1. Sign up at https://elevenlabs.io/
2. Go to "Voices" → "Add Generative or Cloned Voice" → "Instant Voice Cloning"
3. Upload a recording of your voice (the clearer the better, 1-5 minutes)
4. Copy the Voice ID and API key
5. Add to your `.env`:

```
ELEVENLABS_API_KEY=your-key-here
ELEVENLABS_VOICE_ID=your-voice-id-here
```

## Deploy to the Internet (Vercel - Free!)

The easiest way to make this available on the iPad from anywhere:

1. Push this repo to GitHub (already done!)
2. Go to https://vercel.com and sign in with GitHub
3. Click "Import Project" and select this repo
4. Add your `ANTHROPIC_API_KEY` as an environment variable
5. Click Deploy!

Your app will be live at `https://james-storybook.vercel.app` (or similar).

## Tech Stack

- Next.js 14 (React)
- Tailwind CSS
- Framer Motion (animations)
- Claude API (story generation)
- Web Speech API (browser narration)
- ElevenLabs API (optional voice cloning)
