import styles from "./SelectInput.module.css";

import { useContext, useMemo, useState, useRef } from "react";
import { WorkspaceCtxt } from "@/components/Workspace/Workspace";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

import InputFrame from "../InputFrame/InputFrame";
import CheckboxButton from "../CheckboxButton/CheckboxButton";
import parse from "@/utils/parse";

const SelectInput = ({
  inputId,
  name,
  label,
  inputContainerId,
  icon,
  value,
  list,
  setValue,
}) => {
  const filters = useMemo(
    () =>
      list.reduce((acc, item) => {
        if (!acc.includes(item.type)) return [...acc, item.type];
        else return acc;
      }, []),
    [list]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(filters);

  const lastClickedItem = useRef(value);

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const selectedItem = useMemo(
    () => list.find((item) => item.label === value),
    [list, value]
  );

  const resetValue = () => {
    setValue({ key: name, value: lastClickedItem.current });
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
          <span className={`${selectedItem.style} input-mock`}>
            {selectedItem.name}
          </span>
          <button id={inputId} name={name} onClick={toggleIsOpen}>
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        </div>
      </InputFrame>
      <div className={styles.selectionWindow}>
        <div>
          {filters.map((currentFilter) => {
            const toggleFilters = (e) => {
              const buttonValue = parse(e.currentTarget.value);

              if (filters.length === activeFilters.length) {
                setActiveFilters([currentFilter]);
              } else if (buttonValue && activeFilters.length > 1) {
                setActiveFilters((prev) =>
                  prev.filter((filterName) => filterName !== currentFilter)
                );
              } else if (!buttonValue) {
                setActiveFilters((prev) => [...prev, currentFilter]);
              }
            };

            const isActiveFilter = activeFilters.includes(currentFilter);

            const checkboxId = currentFilter.split(" ").join("-");
            const checkBoxContainerId = `label-${checkboxId}`;

            const isDeemed =
              filters.length === activeFilters.length ||
              (isActiveFilter && activeFilters.length === 1);

            return (
              <CheckboxButton
                key={checkboxId}
                inputId={checkboxId}
                inputContainerId={checkBoxContainerId}
                name={currentFilter}
                onClick={toggleFilters}
                value={isActiveFilter}
                text={currentFilter}
                isDimmed={isDeemed}
              />
            );
          })}
        </div>
        <div onMouseLeave={resetValue}>
          {list
            .filter((item) =>
              activeFilters.some((filter) => filter === item.type)
            )
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((item) => {
              const handleOnMouseOver = () => {
                if (isOpen) setValue({ key: name, value: item.label });
              };

              const handleOnClick = () => {
                lastClickedItem.current = item.label;
                setIsOpen(false);
              };

              return (
                <button
                  key={item.id}
                  id={item.id}
                  style={item.style}
                  onMouseOver={handleOnMouseOver}
                  onClick={handleOnClick}
                >
                  {item.name}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
