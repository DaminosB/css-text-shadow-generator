import styles from "./NumericInputSlider.module.css";

import { useCallback, useRef, useMemo } from "react";

import HeadingIcon from "@/components/headers/HeadingIcon/HeadingIcon";

import parse from "@/utils/parse";
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
}) => {
  const [rangeMinValue, rangeMaxValue] = useMemo(() => {
    let [min, max] = range;

    const rangeSize = max - min;
    const marginRatio = 0.25;
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

  const isOutOfRange = useMemo(
    () => value < rangeMinValue || value > rangeMaxValue,
    [value, rangeMinValue, rangeMaxValue]
  );

  const sliderContainerClasses = useMemo(
    () =>
      `${styles.sliderContainer} extension-bottom ${
        isOutOfRange ? "ethereal" : ""
      }`,
    [isOutOfRange]
  );

  const extensionRef = useRef(null);
  const cachedValue = useRef(value);

  const calcKnobPosition = useCallback(
    (currentValue, knobWidth, containerWidth) => {
      const valueRatio = clamp(
        (currentValue - rangeMinValue) / (rangeMaxValue - rangeMinValue),
        0,
        1
      );

      const knobPosition =
        (containerWidth - knobWidth) * valueRatio - knobWidth / 2;

      return knobPosition;
    },
    [rangeMinValue, rangeMaxValue]
  );

  const grabKnob = useCallback(
    (pdEvent) => {
      pdEvent.preventDefault();

      const calcValue = (cursorPosition, extensionRect, range) => {
        console.log(range);

        const relativePosition = Math.round(
          cursorPosition - extensionRect.left
        );
        const positionRatio = clamp(
          relativePosition / extensionRect.width,
          0,
          1
        );
        const newValue = Math.round(
          positionRatio * (rangeMaxValue - rangeMinValue) + rangeMinValue
        );

        setValue(newValue);

        return newValue;
      };

      const extension = extensionRef.current;
      const knob = extension.querySelector("button");

      const extensionRect = extension.getBoundingClientRect();

      const newValue = calcValue(pdEvent.clientX, extensionRect, [
        rangeMinValue,
        rangeMaxValue,
      ]);

      const knobPosition = calcKnobPosition(
        newValue,
        knob.offsetWidth,
        extension.offsetWidth
      );
      knob.style.transform = `translateX(${knobPosition}px)`;

      const moveKnob = (pmEvent) => {
        const newValue = calcValue(pmEvent.clientX, extensionRect, [
          rangeMinValue,
          rangeMaxValue,
        ]);

        const knobPosition = calcKnobPosition(
          newValue,
          knob.offsetWidth,
          extension.offsetWidth
        );
        knob.style.transform = `translateX(${knobPosition}px)`;
      };

      const dropKnob = () => {
        controller.abort();
      };

      const controller = new AbortController();
      const { signal } = controller;

      window.addEventListener("pointermove", moveKnob, { signal });
      window.addEventListener("pointerup", dropKnob, { signal });
    },
    [calcKnobPosition, rangeMaxValue, rangeMinValue, setValue]
  );

  const handleOnChange = useCallback(
    (e) => {
      const extension = extensionRef.current;
      const knob = extension.querySelector("button");

      const parsedValue = parse(e.target.value);

      const isNumber = typeof parsedValue === "number";
      const isEmpty = parsedValue === "";
      const isComputable = isNumber || isEmpty;

      if (isComputable) {
        const newValue = parsedValue;
        setValue(newValue);

        const knobPosition = calcKnobPosition(
          newValue,
          knob.offsetWidth,
          extension.offsetWidth
        );

        knob.style.transform = `translateX(${knobPosition}px)`;
      }
    },
    [calcKnobPosition, setValue]
  );

  const handleBlur = useCallback(
    (e) => {
      const parsedValue = parse(e.target.value);
      const isEmpty = parsedValue === "";

      if (!isEmpty) {
        const newValue = clamp(
          parsedValue,
          minValue ?? -Infinity,
          maxValue ?? Infinity
        );

        setValue(newValue);
        cachedValue.current = newValue;
      } else {
        setValue(cachedValue.current);
      }
    },
    [setValue, minValue, maxValue]
  );

  const handleFocus = useCallback(
    (e) => {
      const extension = extensionRef.current;
      const knob = extension.querySelector("button");

      const knobPosition = calcKnobPosition(
        value,
        knob.offsetWidth,
        extension.offsetWidth
      );

      knob.style.transform = `translateX(${knobPosition}px)`;
    },
    [calcKnobPosition, value]
  );

  return (
    <label id={`labelFor-${inputId}`} className={styles.label} title={label}>
      {/* <div> */}
      <div className={styles.inputContainer}>
        <HeadingIcon icon={icon} label={label} format={format} />
        <input
          type="number"
          name={name}
          id={inputId}
          min={minValue}
          max={maxValue}
          value={value}
          onChange={handleOnChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      </div>
      <div
        className={sliderContainerClasses}
        data-role="extension"
        title={isOutOfRange ? "The value is out of range" : ""}
        ref={extensionRef}
        onPointerDown={grabKnob}
      >
        <button className="grabbable"></button>
        <div className={styles.track}></div>
      </div>
    </label>
  );
};

export default NumericInputSlider;
