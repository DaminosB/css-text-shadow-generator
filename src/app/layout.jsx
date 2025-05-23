import "./globals.css";

import fontLibrary from "@/assets/fonts/googleFonts";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            html {
              font-family: ${fontLibrary.manrope.style.fontFamily};
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
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: "CSS Text-Shadow Generator",
  description:
    "Easily generate and preview the perfect CSS text-shadow for your designs.",
};
