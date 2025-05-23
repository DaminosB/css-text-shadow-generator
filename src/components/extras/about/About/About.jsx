import styles from "./About.module.css";

import { iconsList, Icons } from "@/assets/icons/iconsLibrary";
import fontLibrary from "@/assets/fonts/googleFonts";

const { X } = Icons;

const About = () => {
  const onClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (
      e.clientX < Math.round(rect.left) ||
      e.clientX > Math.round(rect.right) ||
      e.clientY < Math.round(rect.top) ||
      e.clientY > Math.round(rect.bottom)
    ) {
      e.currentTarget.close();
    }
  };

  return (
    <dialog id="about" className={styles.window} onClick={onClick}>
      <button>
        <X />
      </button>
      <div>
        <h2>About this app</h2>
        <p>
          This tool was designed to help developers easily generate and preview
          text-shadow properties in real time. No data is collected, ensuring
          full privacy.
        </p>
        <p>
          Built with React, Next.js, and Redux, this project focuses on
          performance, usability, and an intuitive UI.
        </p>
        <p>
          Crafted by Damien Bourcheix — check out more of my work{" "}
          <a href="https://damienbourcheix.com" target="_blank">
            here
          </a>
          .
        </p>
        <h3>Credits</h3>
        <h4>Icons</h4>
        <table>
          <thead>
            <tr>
              <th scope="col">Icon</th>
              <th scope="col">Name</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(iconsList).map(([item]) => {
              const Icon = Icons[item];
              return (
                <tr key={item}>
                  <th scope="row">
                    <Icon weight="regular" />
                  </th>
                  <td>{item}</td>
                  <td>Phosphore Icons</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h4>Fonts</h4>
        <table>
          <thead>
            <tr>
              <th scope="col">Font</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(fontLibrary).map(([fontName, attributes]) => {
              return (
                <tr key={attributes.id}>
                  <th scope="row" className={attributes.className}>
                    {attributes.name}
                  </th>
                  <td>Google</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          <p>
            <strong>Version</strong>: 1.2.0
          </p>
          <p>
            <strong>Last update</strong>: May 2025
          </p>
          <p>&#169; Damien BOURCHEIX, 2025</p>
        </div>
      </div>
    </dialog>
  );
};

export default About;
