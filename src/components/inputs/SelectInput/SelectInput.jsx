import styles from "./SelectInput.module.css";

import { useMemo, useCallback, useState, useRef } from "react";

import SmartButton from "../SmartButton/SmartButton";
import HeadingIcon from "@/components/headers/HeadingIcon/HeadingIcon";

import { Icons, iconsList } from "@/assets/icons/iconsLibrary";
const { CaretUp } = Icons;

import parse from "@/utils/parse";

const SelectInput = ({
  inputId,
  name,
  label,
  icon,
  value,
  setValue,
  list,
  commit,
}) => {
  const filters = useMemo(
    () =>
      list.reduce((acc, item) => {
        if (!acc.includes(item.type)) return [...acc, item.type];
        else return acc;
      }, []),
    [list]
  );

  const [activeFilters, setActiveFilters] = useState(filters);

  const selectedItem = useMemo(
    () => list.find((item) => item.label === value),
    [list, value]
  );

  const lastClickedItem = useRef(value);

  const toggleIsOpen = useCallback((e) => {
    e.currentTarget.focus();
  }, []);

  const resetValue = useCallback(() => {
    setValue(lastClickedItem.current);
  }, [setValue]);

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
          <CaretUp />
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
                icons={{ on: iconsList.CheckSquare, off: iconsList.Square }}
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
                commit(lastClickedItem.current, item.label);
                lastClickedItem.current = item.label;
              };

              const isActive = item.label === lastClickedItem.current;

              return (
                <input
                  type="button"
                  value={item.name}
                  key={item.id}
                  id={item.id}
                  className={isActive ? styles.active : ""}
                  title={item.name}
                  style={item.style}
                  tabIndex={0}
                  onMouseOver={handleOnMouseOver}
                  onClick={handleOnClick}
                />
              );
            })}
        </div>
      </div>
    </label>
  );
};

export default SelectInput;
