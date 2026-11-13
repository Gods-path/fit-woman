import type { Country } from "./nutrition";

/**
 * Données en dur : plats africains et exercices.
 *
 * ⚠️ IMPORTANT : toutes les valeurs caloriques et de macros ci-dessous
 * sont des ESTIMATIONS APPROXIMATIVES pour une portion « type ». Elles
 * varient fortement selon la recette, l'huile utilisée et la quantité.
 * Ces chiffres sont à valider avec un·e diététicien·ne / nutritionniste
 * avant tout usage réel. Rien n'est présenté comme une mesure exacte.
 */

export type MealType =
  | "petit-dejeuner"
  | "dejeuner"
  | "diner"
  | "collation";

export const MEAL_LABELS: Record<MealType, string> = {
  "petit-dejeuner": "Petit-déjeuner",
  dejeuner: "Déjeuner",
  diner: "Dîner",
  collation: "Collation",
};

export interface Dish {
  id: string;
  nom: string;
  /** description courte de la portion type */
  portion: string;
  pays: Country[];
  repas: MealType[];
  /** estimations pour la portion décrite */
  kcal: number;
  proteines: number; // g
  lipides: number; // g
  glucides: number; // g
}

/**
 * Base de plats (valeurs estimées, à valider).
 * Chaque plat est associé aux pays où il est couramment consommé.
 */
