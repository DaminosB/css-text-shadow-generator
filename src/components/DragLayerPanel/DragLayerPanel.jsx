import styles from "./DragLayerPanel.module.css";

import { useSelector } from "react-redux";

const DragLayerPanel = ({ grabbedLayer, showDragLayerPanel }) => {
  const { shadows } = useSelector((store) => store.textSettings);
  return (
    <div
      className={`${styles.dragLayerPanel} ${
        showDragLayerPanel ? styles.show : ""
      }`}
    >
      <div data-role="drop-zone">
        {shadows.map((shadow, index) => {
          return (
            <div
              key={shadow.id}
              className={grabbedLayer === index ? styles.grabbed : ""}
            >
              <h2>Layer #{index + 1}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DragLayerPanel;
