import styles from "./Modale.module.css";

// import { createPortal } from "react-dom";

const Modale = ({ isOpen, onClick, darkBackground, children }) => {
  return (
    isOpen && (
      <div
        className={`${styles.modale} ${darkBackground ? styles.darker : ""}`}
        onClick={onClick}
      >
        {/* <div onClick={(e) => e.stopPropagation()}> */}
        {children}
        {/* </div> */}
      </div>
    )
  );
};

export default Modale;
