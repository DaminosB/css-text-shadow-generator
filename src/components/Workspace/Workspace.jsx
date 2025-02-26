"use client";

import styles from "./Workspace.module.css";

import { useState, createContext, useMemo, useCallback } from "react";

export const WorkspaceCtxt = createContext();

import { Provider } from "react-redux";
import { store } from "@/features/store";

import PropertyOutput from "../PropertyOutput/PropertyOutput";
import TextPreview from "../TextPreview/TextPreview";
import StylingPanel from "../StylingPanel/StylingPanel";

import useGoogleFonts from "@/hooks/useGoogleFonts";
import DemoDisplayer from "../DemoDisplayer/DemoDisplayer";

const Workspace = () => {
  const [highlightedShadow, setHighlightedShadow] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const { fontLibrary } = useGoogleFonts();

  const getFontFamily = useCallback(
    (label) =>
      fontLibrary.find((font) => font.label === label)?.instance.style
        .fontFamily,
    [fontLibrary]
  );

  const manropeFontFamily = useMemo(
    () => getFontFamily("Manrope"),
    [getFontFamily]
  );
  const cutiveMonoFontFamily = useMemo(
    () => getFontFamily("Cutive Mono"),
    [getFontFamily]
  );

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
        <style jsx global>
          {`
            html {
              font-family: ${manropeFontFamily};
            }
            pre {
              font-family: ${cutiveMonoFontFamily};
            }
          `}
        </style>
        <div className={styles.workspace}>
          <div className={styles.previewWindow}>
            <StylingPanel />
            <TextPreview />
          </div>
          <PropertyOutput />
          <DemoDisplayer />
        </div>
      </WorkspaceCtxt.Provider>
    </Provider>
  );
};

export default Workspace;
