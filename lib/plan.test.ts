import { describe, it, expect } from "vitest";
import { buildMenu, buildWorkouts, dishesFor, menuCalories } from "./plan";
import type { Country } from "./nutrition";

const PAYS: Country[] = [
  "Cameroun",
  "Côte d'Ivoire",
  "Sénégal",
  "Nigeria",
  "Ghana",
];

describe("buildMenu", () => {
  it("propose un plat pour chaque repas, dans chaque pays", () => {
    for (const pays of PAYS) {
      const menu = buildMenu(pays);
      const repas = menu.map((m) => m.repas);
      expect(repas).toContain("petit-dejeuner");
      expect(repas).toContain("dejeuner");
      expect(repas).toContain("diner");
      expect(repas).toContain("collation");
    }
  });

  it("ne propose que des plats du pays choisi", () => {
    for (const pays of PAYS) {
      for (const item of buildMenu(pays)) {
        expect(item.dish.pays).toContain(pays);
      }
    }
  });

  it("le total calorique du menu est positif", () => {
    expect(menuCalories(buildMenu("Nigeria"))).toBeGreaterThan(0);
  });
});

describe("dishesFor", () => {
  it("trouve des plats de déjeuner pour chaque pays", () => {
    for (const pays of PAYS) {
      expect(dishesFor(pays, "dejeuner").length).toBeGreaterThan(0);
    }
  });
});

describe("buildWorkouts", () => {
  it("retourne 3 séances de 20 à 30 min avec des exercices", () => {
    const workouts = buildWorkouts();
    expect(workouts).toHaveLength(3);
    for (const w of workouts) {
      expect(w.dureeMin).toBeGreaterThanOrEqual(20);
      expect(w.dureeMin).toBeLessThanOrEqual(30);
      expect(w.exercices.length).toBeGreaterThan(0);
    }
  });
});
