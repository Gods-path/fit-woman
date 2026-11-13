import { describe, it, expect } from "vitest";
import {
  computeBMI,
  computeBMR,
  computeTDEE,
  computeCalorieTarget,
  computeMacros,
  validateInput,
  buildNutritionPlan,
  ACTIVITY_FACTORS,
  CALORIE_FLOOR,
  type UserInput,
} from "./nutrition";

// Profil de base valide, réutilisé dans les tests.
const base: UserInput = {
  age: 32,
  taille: 165,
  poids: 80,
  poidsCible: 68,
  activite: "legere",
  pays: "Cameroun",
};

describe("computeBMR (Mifflin-St Jeor, femme)", () => {
  it("applique 10*poids + 6.25*taille - 5*age - 161", () => {
    // 10*80 + 6.25*165 - 5*32 - 161 = 800 + 1031.25 - 160 - 161 = 1510.25
    expect(computeBMR(80, 165, 32)).toBe(1510);
  });
});

describe("computeTDEE", () => {
  it("multiplie le BMR par le facteur d'activité", () => {
    expect(computeTDEE(1500, "sedentaire")).toBe(Math.round(1500 * 1.2));
    expect(computeTDEE(1500, "intense")).toBe(Math.round(1500 * 1.725));
  });

  it("utilise les bons facteurs d'activité", () => {
    expect(ACTIVITY_FACTORS).toEqual({
      sedentaire: 1.2,
      legere: 1.375,
      moderee: 1.55,
      intense: 1.725,
    });
  });
});

describe("computeBMI", () => {
  it("calcule poids / taille(m)^2", () => {
    // 80 / (1.65^2) = 29.38...
    expect(computeBMI(80, 165)).toBe(29.4);
  });
});

describe("computeCalorieTarget (déficit 20% + plancher)", () => {
  it("retire 20% quand le résultat reste au-dessus du plancher", () => {
    const { calories, plancherApplique } = computeCalorieTarget(2500);
    expect(calories).toBe(2000); // 2500 * 0.8
    expect(plancherApplique).toBe(false);
  });

  it("n'applique jamais moins de 1400 kcal", () => {
    const { calories, plancherApplique } = computeCalorieTarget(1500);
    // 1500 * 0.8 = 1200 → plancher à 1400
    expect(calories).toBe(CALORIE_FLOOR);
    expect(calories).toBe(1400);
    expect(plancherApplique).toBe(true);
  });

  it("applique le plancher pile à la limite", () => {
    // TDEE tel que 0.8*TDEE = 1400 → TDEE = 1750
    expect(computeCalorieTarget(1750).calories).toBe(1400);
    expect(computeCalorieTarget(1750).plancherApplique).toBe(false);
    // juste en dessous → plancher
    expect(computeCalorieTarget(1749).calories).toBe(1400);
    expect(computeCalorieTarget(1749).plancherApplique).toBe(true);
  });
});

describe("computeMacros", () => {
  it("protéines = 1.6 g/kg de poids cible", () => {
    const macros = computeMacros(1800, 68);
    expect(macros.proteinesG).toBe(Math.round(1.6 * 68)); // 109
  });

  it("lipides = 25% des calories (÷9)", () => {
    const macros = computeMacros(1800, 68);
    expect(macros.lipidesG).toBe(Math.round((1800 * 0.25) / 9)); // 50
  });

  it("glucides = le reste des calories (÷4)", () => {
    const macros = computeMacros(1800, 68);
    const proteinesKcal = Math.round(1.6 * 68) * 4;
    const lipidesKcal = 1800 * 0.25;
    const resteKcal = 1800 - proteinesKcal - lipidesKcal;
    expect(macros.glucidesG).toBe(Math.round(resteKcal / 4));
  });

  it("ne produit pas de glucides négatifs", () => {
    const macros = computeMacros(1400, 120); // protéines très élevées
    expect(macros.glucidesG).toBeGreaterThanOrEqual(0);
  });
});

// ----- GARDE-FOUS -----

describe("garde-fou : âge < 18 ans", () => {
  it("refuse le calcul pour une mineure", () => {
    const errors = validateInput({ ...base, age: 16 });
    expect(errors.some((e) => e.code === "AGE_MINEUR")).toBe(true);
  });

  it("autorise à 18 ans pile", () => {
    const errors = validateInput({ ...base, age: 18 });
    expect(errors.some((e) => e.code === "AGE_MINEUR")).toBe(false);
  });

  it("buildNutritionPlan lève une erreur pour une mineure", () => {
    expect(() => buildNutritionPlan({ ...base, age: 15 })).toThrow();
  });
});

describe("garde-fou : IMC actuel < 18,5", () => {
  it("refuse si l'IMC de départ est trop bas (message bienveillant)", () => {
    // 45 kg pour 170 cm → IMC ~15.6
    const errors = validateInput({ ...base, poids: 45, taille: 170, poidsCible: 44 });
    const err = errors.find((e) => e.code === "IMC_TROP_BAS");
    expect(err).toBeDefined();
    expect(err?.message.toLowerCase()).toContain("professionnel de santé");
  });

  it("autorise un IMC de départ normal", () => {
    const errors = validateInput(base); // IMC ~29.4
    expect(errors.some((e) => e.code === "IMC_TROP_BAS")).toBe(false);
  });
});

describe("garde-fou : poids cible menant à un IMC < 18,5", () => {
  it("refuse une cible trop basse", () => {
    // cible 48 kg pour 165 cm → IMC ~17.6
    const errors = validateInput({ ...base, poidsCible: 48 });
    expect(errors.some((e) => e.code === "CIBLE_TROP_BASSE")).toBe(true);
  });

  it("autorise une cible qui garde un IMC >= 18,5", () => {
    // cible 68 kg pour 165 cm → IMC ~25.0
    const errors = validateInput({ ...base, poidsCible: 68 });
    expect(errors.some((e) => e.code === "CIBLE_TROP_BASSE")).toBe(false);
  });
});

describe("garde-fou : champs invalides", () => {
  it("refuse des valeurs manquantes ou nulles", () => {
    const errors = validateInput({ ...base, taille: NaN });
    expect(errors.some((e) => e.code === "CHAMPS_INVALIDES")).toBe(true);
  });

  it("refuse un poids négatif", () => {
    const errors = validateInput({ ...base, poids: -5 });
    expect(errors.some((e) => e.code === "CHAMPS_INVALIDES")).toBe(true);
  });
});

describe("buildNutritionPlan (cas nominal)", () => {
  it("produit un plan cohérent et jamais sous 1400 kcal", () => {
    const plan = buildNutritionPlan(base);
    expect(plan.calories).toBeGreaterThanOrEqual(CALORIE_FLOOR);
    expect(plan.bmr).toBeGreaterThan(0);
    expect(plan.tdee).toBeGreaterThan(plan.bmr);
    expect(plan.macros.proteinesG).toBeGreaterThan(0);
  });

  it("respecte le plancher même pour un petit gabarit sédentaire", () => {
    const plan = buildNutritionPlan({
      age: 55,
      taille: 150,
      poids: 52,
      poidsCible: 48, // IMC cible ~21.3 → autorisé
      activite: "sedentaire",
      pays: "Sénégal",
    });
    expect(plan.calories).toBe(CALORIE_FLOOR);
    expect(plan.plancherApplique).toBe(true);
  });
});
