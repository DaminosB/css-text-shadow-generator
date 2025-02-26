import styles from "./StylingPanel.module.css";

import { useState, useRef } from "react";

import { useDispatch } from "react-redux";
import { addShadow } from "@/features/textSettings/textSettingsSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";

import TextStyler from "@/components/TextStyler/TextStyler";
import ShadowsList from "../ShadowsList/ShadowsList";

const StylingPanel = () => {
  const [showPanel, setShowPanel] = useState(true);

  const scrollerRef = useRef(null);

  const dispatch = useDispatch();

  const addShadowAndScroll = () => {
    dispatch(addShadow());
    requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    });
  };

  const toggleShowPanel = () => setShowPanel((prev) => !prev);
  return (
    <div className={`${styles.stylingPanel} ${showPanel ? "" : styles.closed}`}>
      <div className={styles.buttonContainer}>
        <button onClick={toggleShowPanel}>
          <span className={showPanel ? styles.active : ""}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
          <span className={!showPanel ? styles.active : ""}>
            <FontAwesomeIcon icon={faSliders} />
          </span>
        </button>
      </div>
      <div
        className={styles.optionsScroller}
        ref={scrollerRef}
        data-role="scroller"
      >
        <TextStyler />
        <ShadowsList />
        <div>
          <button id="append-button" onClick={addShadowAndScroll}>
            <FontAwesomeIcon icon={faPlus} /> Add a layer
          </button>
        </div>
      </div>
    </div>
  );
};

export default StylingPanel;
