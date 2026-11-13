"use client";

import { useState } from "react";
import Form from "@/components/Form";
import Result from "@/components/Result";
import type { UserInput } from "@/lib/nutrition";

export default function Home() {
  const [input, setInput] = useState<UserInput | null>(null);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-12 pt-8">
      <header className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta-dark">
          🌿 Bien-être au féminin
        </div>
        <h1 className="text-2xl font-extrabold leading-tight text-foret-dark">
          Mon équilibre
        </h1>
        <p className="mt-1 text-sm text-foret/70">
          {input
            ? "Votre plan personnalisé, à adapter à votre quotidien."
            : "Un point de départ doux et réaliste vers votre poids d'équilibre."}
        </p>
      </header>

      {input ? (
        <Result input={input} onReset={() => setInput(null)} />
      ) : (
        <Form onSubmit={setInput} />
      )}
    </main>
  );
}
