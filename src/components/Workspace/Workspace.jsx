"use client";

import styles from "./Workspace.module.css";

import { useState, createContext } from "react";

export const WorkspaceCtxt = createContext();

import { Provider } from "react-redux";
import { store } from "@/features/store";

import TextPreview from "../TextPreview/TextPreview";
import StylingPanel from "../StylingPanel/StylingPanel";

import DemoDisplayer from "../DemoDisplayer/DemoDisplayer";
import UtilityButtons from "../UtilityButtons/UtilityButtons";
import About from "../About/About";

const Workspace = ({ fontLibrary }) => {
  const [highlightedShadow, setHighlightedShadow] = useState(null);

  const [modaleContent, setModaleContent] = useState(null);

  const highlightShadow = (indexToHighlight) => {
    setHighlightedShadow(indexToHighlight);
  };

  const contextValues = {
    fontLibrary,
    highlightShadow,
    highlightedShadow,
    modaleContent,
    setModaleContent,
  };

  return (
    <Provider store={store}>
      <WorkspaceCtxt.Provider value={contextValues}>
        <div className={styles.workspace}>
          <div className={styles.previewWindow}>
            <StylingPanel />
            <TextPreview />
          </div>
          <UtilityButtons />
          <DemoDisplayer />
          <About />
        </div>
      </WorkspaceCtxt.Provider>
    </Provider>
  );
};

export default Workspace;
