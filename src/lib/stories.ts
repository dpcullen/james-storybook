import type { StoryEntry } from "./storyEngine";
import { dinosaurStories } from "./stories/dinosaurs";
import { animalStories } from "./stories/animals";
import { carStories } from "./stories/cars";
import { constructionStories } from "./stories/construction";
import { farmStories } from "./stories/farm";
import { spaceStories } from "./stories/space";
import { airplaneStories } from "./stories/airplanes";
import { oceanStories } from "./stories/ocean";
import { castleStories } from "./stories/castle";
import { superheroStories } from "./stories/superheroes";
import { trainStories } from "./stories/trains";
import { bugStories } from "./stories/bugs";

export const allStories: Record<string, StoryEntry[]> = {
  dinosaurs: dinosaurStories,
  animals: animalStories,
  cars: carStories,
  construction: constructionStories,
  farm: farmStories,
  space: spaceStories,
  airplanes: airplaneStories,
  ocean: oceanStories,
  castle: castleStories,
  superheroes: superheroStories,
  trains: trainStories,
  bugs: bugStories,
};
