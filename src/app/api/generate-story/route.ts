import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildStoryPrompt, fallbackStories } from "@/lib/storyPrompts";
import type { StoryLength, TimeOfDay } from "@/lib/storyPrompts";

export async function POST(request: NextRequest) {
  try {
    const { category, theme, length, timeOfDay } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return a fallback story if no API key
      const stories = fallbackStories[category] || fallbackStories["dinosaurs"];
      const story = stories[Math.floor(Math.random() * stories.length)];
      return NextResponse.json({ story, source: "fallback" });
    }

    const client = new Anthropic({ apiKey });

    const prompt = buildStoryPrompt({
      category,
      theme,
      length: length as StoryLength,
      timeOfDay: timeOfDay as TimeOfDay,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const story =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ story, source: "claude" });
  } catch (error) {
    console.error("Story generation error:", error);
    // Return fallback on any error
    const fallback =
      fallbackStories["dinosaurs"]?.[0] || "Once upon a time, James had a wonderful adventure. The End.";
    return NextResponse.json({ story: fallback, source: "fallback" });
  }
}