export const DISHES: Dish[] = [
  // ----- Petits-déjeuners / bouillies -----
  {
    id: "bouillie-mil",
    nom: "Bouillie de mil (non sucrée)",
    portion: "1 bol (~300 ml)",
    pays: ["Sénégal", "Nigeria", "Cameroun"],
    repas: ["petit-dejeuner"],
    kcal: 210,
    proteines: 6,
    lipides: 3,
    glucides: 40,
  },
  {
    id: "pap-mais",
    nom: "Bouillie de maïs (ogi / akamu / koko)",
    portion: "1 bol (~300 ml)",
    pays: ["Nigeria", "Ghana", "Cameroun", "Côte d'Ivoire"],
    repas: ["petit-dejeuner"],
    kcal: 180,
    proteines: 4,
    lipides: 2,
    glucides: 38,
  },
  {
    id: "akara",
    nom: "Beignets de haricot (akara / accara)",
    portion: "3 beignets",
    pays: ["Nigeria", "Sénégal", "Ghana", "Côte d'Ivoire", "Cameroun"],
    repas: ["petit-dejeuner", "collation"],
    kcal: 250,
    proteines: 10,
    lipides: 14,
    glucides: 22,
  },
  {
    id: "pain-omelette",
    nom: "Pain complet + omelette aux légumes",
    portion: "1/4 baguette + 2 œufs",
    pays: ["Cameroun", "Côte d'Ivoire", "Sénégal", "Nigeria", "Ghana"],
    repas: ["petit-dejeuner"],
    kcal: 320,
    proteines: 18,
    lipides: 16,
    glucides: 26,
  },
  {
    id: "plantain-oeuf",
    nom: "Plantain mûr bouilli + œuf",
    portion: "1/2 plantain + 1 œuf",
    pays: ["Cameroun", "Ghana", "Nigeria", "Côte d'Ivoire"],
    repas: ["petit-dejeuner"],
    kcal: 260,
    proteines: 9,
    lipides: 8,
    glucides: 38,
  },

  // ----- Plats principaux (déjeuner / dîner) -----
  {
    id: "ndole-plantain",
    nom: "Ndolé + plantain mûr",
    portion: "1 assiette",
    pays: ["Cameroun"],
    repas: ["dejeuner", "diner"],
    kcal: 520,
    proteines: 28,
    lipides: 24,
    glucides: 48,
  },
  {
    id: "eru-fufu",
    nom: "Eru + water fufu",
    portion: "1 assiette",
    pays: ["Cameroun"],
    repas: ["dejeuner", "diner"],
    kcal: 500,
    proteines: 22,
    lipides: 22,
    glucides: 52,
  },
  {
    id: "poulet-dg",
    nom: "Poulet DG (plantain, légumes)",
    portion: "1 assiette",
    pays: ["Cameroun"],
    repas: ["dejeuner", "diner"],
    kcal: 640,
    proteines: 34,
    lipides: 30,
    glucides: 56,
  },
  {
    id: "attieke-poisson",
    nom: "Attiéké + poisson braisé",
    portion: "1 assiette",
    pays: ["Côte d'Ivoire"],
    repas: ["dejeuner", "diner"],
    kcal: 480,
    proteines: 30,
    lipides: 16,
    glucides: 54,
  },
  {
    id: "kedjenou",
    nom: "Kedjenou de poulet + attiéké",
    portion: "1 assiette",
    pays: ["Côte d'Ivoire"],
    repas: ["dejeuner", "diner"],
    kcal: 420,
    proteines: 32,
    lipides: 14,
    glucides: 40,
  },
  {
    id: "sauce-graine",
    nom: "Sauce graine + riz",
    portion: "1 assiette",
    pays: ["Côte d'Ivoire", "Cameroun"],
    repas: ["dejeuner", "diner"],
    kcal: 540,
    proteines: 24,
    lipides: 26,
    glucides: 52,
  },
  {
    id: "foutou-sauce",
    nom: "Foutou igname + sauce claire",
    portion: "1 assiette",
    pays: ["Côte d'Ivoire"],
    repas: ["dejeuner", "diner"],
    kcal: 500,
    proteines: 20,
    lipides: 14,
    glucides: 72,
  },
  {
    id: "thieboudienne",
    nom: "Thiéboudienne (riz au poisson)",
    portion: "1 assiette",
    pays: ["Sénégal"],
    repas: ["dejeuner", "diner"],
    kcal: 600,
    proteines: 30,
    lipides: 20,
    glucides: 78,
  },
  {
    id: "yassa-poulet",
    nom: "Yassa poulet (oignons, citron) + riz",
    portion: "1 assiette",
    pays: ["Sénégal"],
    repas: ["dejeuner", "diner"],
    kcal: 470,
    proteines: 30,
    lipides: 16,
    glucides: 50,
  },
  {
    id: "mafe",
    nom: "Mafé (sauce arachide) + riz",
    portion: "1 assiette",
    pays: ["Sénégal", "Côte d'Ivoire"],
    repas: ["dejeuner", "diner"],
    kcal: 560,
    proteines: 26,
    lipides: 28,
    glucides: 52,
  },
  {
    id: "sauce-arachide",
    nom: "Sauce arachide + igname pilée",
    portion: "1 assiette",
    pays: ["Nigeria", "Ghana", "Cameroun"],
    repas: ["dejeuner", "diner"],
    kcal: 550,
    proteines: 24,
    lipides: 26,
    glucides: 56,
  },
  {
    id: "riz-jollof",
    nom: "Riz jollof + poulet grillé",
    portion: "1 assiette",
    pays: ["Nigeria", "Ghana"],
    repas: ["dejeuner", "diner"],
    kcal: 520,
    proteines: 28,
    lipides: 18,
    glucides: 62,
  },
  {
    id: "egusi-fufu",
    nom: "Soupe egusi + fufu",
    portion: "1 assiette",
    pays: ["Nigeria"],
    repas: ["dejeuner", "diner"],
    kcal: 600,
    proteines: 28,
    lipides: 32,
    glucides: 50,
  },
  {
    id: "banku-tilapia",
    nom: "Banku + tilapia grillé + sauce pimentée",
    portion: "1 assiette",
    pays: ["Ghana"],
    repas: ["dejeuner", "diner"],
    kcal: 520,
    proteines: 30,
    lipides: 16,
    glucides: 62,
  },
  {
    id: "waakye",
    nom: "Waakye (riz-haricots) + sauce",
    portion: "1 assiette",
    pays: ["Ghana"],
    repas: ["dejeuner", "diner"],
    kcal: 480,
    proteines: 18,
    lipides: 12,
    glucides: 74,
  },
  {
    id: "kenkey-poisson",
    nom: "Kenkey + poisson + sauce tomate",
    portion: "1 assiette",
    pays: ["Ghana"],
    repas: ["dejeuner", "diner"],
    kcal: 500,
    proteines: 24,
    lipides: 14,
    glucides: 70,
  },
  {
    id: "poisson-braise-alloco",
    nom: "Poisson braisé + alloco",
    portion: "1 assiette",
    pays: ["Côte d'Ivoire", "Cameroun", "Nigeria", "Ghana", "Sénégal"],
    repas: ["dejeuner", "diner"],
    kcal: 500,
    proteines: 30,
    lipides: 20,
    glucides: 48,
  },
  {
    id: "foufou-sauce-gombo",
    nom: "Foufou + sauce gombo",
    portion: "1 assiette",
    pays: ["Cameroun", "Côte d'Ivoire", "Nigeria"],
    repas: ["dejeuner", "diner"],
    kcal: 460,
    proteines: 18,
    lipides: 12,
    glucides: 70,
  },
  {
    id: "soupe-legumes-poisson",
    nom: "Soupe de légumes verts + poisson (léger)",
    portion: "1 grand bol",
    pays: ["Cameroun", "Côte d'Ivoire", "Sénégal", "Nigeria", "Ghana"],
    repas: ["dejeuner", "diner"],
    kcal: 320,
    proteines: 28,
    lipides: 12,
    glucides: 24,
  },

  // ----- Collations / boissons -----
  {
    id: "bissap",
    nom: "Bissap non sucré (hibiscus)",
    portion: "1 verre (250 ml)",
    pays: ["Sénégal", "Côte d'Ivoire", "Cameroun", "Nigeria", "Ghana"],
    repas: ["collation"],
    kcal: 15,
    proteines: 0,
    lipides: 0,
    glucides: 3,
  },
  {
    id: "arachides-grillees",
    nom: "Arachides grillées (sans sel ajouté)",
    portion: "1 petite poignée (25 g)",
    pays: ["Sénégal", "Nigeria", "Cameroun", "Côte d'Ivoire", "Ghana"],
    repas: ["collation"],
    kcal: 150,
    proteines: 7,
    lipides: 12,
    glucides: 5,
  },
  {
    id: "mangue",
    nom: "Mangue fraîche",
    portion: "1 fruit moyen",
    pays: ["Sénégal", "Nigeria", "Cameroun", "Côte d'Ivoire", "Ghana"],
    repas: ["collation"],
    kcal: 100,
    proteines: 1,
    lipides: 0,
    glucides: 25,
  },
  {
    id: "papaye",
    nom: "Papaye fraîche",
    portion: "1 part (~150 g)",
    pays: ["Cameroun", "Côte d'Ivoire", "Nigeria", "Ghana", "Sénégal"],
    repas: ["collation"],
    kcal: 60,
    proteines: 1,
    lipides: 0,
    glucides: 15,
  },
  {
    id: "yaourt-nature",
    nom: "Yaourt nature + quelques cacahuètes",
    portion: "1 pot + 10 g",
    pays: ["Sénégal", "Nigeria", "Cameroun", "Côte d'Ivoire", "Ghana"],
    repas: ["collation"],
    kcal: 150,
    proteines: 9,
    lipides: 7,
    glucides: 13,
  },
];

