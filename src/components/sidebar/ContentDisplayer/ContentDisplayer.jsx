import styles from "./ContentDisplayer.module.css";

import { useSelector } from "react-redux";

import PatternsList from "../PatternsList/PatternsList";
import CssEditorBox from "../CssEditorBox/CssEditorBox";

const ContentDisplayer = ({ path }) => {
  const target = useSelector((store) =>
    path.reduce((acc, entry) => acc[entry], store.controls)
  );

  return (
    <div className={styles.container}>
      {Object.entries(target).map(([name, attributes], index) => {
        const inlineStyle = { transform: `translateY(-${index * 100}%)` };
        if (name !== "output") {
          return (
            <div
              key={attributes.id}
              className={attributes.isOpen ? styles.active : ""}
              style={inlineStyle}
            >
              <PatternsList path={[...path, name]} />
            </div>
          );
        } else {
          return (
            <div
              key={attributes.id}
              className={attributes.isOpen ? styles.active : ""}
              style={inlineStyle}
            >
              <CssEditorBox />
            </div>
          );
        }
      })}
    </div>
  );
};

export default ContentDisplayer;
