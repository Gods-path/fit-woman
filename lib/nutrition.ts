/**
 * Logique de calcul nutritionnel — isolée de l'interface React.
 *
 * ⚠️ Outil informatif uniquement. Les formules et facteurs sont des
 * estimations standards (Mifflin-St Jeor + facteurs d'activité). Elles
 * ne remplacent pas l'avis d'un professionnel de santé.
 */

export type ActivityLevel = "sedentaire" | "legere" | "moderee" | "intense";

export type Country =
  | "Cameroun"
  | "Côte d'Ivoire"
  | "Sénégal"
  | "Nigeria"
  | "Ghana";

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentaire: 1.2,
  legere: 1.375,
  moderee: 1.55,
  intense: 1.725,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentaire: "Sédentaire",
  legere: "Légère",
  moderee: "Modérée",
  intense: "Intense",
};

/** Seuils de sécurité — garde-fous. */
export const MIN_AGE = 18;
export const MIN_BMI = 18.5;
export const CALORIE_FLOOR = 1400; // plancher strict, jamais en dessous
export const DEFICIT_RATE = 0.2; // déficit de 20 %
export const PROTEIN_PER_KG = 1.6; // g / kg de poids cible
export const FAT_CALORIE_SHARE = 0.25; // 25 % des calories

export interface UserInput {
  age: number;
  /** taille en cm */
  taille: number;
  /** poids actuel en kg */
  poids: number;
  /** poids cible en kg */
  poidsCible: number;
  activite: ActivityLevel;
  pays: Country;
}

export type GuardCode =
  | "AGE_MINEUR"
  | "IMC_TROP_BAS"
  | "CIBLE_TROP_BASSE"
  | "CHAMPS_INVALIDES";

export interface GuardError {
  code: GuardCode;
  message: string;
}

export interface Macros {
  proteinesG: number;
  lipidesG: number;
  glucidesG: number;
  proteinesKcal: number;
  lipidesKcal: number;
  glucidesKcal: number;
}

export interface NutritionResult {
  bmr: number;
  tdee: number;
  imc: number;
  imcCible: number;
  /** objectif calorique quotidien, plancher appliqué */
  calories: number;
  /** vrai si le plancher de 1400 kcal a été appliqué */
  plancherApplique: boolean;
  macros: Macros;
}

/** Arrondi à n décimales (évite les flottants bruités). */
function round(value: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/** Indice de masse corporelle : poids (kg) / taille (m)². */
export function computeBMI(poids: number, tailleCm: number): number {
  const m = tailleCm / 100;
  return round(poids / (m * m), 1);
}

/** Métabolisme de base — Mifflin-St Jeor (femme). */
export function computeBMR(poids: number, tailleCm: number, age: number): number {
  return round(10 * poids + 6.25 * tailleCm - 5 * age - 161, 0);
}

/** Dépense énergétique totale = BMR × facteur d'activité. */
export function computeTDEE(bmr: number, activite: ActivityLevel): number {
  return round(bmr * ACTIVITY_FACTORS[activite], 0);
}

/**
 * Objectif calorique = TDEE − 20 %, avec PLANCHER STRICT à 1400 kcal.
 * Retourne aussi si le plancher a dû être appliqué.
 */
export function computeCalorieTarget(tdee: number): {
  calories: number;
  plancherApplique: boolean;
} {
  const brut = tdee * (1 - DEFICIT_RATE);
  if (brut < CALORIE_FLOOR) {
    return { calories: CALORIE_FLOOR, plancherApplique: true };
  }
  return { calories: round(brut, 0), plancherApplique: false };
}

/**
 * Macros :
 *  - protéines : 1,6 g / kg de poids cible
 *  - lipides   : 25 % des calories
 *  - glucides  : le reste des calories
 */
export function computeMacros(calories: number, poidsCible: number): Macros {
  const proteinesG = round(PROTEIN_PER_KG * poidsCible, 0);
  const proteinesKcal = proteinesG * 4;

  const lipidesKcal = calories * FAT_CALORIE_SHARE;
  const lipidesG = round(lipidesKcal / 9, 0);

  const glucidesKcal = Math.max(0, calories - proteinesKcal - lipidesKcal);
  const glucidesG = round(glucidesKcal / 4, 0);

  return {
    proteinesG,
    lipidesG,
    glucidesG,
    proteinesKcal: round(proteinesKcal, 0),
    lipidesKcal: round(lipidesKcal, 0),
    glucidesKcal: round(glucidesKcal, 0),
  };
}

/**
 * Garde-fous (implémentés, pas seulement affichés).
 * Retourne la liste des blocages ; vide = calcul autorisé.
 */
export function validateInput(input: UserInput): GuardError[] {
  const errors: GuardError[] = [];
  const { age, taille, poids, poidsCible } = input;

  // Champs manquants ou aberrants → on ne calcule rien.
  const champsValides =
    Number.isFinite(age) &&
    Number.isFinite(taille) &&
    Number.isFinite(poids) &&
    Number.isFinite(poidsCible) &&
    taille > 0 &&
    poids > 0 &&
    poidsCible > 0 &&
    age > 0;

  if (!champsValides) {
    errors.push({
      code: "CHAMPS_INVALIDES",
      message:
        "Merci de renseigner des valeurs valides pour l'âge, la taille et les poids.",
    });
    return errors; // inutile d'aller plus loin tant que les données ne tiennent pas
  }

  // Âge minimum.
  if (age < MIN_AGE) {
    errors.push({
      code: "AGE_MINEUR",
      message:
        "Cet outil est conçu pour les personnes de 18 ans et plus. Pour les plus jeunes, l'accompagnement d'un professionnel de santé est indispensable.",
    });
  }

  // IMC actuel trop bas → message bienveillant.
  const imc = computeBMI(poids, taille);
  if (imc < MIN_BMI) {
    errors.push({
      code: "IMC_TROP_BAS",
      message:
        "Votre IMC actuel est déjà inférieur au seuil recommandé. Une perte de poids n'est pas indiquée ici. Nous vous invitons à échanger avec un professionnel de santé, qui saura vous accompagner avec bienveillance.",
    });
  }

  // Poids cible qui mènerait à un IMC trop bas.
  const imcCible = computeBMI(poidsCible, taille);
  if (imcCible < MIN_BMI) {
    errors.push({
      code: "CIBLE_TROP_BASSE",
      message:
        "Le poids cible choisi correspondrait à un IMC trop bas pour votre santé. Choisissons ensemble un objectif plus doux, ou parlez-en à un professionnel de santé.",
    });
  }

  return errors;
}

/**
 * Calcule le plan complet. Lève une erreur si les garde-fous bloquent :
 * la validation DOIT être faite en amont via validateInput().
 */
export function buildNutritionPlan(input: UserInput): NutritionResult {
  const errors = validateInput(input);
  if (errors.length > 0) {
    throw new Error(
      `Calcul refusé par les garde-fous : ${errors.map((e) => e.code).join(", ")}`
    );
  }

  const { poids, taille, age, poidsCible, activite } = input;

  const bmr = computeBMR(poids, taille, age);
  const tdee = computeTDEE(bmr, activite);
  const { calories, plancherApplique } = computeCalorieTarget(tdee);
  const macros = computeMacros(calories, poidsCible);

  return {
    bmr,
    tdee,
    imc: computeBMI(poids, taille),
    imcCible: computeBMI(poidsCible, taille),
    calories,
    plancherApplique,
    macros,
  };
}
