import styles from "./About.module.css";

import { useContext, useMemo } from "react";
import { WorkspaceCtxt } from "../../workspace-window/Workspace/Workspace";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Modale from "@/components/wrappers/Modale/Modale";

const About = () => {
  const { modaleContent, setModaleContent } = useContext(WorkspaceCtxt);

  const isOpen = useMemo(() => modaleContent === "about", [modaleContent]);

  const closeModale = () => {
    setModaleContent(null);
  };

  return (
    <Modale isOpen={isOpen} darkBackground onClick={closeModale}>
      <div onClick={(e) => e.stopPropagation()}>
        <div className={styles.window}>
          <button onClick={closeModale}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <div>
            <h2>About this app</h2>
            <p>
              This tool was designed to help developers easily generate and
              preview text-shadow properties in real time. No data is collected,
              ensuring full privacy.
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
            <div>
              <p>
                <strong>Version</strong>: 1.1.0
              </p>
              <p>
                <strong>Last update</strong>: April 2025
              </p>
              <p>&#169; Damien BOURCHEIX, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </Modale>
  );
};

export default About;
