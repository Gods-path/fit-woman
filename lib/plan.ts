import type { Country } from "./nutrition";
import {
  DISHES,
  EXERCISES,
  type Dish,
  type Exercise,
  type MealType,
} from "./data";

/**
 * Construction du menu type et des séances de sport à partir des données
 * en dur. Logique pure (déterministe) pour être testable facilement.
 */

export interface MenuItem {
  repas: MealType;
  dish: Dish;
}

const MEAL_ORDER: MealType[] = [
  "petit-dejeuner",
  "dejeuner",
  "diner",
  "collation",
];

/** Plats disponibles dans un pays pour un type de repas donné. */
export function dishesFor(pays: Country, repas: MealType): Dish[] {
  return DISHES.filter(
    (d) => d.pays.includes(pays) && d.repas.includes(repas)
  );
}

/**
 * Menu type sur une journée pour le pays choisi : un plat par repas.
 * `seed` permet de varier le choix de façon déterministe (ex. jour).
 */
export function buildMenu(pays: Country, seed = 0): MenuItem[] {
  const menu: MenuItem[] = [];
  MEAL_ORDER.forEach((repas, i) => {
    const options = dishesFor(pays, repas);
    if (options.length === 0) return;
    const dish = options[(seed + i) % options.length];
    menu.push({ repas, dish });
  });
  return menu;
}

/** Total calorique estimé d'un menu. */
export function menuCalories(menu: MenuItem[]): number {
  return menu.reduce((sum, item) => sum + item.dish.kcal, 0);
}

export interface Workout {
  titre: string;
  objectif: string;
  dureeMin: number;
  exercices: Exercise[];
}

function pick(ids: string[]): Exercise[] {
  return ids
    .map((id) => EXERCISES.find((e) => e.id === id))
    .filter((e): e is Exercise => Boolean(e));
}

/**
 * Trois séances maison, sans matériel, niveau débutant (20–30 min).
 */
export function buildWorkouts(): Workout[] {
  return [
    {
      titre: "Séance 1 — Bas du corps en douceur",
      objectif: "Renforcer jambes et fessiers",
      dureeMin: 25,
      exercices: pick([
        "marche-sur-place",
        "squats",
        "fentes",
        "pont-fessier",
        "etirements",
      ]),
    },
    {
      titre: "Séance 2 — Cardio léger à la maison",
      objectif: "Activer le cœur et la respiration",
      dureeMin: 20,
      exercices: pick([
        "marche-sur-place",
        "montees-genoux",
        "talons-fesses",
        "squats",
        "etirements",
      ]),
    },
    {
      titre: "Séance 3 — Haut du corps & gainage",
      objectif: "Tonifier buste, bras et sangle abdominale",
      dureeMin: 25,
      exercices: pick([
        "marche-sur-place",
        "pompes-genoux",
        "gainage",
        "superman",
        "etirements",
      ]),
    },
  ];
}
