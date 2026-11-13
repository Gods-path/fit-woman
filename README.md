# Mon équilibre — prototype bien-être au féminin

Prototype web d'accompagnement vers un poids d'équilibre, pensé pour les
femmes africaines (Cameroun, Côte d'Ivoire, Sénégal, Nigeria, Ghana).

> ⚠️ **C'est un TEST, pas un produit.** Aucune base de données, aucune
> authentification, aucun paiement. Tout tourne côté client.
>
> ⚕️ **Outil informatif uniquement.** Il ne remplace pas l'avis d'un·e
> professionnel·le de santé. Les valeurs nutritionnelles des plats sont des
> **estimations approximatives à valider**.

## Ce que fait l'application

1. **Écran 1 — formulaire** : âge, taille, poids actuel, poids souhaité,
   niveau d'activité, pays.
2. **Écran 2 — résultat** affiché après validation :
   - **Besoin calorique quotidien** : BMR (Mifflin-St Jeor, femme) → TDEE
     (× facteur d'activité) → objectif (TDEE − 20 %, **plancher strict
     1400 kcal**).
   - **Macros** : protéines 1,6 g/kg de poids cible, lipides 25 % des
     calories, glucides = le reste.
   - **Menu type** du jour avec des plats réellement consommés dans le pays
     choisi (petit-déjeuner, déjeuner, dîner, collation) et leurs calories.
   - **3 séances maison** sans matériel, 20–30 min, niveau débutant.

## Garde-fous (implémentés, pas seulement affichés)

Dans [`lib/nutrition.ts`](lib/nutrition.ts) → `validateInput()` :

- Calcul **refusé si l'âge < 18 ans**.
- Calcul **refusé si l'IMC actuel < 18,5** (message bienveillant orientant
  vers un professionnel de santé).
- **Poids cible refusé** s'il mène à un IMC < 18,5.
- **Jamais sous 1400 kcal**, quel que soit le calcul (plancher dans
  `computeCalorieTarget()`).
- Avertissement médical visible sur les deux écrans.
- Aucun vocabulaire culpabilisant : pas d'aliment « interdit » ou « mauvais ».

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- Aucune dépendance externe hors Next.js et Tailwind (les seules
  `devDependencies` servent aux tests et au build : Vitest, types,
  PostCSS/Autoprefixer).
- Déployable sur **Vercel sans configuration ni variable d'environnement**.

## Structure

```
app/
  layout.tsx          Racine HTML + métadonnées
  page.tsx            Orchestration des 2 écrans (état client)
  globals.css         Tailwind + styles de base
components/
  Form.tsx            Écran 1 (formulaire + affichage des garde-fous)
  Result.tsx          Écran 2 (calories, macros, menu, séances)
  MedicalDisclaimer.tsx
lib/
  nutrition.ts        Logique de calcul + garde-fous (isolée du React)
  plan.ts             Construction du menu type et des séances
  data.ts             Données en dur : plats par pays + exercices
  nutrition.test.ts   Tests des calculs et de chaque garde-fou
  plan.test.ts        Tests du menu et des séances
```

La logique de calcul est **isolée dans `lib/`**, séparée des composants React.

## Lancer en local

Prérequis : Node.js 18.18+ (ou 20+).

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000. Tester en **360 px de large**
(mobile-first) via les outils de développement du navigateur.

## Tests

```bash
npm test          # exécute les tests une fois
npm run test:watch
```

Les tests couvrent les calculs (BMR, TDEE, IMC, objectif calorique, macros)
et **chaque garde-fou** (âge < 18, IMC < 18,5, cible trop basse, plancher
1400 kcal, champs invalides).

## Déploiement sur Vercel

1. Pousser le projet sur un dépôt Git (GitHub/GitLab/Bitbucket).
2. Sur [vercel.com](https://vercel.com), **New Project → Import** le dépôt.
3. Vercel détecte Next.js automatiquement : **aucune configuration** ni
   variable d'environnement n'est nécessaire.
4. Cliquer sur **Deploy**.

Alternative en ligne de commande :

```bash
npm i -g vercel
vercel          # déploiement de prévisualisation
vercel --prod   # déploiement en production
```

## Limites assumées (prototype)

- Valeurs nutritionnelles **approximatives**, à valider par un·e
  diététicien·ne.
- Pas de persistance : les données saisies ne sont pas enregistrées.
- Le menu est un **exemple** déterministe, pas une prescription.
