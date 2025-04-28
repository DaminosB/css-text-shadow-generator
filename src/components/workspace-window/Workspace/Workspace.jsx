"use client";

import styles from "./Workspace.module.css";

import { useState, createContext, useCallback } from "react";
export const WorkspaceCtxt = createContext();

import { Provider } from "react-redux";
import { store } from "@/features/store";

import TextPreview from "../TextPreview/TextPreview";
import Sidebar from "@/components/sidebar/Sidebar/Sidebar";
import DemoDisplayer from "../../extras/DemoDisplayer/DemoDisplayer";
import About from "@/components/extras/About/About";

const Workspace = () => {
  const [modalContent, setModaleContent] = useState(null);

  const manageModale = useCallback(
    (content, show) => {
      const modal = document.getElementById(content);

      if (show) {
        modal.showModal();
        setModaleContent(content);
      } else {
        modal.close();
        setModaleContent(null);
      }
    },
    [setModaleContent]
  );

  const contextValues = { modalContent, setModaleContent, manageModale };

  return (
    <Provider store={store}>
      <WorkspaceCtxt.Provider value={contextValues}>
        <div className={styles.workspace}>
          <div className={styles.previewWindow}>
            <Sidebar path={["items"]} />
            <TextPreview path={["text"]} />
          </div>
          <DemoDisplayer />
          <About />
        </div>
      </WorkspaceCtxt.Provider>
    </Provider>
  );
};

export default Workspace;
