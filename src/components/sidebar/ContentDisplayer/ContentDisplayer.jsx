import styles from "./ContentDisplayer.module.css";

import { useSelector } from "react-redux";

const ContentDisplayer = ({ content }) => {
  const sidebarContent = useSelector(
    (store) => store.workflow.controls.sidebar.content
  );

  return (
    <div className={styles.container}>
      {Object.entries(content).map(([name, attributes], index) => {
        const inlineStyle = { transform: `translateY(-${index * 100}%)` };
        const Content = attributes.child;
        return (
          <div
            key={attributes.id}
            className={sidebarContent === name ? styles.active : ""}
            style={inlineStyle}
          >
            <Content />
          </div>
        );
      })}
    </div>
  );
};

export default ContentDisplayer;
