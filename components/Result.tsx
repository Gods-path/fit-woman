"use client";

import {
  buildNutritionPlan,
  ACTIVITY_LABELS,
  type UserInput,
} from "@/lib/nutrition";
import { buildMenu, buildWorkouts, menuCalories } from "@/lib/plan";
import { MEAL_LABELS } from "@/lib/data";
import MedicalDisclaimer from "./MedicalDisclaimer";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-foret/10 bg-creme p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foret-dark">{title}</h2>
      {children}
    </section>
  );
}

function Stat({
  value,
  unit,
  label,
}: {
  value: string | number;
  unit?: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-sable px-4 py-3 text-center">
      <div className="text-2xl font-extrabold text-terracotta-dark">
        {value}
        {unit && <span className="ml-0.5 text-sm font-semibold">{unit}</span>}
      </div>
      <div className="mt-0.5 text-xs font-medium text-foret/70">{label}</div>
    </div>
  );
}

export default function Result({
  input,
  onReset,
}: {
  input: UserInput;
  onReset: () => void;
}) {
  const plan = buildNutritionPlan(input);
  const menu = buildMenu(input.pays);
  const workouts = buildWorkouts();
  const totalMenu = menuCalories(menu);

  const macros = [
    {
      nom: "Protéines",
      g: plan.macros.proteinesG,
      kcal: plan.macros.proteinesKcal,
      couleur: "bg-foret",
    },
    {
      nom: "Lipides",
      g: plan.macros.lipidesG,
      kcal: plan.macros.lipidesKcal,
      couleur: "bg-ocre",
    },
    {
      nom: "Glucides",
      g: plan.macros.glucidesG,
      kcal: plan.macros.glucidesKcal,
      couleur: "bg-terracotta",
    },
  ];
  const totalMacroKcal =
    plan.macros.proteinesKcal +
    plan.macros.lipidesKcal +
    plan.macros.glucidesKcal;

  return (
    <div className="space-y-5">
      <MedicalDisclaimer compact />

      {/* 1. Besoin calorique */}
      <Card title="Votre repère calorique du jour">
        <div className="mb-4 rounded-2xl bg-terracotta/10 px-5 py-4 text-center">
          <div className="text-4xl font-extrabold text-terracotta-dark">
            {plan.calories}
            <span className="ml-1 text-lg font-bold">kcal</span>
          </div>
          <div className="mt-1 text-sm text-foret/70">
            objectif quotidien indicatif
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat value={plan.bmr} unit="kcal" label="Métabolisme de base" />
          <Stat value={plan.tdee} unit="kcal" label="Dépense totale" />
          <Stat value={plan.imc} label="IMC actuel" />
        </div>

        {plan.plancherApplique && (
          <p className="mt-4 rounded-xl bg-foret/5 px-4 py-3 text-sm leading-snug text-foret-dark">
            💚 Pour préserver votre énergie et votre santé, nous maintenons un{" "}
            <strong>plancher de 1400 kcal</strong> : descendre plus bas n'est
            pas recommandé. La régularité compte plus que la privation.
          </p>
        )}
      </Card>

      {/* 2. Macros */}
      <Card title="Votre équilibre en macronutriments">
        <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full">
          {macros.map((m) => (
            <div
              key={m.nom}
              className={m.couleur}
              style={{
                width: `${
                  totalMacroKcal > 0 ? (m.kcal / totalMacroKcal) * 100 : 0
                }%`,
              }}
              title={`${m.nom} : ${m.kcal} kcal`}
            />
          ))}
        </div>
        <div className="space-y-2">
          {macros.map((m) => (
            <div
              key={m.nom}
              className="flex items-center justify-between rounded-xl bg-sable px-4 py-2.5"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-foret-dark">
                <span className={`h-3 w-3 rounded-full ${m.couleur}`} />
                {m.nom}
              </span>
              <span className="text-sm text-foret/80">
                <strong>{m.g} g</strong>
                <span className="mx-1 text-foret/40">·</span>
                {m.kcal} kcal
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Menu type */}
      <Card title={`Un menu type — saveurs ${prepositionPays(input.pays)}`}>
        <div className="space-y-3">
          {menu.map((item) => (
            <div
              key={item.repas}
              className="rounded-2xl border border-foret/10 bg-white p-4"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-ocre-dark">
                  {MEAL_LABELS[item.repas]}
                </span>
                <span className="text-sm font-semibold text-terracotta-dark">
                  {item.dish.kcal} kcal
                </span>
              </div>
              <div className="font-semibold text-foret-dark">
                {item.dish.nom}
              </div>
              <div className="text-sm text-foret/60">{item.dish.portion}</div>
              <div className="mt-1.5 text-xs text-foret/60">
                P {item.dish.proteines} g · L {item.dish.lipides} g · G{" "}
                {item.dish.glucides} g
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-foret/70">
          Total estimé du menu :{" "}
          <strong className="text-foret-dark">{totalMenu} kcal</strong>. Ce sont
          des plats du quotidien : aucun n'est « interdit », tout est une
          question de portion et de régularité.
        </p>
      </Card>

      {/* 4. Séances de sport */}
      <Card title="3 séances maison, sans matériel">
        <div className="space-y-4">
          {workouts.map((w) => (
            <div
              key={w.titre}
              className="rounded-2xl border border-foret/10 bg-white p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-bold text-foret-dark">{w.titre}</h3>
                <span className="whitespace-nowrap rounded-full bg-foret/10 px-2.5 py-1 text-xs font-semibold text-foret-dark">
                  ~{w.dureeMin} min
                </span>
              </div>
              <p className="mb-3 text-sm text-foret/70">{w.objectif}</p>
              <ul className="space-y-2">
                {w.exercices.map((ex) => (
                  <li key={ex.id} className="text-sm">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-foret-dark">
                        {ex.nom}
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium text-terracotta-dark">
                        {ex.prescription}
                      </span>
                    </div>
                    <p className="text-xs leading-snug text-foret/60">
                      {ex.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <p className="px-2 text-center text-xs leading-relaxed text-foret/60">
        Les valeurs caloriques des plats sont des estimations approximatives, à
        valider avec un·e professionnel·le. Écoutez votre corps et avancez à
        votre rythme, avec bienveillance.
      </p>

      <button
        onClick={onReset}
        className="w-full rounded-xl border border-terracotta bg-white px-6 py-4 text-base font-bold text-terracotta-dark transition hover:bg-terracotta/5 active:scale-[0.99]"
      >
        ← Modifier mes informations
      </button>
    </div>
  );
}

function prepositionPays(pays: string): string {
  // Petit helper de formulation ("du Cameroun", "de la Côte d'Ivoire"...).
  switch (pays) {
    case "Côte d'Ivoire":
      return "de la Côte d'Ivoire";
    case "Cameroun":
      return "du Cameroun";
    case "Sénégal":
      return "du Sénégal";
    case "Nigeria":
      return "du Nigeria";
    case "Ghana":
      return "du Ghana";
    default:
      return `du ${pays}`;
  }
}
