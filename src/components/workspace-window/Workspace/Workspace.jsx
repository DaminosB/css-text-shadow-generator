"use client";

import styles from "./Workspace.module.css";

import { Provider } from "react-redux";
import { store } from "@/features/store";

import TextPreview from "../TextPreview/TextPreview";
import Sidebar from "@/components/sidebar/Sidebar/Sidebar";
import DemoDisplayer from "../../extras/demo/DemoDisplayer/DemoDisplayer";
import About from "@/components/extras/about/About/About";
import HistoryContainer from "@/components/history/HistoryContainer/HistoryContainer";

const Workspace = () => {
  return (
    <Provider store={store}>
      <div className={styles.workspace}>
        <div className={styles.previewWindow}>
          <Sidebar />
          <TextPreview />
        </div>
        <DemoDisplayer />
        <About />
        <HistoryContainer />
      </div>
    </Provider>
  );
};

export default Workspace;
