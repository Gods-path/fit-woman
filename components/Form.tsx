"use client";

import { useState } from "react";
import {
  validateInput,
  ACTIVITY_LABELS,
  type ActivityLevel,
  type Country,
  type UserInput,
  type GuardError,
} from "@/lib/nutrition";
import MedicalDisclaimer from "./MedicalDisclaimer";

const PAYS: Country[] = [
  "Cameroun",
  "Côte d'Ivoire",
  "Sénégal",
  "Nigeria",
  "Ghana",
];

const ACTIVITES: ActivityLevel[] = [
  "sedentaire",
  "legere",
  "moderee",
  "intense",
];

const ACTIVITE_AIDE: Record<ActivityLevel, string> = {
  sedentaire: "Peu ou pas d'exercice",
  legere: "1 à 3 fois par semaine",
  moderee: "3 à 5 fois par semaine",
  intense: "6 à 7 fois par semaine",
};

interface FormState {
  age: string;
  taille: string;
  poids: string;
  poidsCible: string;
  activite: ActivityLevel;
  pays: Country;
}

const INITIAL: FormState = {
  age: "",
  taille: "",
  poids: "",
  poidsCible: "",
  activite: "legere",
  pays: "Cameroun",
};

export default function Form({
  onSubmit,
}: {
  onSubmit: (input: UserInput) => void;
}) {
  const [state, setState] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<GuardError[]>([]);
  const [touched, setTouched] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    const input: UserInput = {
      age: Number(state.age),
      taille: Number(state.taille),
      poids: Number(state.poids),
      poidsCible: Number(state.poidsCible),
      activite: state.activite,
      pays: state.pays,
    };

    const guardErrors = validateInput(input);
    setErrors(guardErrors);

    if (guardErrors.length === 0) {
      onSubmit(input);
    } else {
      // Remonte vers le message pour qu'il soit visible sur mobile.
      queueMicrotask(() => {
        document
          .getElementById("messages-garde-fous")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  const champClass =
    "w-full rounded-xl border border-foret/20 bg-white px-4 py-3 text-base text-foret-dark outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/30";
  const labelClass = "mb-1.5 block text-sm font-semibold text-foret-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className={labelClass}>
            Âge
          </label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="ans"
            value={state.age}
            onChange={(e) => update("age", e.target.value)}
            className={champClass}
            required
          />
        </div>
        <div>
          <label htmlFor="taille" className={labelClass}>
            Taille (cm)
          </label>
          <input
            id="taille"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="cm"
            value={state.taille}
            onChange={(e) => update("taille", e.target.value)}
            className={champClass}
            required
          />
        </div>
        <div>
          <label htmlFor="poids" className={labelClass}>
            Poids actuel (kg)
          </label>
          <input
            id="poids"
            type="number"
            inputMode="decimal"
            min={1}
            placeholder="kg"
            value={state.poids}
            onChange={(e) => update("poids", e.target.value)}
            className={champClass}
            required
          />
        </div>
        <div>
          <label htmlFor="poidsCible" className={labelClass}>
            Poids souhaité (kg)
          </label>
          <input
            id="poidsCible"
            type="number"
            inputMode="decimal"
            min={1}
            placeholder="kg"
            value={state.poidsCible}
            onChange={(e) => update("poidsCible", e.target.value)}
            className={champClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="pays" className={labelClass}>
          Pays
        </label>
        <select
          id="pays"
          value={state.pays}
          onChange={(e) => update("pays", e.target.value as Country)}
          className={champClass}
        >
          {PAYS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={labelClass}>Niveau d'activité</legend>
        <div className="grid grid-cols-2 gap-3">
          {ACTIVITES.map((a) => {
            const selected = state.activite === a;
            return (
              <button
                type="button"
                key={a}
                onClick={() => update("activite", a)}
                aria-pressed={selected}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  selected
                    ? "border-terracotta bg-terracotta/10 ring-2 ring-terracotta/30"
                    : "border-foret/20 bg-white hover:border-terracotta/50"
                }`}
              >
                <span className="block text-sm font-semibold text-foret-dark">
                  {ACTIVITY_LABELS[a]}
                </span>
                <span className="block text-xs text-foret/70">
                  {ACTIVITE_AIDE[a]}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {touched && errors.length > 0 && (
        <div
          id="messages-garde-fous"
          role="alert"
          className="space-y-2 rounded-2xl border border-terracotta/30 bg-terracotta/5 p-4"
        >
          {errors.map((err) => (
            <p
              key={err.code}
              className="flex items-start gap-2 text-sm leading-snug text-terracotta-dark"
            >
              <span aria-hidden className="mt-0.5">
                💛
              </span>
              <span>{err.message}</span>
            </p>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-terracotta px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-terracotta-dark active:scale-[0.99]"
      >
        Voir mon plan
      </button>

      <MedicalDisclaimer />
    </form>
  );
}
