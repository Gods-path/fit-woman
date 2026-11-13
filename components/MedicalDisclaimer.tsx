export default function MedicalDisclaimer({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-ocre-dark/20 bg-ocre-light/30 px-4 py-3 text-sm text-foret-dark"
    >
      <span aria-hidden className="mt-0.5 text-lg leading-none">
        ⚕️
      </span>
      <p className="leading-snug">
        <strong>Outil informatif.</strong>{" "}
        {compact
          ? "Il ne remplace pas un avis médical."
          : "Il ne remplace pas l'avis d'un·e professionnel·le de santé. Pour tout projet de perte de poids, parlez-en à votre médecin ou à un·e diététicien·ne."}
      </p>
    </div>
  );
}
