import styles from "./CssCodeBox.module.css";

const CssCodeBox = ({ cssOutput }) => {
  return (
    <code className={styles.codeBox}>
      {cssOutput.length > 0 ? (
        <>
          <span className="yellow">text-shadow: </span>
          {cssOutput.map(({ id, string }, index) => {
            return (
              <span key={id} className={index > 0 ? styles.incremented : ""}>
                {string}
                {index < cssOutput.length - 1 ? ", " : ";"}
              </span>
            );
          })}
        </>
      ) : (
        <span className="yellow">No shadows are currently visible</span>
      )}
    </code>
  );
};

export default CssCodeBox;
