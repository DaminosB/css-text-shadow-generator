import styles from "./InputMapper.module.css";

import InputDisplayer from "@/components/management/InputDisplayer/InputDisplayer";

const InputMapper = ({ inputs, path }) => {
  return (
    <div className={styles.inputMapper}>
      {Object.entries(inputs)
        .filter(([inputName]) => inputName !== "userText")
        .map(([inputName, config]) => {
          const inputPath = [...path, inputName];
          return (
            <InputDisplayer
              key={config.inputId}
              config={config}
              path={inputPath}
            />
          );
        })}
    </div>
  );
};

export default InputMapper;
