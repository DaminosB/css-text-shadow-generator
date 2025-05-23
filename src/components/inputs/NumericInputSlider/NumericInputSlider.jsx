import styles from "./NumericInputSlider.module.css";

import { useCallback, useRef, useMemo } from "react";

import HeadingIcon from "@/components/headers/HeadingIcon/HeadingIcon";

import clamp from "@/utils/clamp";

const NumericInputSlider = ({
  inputId,
  name,
  label,
  icon,
  range,
  value,
  setValue,
  format,
  minValue,
  maxValue,
  commit,
}) => {
  const [rangeMinValue, rangeMaxValue] = useMemo(() => {
    let [min, max] = range;

    const rangeSize = max - min;
    const marginRatio = 0.1;
    const margin = rangeSize * marginRatio;

    const lowerThreshold = min + margin;
    const upperThreshold = max - margin;

    if (value < lowerThreshold) {
      min = value - margin;
    }

    if (value > upperThreshold) {
      max = value + margin;
    }

    min = Math.max(min, minValue ?? -Infinity);
    max = Math.min(max, maxValue ?? Infinity);

    return [min, max];
  }, [range, value, minValue, maxValue]);

  const extensionRef = useRef(null);
  const cachedValue = useRef(value);

  const handleOnChange = useCallback(
    (e) => {
      setValue(e.target.valueAsNumber || "");
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (e) => {
      if (!Number.isNaN(e.target.valueAsNumber)) {
        const newValue = clamp(
          Math.round(e.target.valueAsNumber),
          Math.round(minValue ?? -Infinity),
          Math.round(maxValue ?? Infinity)
        );

        if (cachedValue.current !== newValue) {
          if (value !== newValue) setValue(newValue);
          commit(cachedValue.current, newValue);
        }
      } else {
        setValue(cachedValue.current);
      }
    },
    [setValue, minValue, maxValue, commit, value]
  );

  const handleFocus = useCallback((e) => {
    cachedValue.current = e.target.valueAsNumber;
  }, []);

  return (
    <label id={`labelFor-${inputId}`} className={styles.label} title={label}>
      <div className={styles.inputContainer}>
        <HeadingIcon icon={icon} label={label} format={format} />
        <input
          type="number"
          name={name}
          id={inputId}
          min={minValue}
          max={maxValue}
          value={value}
          onFocus={handleFocus}
          onChange={handleOnChange}
          onBlur={handleBlur}
        />
      </div>
      <div
        className={`${styles.sliderContainer} extension-bottom`}
        data-role="extension"
        ref={extensionRef}
      >
        <input
          type="range"
          name="range"
          id={`rangeFor-${inputId}`}
          step={1}
          min={rangeMinValue}
          max={rangeMaxValue}
          value={value}
          onFocus={handleFocus}
          onChange={handleOnChange}
          onBlur={handleBlur}
        />
      </div>
    </label>
  );
};

export default NumericInputSlider;
