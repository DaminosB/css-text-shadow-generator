import styles from "./SelectInput.module.css";

import { useMemo, useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import SmartButton from "../SmartButton/SmartButton";
import HeadingIcon from "@/components/headers/HeadingIcon/HeadingIcon";

import { faSquare } from "@fortawesome/free-regular-svg-icons";

import parse from "@/utils/parse";

const SelectInput = ({ inputId, name, label, icon, value, setValue, list }) => {
  const filters = useMemo(
    () =>
      list.reduce((acc, item) => {
        if (!acc.includes(item.type)) return [...acc, item.type];
        else return acc;
      }, []),
    [list]
  );

  const [activeFilters, setActiveFilters] = useState(filters);

  const lastClickedItem = useRef(value);

  const toggleIsOpen = (e) => {
    e.currentTarget.focus();
  };

  const selectedItem = useMemo(
    () => list.find((item) => item.label === value),
    [list, value]
  );

  const resetValue = () => {
    setValue(lastClickedItem.current);
  };

  return (
    <label
      htmlFor={inputId}
      id={`labelFor-${inputId}`}
      className={styles.label}
      onPointerDown={(e) => e.preventDefault()}
      title={label}
    >
      <HeadingIcon icon={icon} label={label} />
      <div className="input-mock">
        <span className={`${selectedItem.className}`}>{selectedItem.name}</span>

        <button id={inputId} name={name} onClick={toggleIsOpen}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      </div>
      <div className={`${styles.selectionWindow} extension-bottom`}>
        <div>
          {filters.map((currentFilter) => {
            const toggleFilters = (e) => {
              const currentValue = parse(e.currentTarget.value);

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
                setValue(item.label);
              };

              const handleOnClick = (e) => {
                document.activeElement.blur();
                lastClickedItem.current = item.label;
              };

              const isActive = item.label === lastClickedItem.current;

              return (
                <button
                  key={item.id}
                  id={item.id}
                  className={isActive ? styles.active : ""}
                  title={item.name}
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
    </label>
  );
};

export default SelectInput;
