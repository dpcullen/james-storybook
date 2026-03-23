export type StoryLength = "short" | "medium" | "long";
export type TimeOfDay = "day" | "night";

interface StoryConfig {
  category: string;
  theme: string;
  length: StoryLength;
  timeOfDay: TimeOfDay;
}

const lengthInstructions: Record<StoryLength, string> = {
  short:
    "Write a SHORT story (about 200-300 words, suitable for a 3-minute read-aloud). Keep it simple with a clear beginning, middle, and happy ending.",
  medium:
    "Write a MEDIUM story (about 500-700 words, suitable for a 10-minute read-aloud). Include fun details, dialogue, and a satisfying happy ending.",
  long:
    "Write a LONG story (about 900-1200 words, suitable for a 15-minute read-aloud). Include rich details, fun dialogue, exciting moments, and a wonderful happy ending.",
};

const timeInstructions: Record<TimeOfDay, string> = {
  day: "This is a DAYTIME story — make it energetic, fun, exciting, and full of adventure! Use bright, vivid descriptions.",
  night:
    "This is a BEDTIME / NIGHTTIME story — make it calm, gentle, cozy, and soothing. Use soft, peaceful descriptions. The story should wind down gently and end with the character feeling safe, sleepy, and happy. Include cozy details like warm blankets, soft moonlight, twinkling stars, and gentle breezes.",
};

// Story structure variations to ensure variety
const storyStructures = [
  "a journey/adventure where James travels to a new place",
  "a problem that James and friends solve together with teamwork",
  "a discovery where James finds something magical or surprising",
  "a friendship story where James makes a wonderful new friend",
  "a celebration or party with fun and games",
  "a helping story where James helps someone in need",
  "a learning story where James discovers something new and exciting",
  "a silly mix-up that leads to lots of laughs",
  "a building/creating story where James makes something amazing",
  "a treasure hunt with fun clues and surprises",
];

// Additional story flavor details
const settings = [
  "a magical forest",
  "a sunny meadow",
  "a friendly town",
  "a colorful playground",
  "a cozy treehouse",
  "a sparkling river",
  "a rainbow bridge",
  "a fluffy cloud land",
  "a garden of giant flowers",
  "a hidden valley",
];

export function buildStoryPrompt(config: StoryConfig): string {
  const structure =
    storyStructures[Math.floor(Math.random() * storyStructures.length)];
  const setting = settings[Math.floor(Math.random() * settings.length)];

  return `You are a children's story writer creating a story for a 3-year-old boy named James.

STORY REQUIREMENTS:
- The main character is JAMES, a brave and curious 3-year-old boy
- Category/theme: ${config.theme}
- ${lengthInstructions[config.length]}
- ${timeInstructions[config.timeOfDay]}
- Story structure: ${structure}
- Setting: The story takes place in or near ${setting}

IMPORTANT RULES:
- James should be the hero of the story
- Everything must be 100% age-appropriate for a 3-year-old
- NO scary content, NO villains, NO danger that isn't immediately resolved
- Always have a HAPPY ending
- Use simple words a 3-year-old can understand
- Include fun sound effects in the narration (like "WHOOSH!", "ROAR!", "SPLASH!")
- Make it engaging and fun to read aloud
- Include repetition and rhythm where appropriate (kids love patterns!)
- Add moments where James shows kindness, bravery, or curiosity
- Never include any violence, even cartoon violence
- Characters should always be friendly and kind

FORMAT:
- Write ONLY the story text, no title or metadata
- Use paragraph breaks between sections
- Start with an engaging opening line
- Each paragraph should be 2-4 sentences max for easy read-aloud pacing

Write the story now:`;
}

// Fallback stories in case API is unavailable
export const fallbackStories: Record<string, string[]> = {
  dinosaurs: [
    `Once upon a time, James found a tiny green egg in his backyard. "What could be inside?" he wondered with big, curious eyes.

CRACK! CRACK! Out popped the cutest baby dinosaur James had ever seen! It had soft green scales and a wiggly tail. "RAWR!" said the little dinosaur, which really meant "Hello, friend!"

James giggled and gave the baby dinosaur a gentle pat. "I'll call you Tiny!" The baby dinosaur wagged its tail — SWISH, SWISH, SWISH!

James and Tiny played all day long. They played hide and seek in the garden. Tiny wasn't very good at hiding because his tail always stuck out! James laughed and laughed.

When the sun started to set, painting the sky orange and pink, Tiny yawned a big dinosaur yawn. James yawned too! "Time for sleep, Tiny," James said with a smile.

James gave Tiny the biggest, warmest hug. "You're my best friend," he whispered. And they both fell asleep under the twinkling stars, happy as can be.

The End.`,
  ],
  animals: [
    `James was walking through the sunny park when he heard a tiny sound. "Woof! Woof!" It was a fluffy little puppy with a wagging tail!

"Hi there, little puppy!" James knelt down and the puppy licked his nose. SLURP! James giggled so hard his tummy hurt.

The puppy wanted to play! It ran in circles — ZOOM ZOOM ZOOM! "Wait for me!" James called, running after the happy puppy.

They splashed in puddles — SPLASH! They rolled in the soft grass — WHOOSH! They played with a big red ball — BOUNCE, BOUNCE, BOUNCE!

James shared his apple slices with the puppy. CRUNCH, CRUNCH! The puppy loved them! "Good puppy!" said James, giving the softest pets.

As the clouds turned pink and fluffy in the evening sky, James scooped up the little puppy. "Let's go home," he said with the biggest smile.

And from that day on, James and his puppy were the very best of friends forever and ever.

The End.`,
  ],
  space: [
    `"3... 2... 1... BLAST OFF!" James zoomed up, up, UP in his rocket ship! WHOOOOSH! The rocket sparkled and glowed as it flew past the fluffy clouds.

"WOW!" said James, pressing his face against the window. He could see the whole world below — it looked like a beautiful blue marble!

The rocket flew past the moon. "Hello, Moon!" waved James. The moon seemed to smile back, all round and glowing.

Then James saw something amazing — a planet made of CANDY! Lollipop trees and chocolate mountains! Gumdrop flowers everywhere!

James landed his rocket — BUMP, BUMP, BOUNCE! A friendly little alien waved with all four of its arms. "Welcome, James! Want to play?"

They bounced on marshmallow trampolines — BOING! BOING! They slid down rainbow slides — WHEEE! They ate cotton candy clouds — YUM!

"This is the best day EVER!" laughed James. The alien gave James a sparkly star to take home. "So you always remember our fun day!" the alien said with a smile.

James flew back home in his rocket, holding his special star tight. He put it on his windowsill where it twinkled all night long.

The End.`,
  ],
};
