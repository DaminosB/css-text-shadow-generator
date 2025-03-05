import styles from "./page.module.css";

import useGoogleFonts from "@/hooks/useGoogleFonts";

import Workspace from "@/components/Workspace/Workspace";

export default function Home() {
  const { fontLibrary } = useGoogleFonts();

  return (
    <>
      <head>
        <style>
          {`
            html {
              font-family: ${fontLibrary.manrope.style.fontFamily};
            }
            pre {
              font-family: ${fontLibrary.cutiveMono.style.fontFamily};
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
