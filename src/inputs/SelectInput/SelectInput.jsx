import styles from "./SelectInput.module.css";

import { useMemo, useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import InputFrame from "../InputFrame/InputFrame";
import SmartButton from "../SmartButton/SmartButton";

import { faSquare } from "@fortawesome/free-regular-svg-icons";
import parse from "@/utils/parse";

const SelectInput = ({
  inputId,
  name,
  label,
  inputContainerId,
  icon,
  value,
  setValue,
  list,
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
    setValue(lastClickedItem.current);
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
              const newValue = !parse(e.currentTarget.value);
              const currentValue = parse(e.currentTarget.value);
              console.log(newValue);

              if (activeFilters.length === filters.length) {
                setActiveFilters([currentFilter]);
              } else if (activeFilters.length === 1 && currentValue) {
                setActiveFilters(filters);
              } else if (currentValue && activeFilters.length > 1) {
                setActiveFilters((prev) =>
                  prev.filter((filterName) => filterName !== currentFilter)
                );
              } else if (!currentValue) {
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
              <SmartButton
                key={checkboxId}
                inputId={checkboxId}
                inputContainerId={checkBoxContainerId}
                name={currentFilter}
                icons={{ on: faCheckSquare, off: faSquare }}
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
                if (isOpen) setValue(item.label);
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