// ----- Exercices (séances maison, sans matériel) -----

export interface Exercise {
  id: string;
  nom: string;
  description: string;
  /** ex. "3 séries de 12" ou "3 × 30 s" */
  prescription: string;
}

/** ⚠️ Repères d'intensité indicatifs, à adapter à votre ressenti. */
export const EXERCISES: Exercise[] = [
  {
    id: "marche-sur-place",
    nom: "Marche active sur place",
    description: "Montez bien les genoux, balancez les bras. Idéal pour s'échauffer.",
    prescription: "3 min en continu",
  },
  {
    id: "squats",
    nom: "Squats (flexions de jambes)",
    description:
      "Pieds largeur du bassin, descendez comme pour vous asseoir, dos droit.",
    prescription: "3 séries de 12",
  },
  {
    id: "fentes",
    nom: "Fentes avant alternées",
    description: "Un grand pas en avant, genou arrière vers le sol, puis on remonte.",
    prescription: "3 séries de 10 par jambe",
  },
  {
    id: "pont-fessier",
    nom: "Pont fessier",
    description: "Allongée sur le dos, pieds au sol, soulevez le bassin, serrez les fessiers.",
    prescription: "3 séries de 15",
  },
  {
    id: "pompes-genoux",
    nom: "Pompes sur les genoux",
    description: "Appui sur les genoux, descendez la poitrine vers le sol, coudes vers l'arrière.",
    prescription: "3 séries de 8",
  },
  {
    id: "gainage",
    nom: "Gainage (planche)",
    description: "Appui sur les avant-bras et les pointes de pied, corps bien aligné.",
    prescription: "3 × 20 à 30 s",
  },
  {
    id: "montees-genoux",
    nom: "Montées de genoux dynamiques",
    description: "Sur place, montez les genoux à hauteur de hanche à un rythme soutenu.",
    prescription: "3 × 30 s",
  },
  {
    id: "talons-fesses",
    nom: "Talons-fesses",
    description: "Sur place, ramenez les talons vers les fessiers en rythme.",
    prescription: "3 × 30 s",
  },
  {
    id: "superman",
    nom: "Superman (extension dorsale)",
    description: "À plat ventre, soulevez bras et jambes simultanément, puis relâchez.",
    prescription: "3 séries de 12",
  },
  {
    id: "etirements",
    nom: "Étirements doux (retour au calme)",
    description: "Étirez cuisses, dos et épaules lentement, en respirant profondément.",
    prescription: "3 à 5 min",
  },
];
