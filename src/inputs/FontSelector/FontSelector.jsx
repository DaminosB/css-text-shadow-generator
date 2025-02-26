import styles from "./FontSelector.module.css";

import { useContext, useMemo, useState, useRef } from "react";
import { WorkspaceCtxt } from "@/components/Workspace/Workspace";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

import InputFrame from "../InputFrame/InputFrame";
import CheckboxButton from "../CheckboxButton/CheckboxButton";

const FontSelector = ({
  inputId,
  name,
  label,
  inputContainerId,
  icon,
  value,
  setValue,
}) => {
  const { fontLibrary } = useContext(WorkspaceCtxt);
  const fontTypes = useMemo(
    () =>
      fontLibrary.reduce((types, font) => {
        if (!types.some((type) => type === font.type))
          return [...types, font.type];
        else return types;
      }, []),
    [fontLibrary]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(fontTypes);

  const lastSelectedFont = useRef(value);

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const previewClassName = useMemo(
    () => fontLibrary.find((font) => font.label === value).instance.className,
    [fontLibrary, value]
  );

  const resetValue = () => {
    setValue({ key: name, value: lastSelectedFont.current });
  };

  return (
    <div className={`${styles.fontSelector} ${isOpen ? styles.open : ""}`}>
      <InputFrame
        inputId={inputId}
        inputContainerId={inputContainerId}
        label={label}
      >
        <div className={styles.inputContainer}>
          <FontAwesomeIcon icon={icon} />
          <span className={`${previewClassName} input-mock`}>{value}</span>
          <button id={inputId} name={name} onClick={toggleIsOpen}>
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        </div>
      </InputFrame>
      <div className={styles.selectionWindow}>
        <div>
          {fontTypes.map((fontType) => {
            const toggleFilters = () => {
              setFilters((prev) =>
                prev.some((filter) => filter === fontType)
                  ? prev.filter((filter) => filter !== fontType)
                  : [...prev, fontType]
              );
            };

            const isActiveFilter = filters.includes(fontType);

            const checkboxId = fontType.split(" ").join("-");
            const checkBoxContainerId = `label-${checkboxId}`;

            return (
              <CheckboxButton
                key={checkboxId}
                inputId={checkboxId}
                inputContainerId={checkBoxContainerId}
                name={fontType}
                onClick={toggleFilters}
                value={isActiveFilter}
                text={fontType}
              />
            );
          })}
        </div>
        <div onMouseLeave={resetValue}>
          {fontLibrary.map((font) => {
            const isInFilter = filters.some((filter) => filter === font.type);
            const handleOnMouseOver = () => {
              setValue({ key: name, value: font.label });
            };

            const handleOnClick = () => {
              lastSelectedFont.current = font.label;
              setIsOpen(false);
            };

            return (
              isInFilter && (
                <button
                  key={font.id}
                  id={font.id}
                  className={font.instance.className}
                  onMouseOver={handleOnMouseOver}
                  onClick={handleOnClick}
                >
                  {font.label}
                </button>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
