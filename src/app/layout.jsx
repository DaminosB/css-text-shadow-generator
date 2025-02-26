import "./globals.css";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

export default function RootLayout({ children }) {
  return <html lang="en">{children}</html>;
}

export const metadata = {
  title: "CSS Text-Shadow Generator",
  description:
    "Easily generate and preview the perfect CSS text-shadow for your designs.",
};
