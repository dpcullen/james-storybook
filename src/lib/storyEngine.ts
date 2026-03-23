import type { StoryLength, TimeOfDay } from "./storyPrompts";

export interface StoryEntry {
  text: string;
  length: StoryLength;
}

// Day/night wrapper paragraphs to add variety and set the tone
const dayOpenings = [
  "It was a bright, sunny morning and James jumped out of bed ready for an adventure!",
  "The sun was shining and the birds were singing. James looked outside and smiled — today was going to be a great day!",
  "James woke up to sunshine streaming through his window. \"What a perfect day!\" he said, bouncing with excitement.",
  "The sky was big and blue and beautiful. James put on his favorite shoes and said, \"Let's GO!\"",
  "It was the most beautiful morning ever. James could feel it in his tummy — something wonderful was about to happen!",
];

const nightOpenings = [
  "The stars were twinkling softly in the sky as James snuggled into his cozy bed. He closed his eyes and began to dream...",
  "The moon glowed gently outside James's window, casting a soft silver light across his room. James hugged his favorite stuffed animal and drifted into a beautiful dream...",
  "It was a quiet, peaceful evening. James was all warm and cozy under his favorite blanket. As his eyes grew heavy, a wonderful story began...",
  "The night sky was full of gentle, twinkling stars. James yawned a big yawn, snuggled deep into his pillow, and began the most wonderful dream...",
  "Soft moonlight filled James's room as he closed his sleepy eyes. Everything was calm and quiet, and soon a magical dream began...",
];

const dayClosings = [
  "\n\nJames laughed and clapped his hands. \"That was the BEST adventure ever!\" And he couldn't wait to do it all again tomorrow.\n\nThe End.",
  "\n\nJames gave the biggest smile. What an amazing day! He skipped all the way home, already dreaming about his next adventure.\n\nThe End.",
  "\n\n\"WOW!\" said James, his eyes sparkling with joy. It had been the most wonderful day, and he knew there would be many more adventures to come.\n\nThe End.",
];

const nightClosings = [
  "\n\nAnd as the dream gently faded, James smiled in his sleep. He was warm, he was safe, and he was happy. The stars twinkled softly outside his window, watching over him all night long.\n\nThe End.",
  "\n\nJames yawned the coziest yawn and snuggled deeper into his blanket. The moonlight kissed his forehead softly. \"Goodnight, world,\" he whispered. And he slept peacefully until morning.\n\nThe End.",
  "\n\nThe dream slowly drifted away like a soft cloud. James smiled in his sleep, feeling warm and loved. Outside, the stars sang a quiet lullaby just for him.\n\nThe End.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Track recently shown stories to avoid repeats
const recentlyShown: Record<string, number[]> = {};

export function getStory(
  categoryId: string,
  storyLength: StoryLength,
  timeOfDay: TimeOfDay,
  allStories: Record<string, StoryEntry[]>
): string {
  const categoryStories = allStories[categoryId] || [];

  // Filter by requested length, fallback to any length
  let matching = categoryStories.filter((s) => s.length === storyLength);
  if (matching.length === 0) matching = categoryStories;
  if (matching.length === 0) {
    return "Once upon a time, James had a wonderful adventure full of fun and laughter. And they all lived happily ever after!\n\nThe End.";
  }

  // Avoid recently shown stories
  const key = `${categoryId}-${storyLength}`;
  if (!recentlyShown[key]) recentlyShown[key] = [];

  let availableIndices = matching
    .map((_, i) => i)
    .filter((i) => !recentlyShown[key].includes(i));

  // If all stories have been shown, reset
  if (availableIndices.length === 0) {
    recentlyShown[key] = [];
    availableIndices = matching.map((_, i) => i);
  }

  const chosenIndex = pickRandom(availableIndices);
  recentlyShown[key].push(chosenIndex);

  // Keep only last N in memory (half the total, so there's always fresh ones)
  const keepCount = Math.max(1, Math.floor(matching.length / 2));
  if (recentlyShown[key].length > keepCount) {
    recentlyShown[key] = recentlyShown[key].slice(-keepCount);
  }

  const baseStory = matching[chosenIndex].text;

  // Add day/night framing
  if (timeOfDay === "night") {
    return pickRandom(nightOpenings) + "\n\n" + baseStory + pickRandom(nightClosings);
  } else {
    return pickRandom(dayOpenings) + "\n\n" + baseStory + pickRandom(dayClosings);
  }
}
