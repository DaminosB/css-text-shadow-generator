"use client";

import styles from "./Workspace.module.css";

import { useState, createContext } from "react";

export const WorkspaceCtxt = createContext();

import { Provider } from "react-redux";
import { store } from "@/features/store";

import TextPreview from "../TextPreview/TextPreview";
import StylingPanel from "../StylingPanel/StylingPanel";

import DemoDisplayer from "../DemoDisplayer/DemoDisplayer";

const Workspace = ({ fontLibrary }) => {
  const [highlightedShadow, setHighlightedShadow] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const highlightShadow = (indexToHighlight) => {
    setHighlightedShadow(indexToHighlight);
  };

  const contextValues = {
    fontLibrary,
    highlightShadow,
    highlightedShadow,
    isDemoMode,
    setIsDemoMode,
  };

  return (
    <Provider store={store}>
      <WorkspaceCtxt.Provider value={contextValues}>
        <div className={styles.workspace}>
          <div className={styles.previewWindow}>
            <StylingPanel />
            <TextPreview />
          </div>
          <DemoDisplayer />
        </div>
      </WorkspaceCtxt.Provider>
    </Provider>
  );
};

export default Workspace;
