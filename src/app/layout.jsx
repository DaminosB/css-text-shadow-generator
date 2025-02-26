import "./globals.css";

// console.log(cutiveMono);

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // className={manrope.className}
    >
      <head></head>
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
    "Easily preview and generate the perfect CSS text-shadow for your designs.",
};
