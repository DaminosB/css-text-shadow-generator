import styles from "./page.module.css";

import useGoogleFonts from "@/hooks/useGoogleFonts";

import Workspace from "@/components/Workspace/Workspace";

export default function Home() {
  const { fontLibrary } = useGoogleFonts();

  const getFontFamily = (label) =>
    fontLibrary.find((font) => font.label === label)?.instance.style.fontFamily;

  const manropeFontFamily = getFontFamily("Manrope");
  const cutiveMonoFontFamily = getFontFamily("Cutive Mono");

  return (
    <>
      <head>
        <style>
          {`
            html {
              font-family: ${manropeFontFamily};
            }
            pre {
              font-family: ${cutiveMonoFontFamily};
            }
          `}
        </style>
      </head>
      <body>
        <header>
          <h1>
            <strong>CSS</strong> Text-Shadow
            <br />
            <strong>Generator</strong>
          </h1>
        </header>
        <main>
          <Workspace fontLibrary={fontLibrary} />
        </main>
      </body>
    </>
  );
}
