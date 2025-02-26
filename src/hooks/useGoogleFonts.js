import {
  Inter,
  Dancing_Script,
  Playfair,
  Cutive_Mono,
  Manrope,
  Playwrite_GB_S,
  Karla,
  Schibsted_Grotesk,
  Noto_Sans,
  Noto_Serif,
  EB_Garamond,
  Nunito,
  Roboto_Condensed,
  Bodoni_Moda,
  Roboto_Serif,
  Alkatra,
  Playwrite_FR_Moderne,
  Caveat,
  Montserrat,
  Quicksand,
  Exo,
  Comfortaa,
  Fraunces,
  Faustina,
  Imbue,
  Poltawski_Nowy,
  Montagu_Slab,
  Gluten,
  Courier_Prime,
} from "next/font/google";

import { useMemo } from "react";

const useGoogleFonts = () => {
  const fontLibrary = useMemo(
    () =>
      Object.entries(fontConfigs)
        .flatMap(([type, fonts]) =>
          fonts.map((instance) => {
            const cleanedFontLabel = instance.style.fontFamily
              .split(",")[0]
              .replaceAll("'", "")
              .trim();

            return {
              label: cleanedFontLabel,
              id: cleanedFontLabel.replaceAll(" ", "-"),
              instance,
              type,
            };
          })
        )
        .sort((a, b) => (a.label > b.label ? 1 : -1)),
    []
  );

  return { fontLibrary };
};

const inter = Inter({ subsets: ["latin"], display: "swap" });
const dancingScript = Dancing_Script({ subsets: ["latin"], display: "swap" });
const playfair = Playfair({ subsets: ["latin"], display: "swap" });
const playwriteGB = Playwrite_GB_S({ subsets: ["latin"], display: "swap" });
const karla = Karla({ subsets: ["latin"], display: "swap" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], display: "swap" });
const notoSerif = Noto_Serif({ subsets: ["latin"], display: "swap" });
const ebGaramond = EB_Garamond({ subsets: ["latin"], display: "swap" });
const nunito = Nunito({ subsets: ["latin"], display: "swap" });
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
});
const bodoni = Bodoni_Moda({ subsets: ["latin"], display: "swap" });
const robotoSerif = Roboto_Serif({ subsets: ["latin"], display: "swap" });
const alkatra = Alkatra({ subsets: ["latin"], display: "swap" });
const playwriteFR = Playwrite_FR_Moderne({
  subsets: ["latin"],
  display: "swap",
});
const caveat = Caveat({ subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], display: "swap" });
const exo = Exo({ subsets: ["latin"], display: "swap" });
const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });
const comfortaa = Comfortaa({ subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const faustina = Faustina({ subsets: ["latin"], display: "swap" });
const imbue = Imbue({ subsets: ["latin"], display: "swap" });
const poltawski = Poltawski_Nowy({ subsets: ["latin"], display: "swap" });
const montagu = Montagu_Slab({ subsets: ["latin"], display: "swap" });
const gluten = Gluten({ subsets: ["latin"], display: "swap" });
const manrope = Manrope({ subsets: ["latin"], display: "swap" });
const cutiveMono = Cutive_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const fontConfigs = {
  Calligraphy: [
    dancingScript,
    playwriteGB,
    alkatra,
    playwriteFR,
    caveat,
    gluten,
  ],

  "Sans Serif": [
    inter,
    karla,
    schibsted,
    nunito,
    robotoCondensed,
    montserrat,
    quicksand,
    exo,
    notoSans,
    comfortaa,
    manrope,
  ],
  Serif: [
    playfair,
    notoSerif,
    ebGaramond,
    bodoni,
    robotoSerif,
    fraunces,
    faustina,
    imbue,
    poltawski,
    montagu,
  ],
  Monospace: [cutiveMono, courierPrime],
};

export default useGoogleFonts;
