import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mon équilibre — bien-être au féminin",
  description:
    "Prototype d'accompagnement bienveillant vers un poids d'équilibre, pensé pour les femmes africaines. Outil informatif, ne remplace pas un avis médical.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C45A3B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
