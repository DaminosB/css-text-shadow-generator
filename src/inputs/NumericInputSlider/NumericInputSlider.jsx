import styles from "./NumericInputSlider.module.css";

import { useEffect, useState, useRef, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputFrame from "../InputFrame/InputFrame";

import parse from "@/utils/parse";

const NumericInputSlider = ({
  inputId,
  name,
  label,
  inputContainerId,
  icon,
  range,
  value,
  defaultValue,
  unit,
  setValue,
  minValue,
  maxValue,
}) => {
  const [rangeMinValue, rangeMaxValue] = useMemo(() => range, [range]);

  const isOutOfRange = useMemo(() => {
    if (value < rangeMinValue || value > rangeMaxValue) return true;
    else return false;
  }, [value, rangeMinValue, rangeMaxValue]);

  const [isGrabbing, setIsGrabbing] = useState(false);

  const updateValue = (e) => {
    let shouldUpdate = true;

    if (e.type === "pointermove") shouldUpdate = isGrabbing && e.buttons === 1;

    if (shouldUpdate) {
      const knob = knobRef.current;
      const container = knob.parentNode;
      const cursorPosition = Math.round(
        e.clientX - container.getBoundingClientRect().left
      );

      const positionRatio = cursorPosition / container.offsetWidth;

      const newValue = Math.round(
        positionRatio * (rangeMaxValue - rangeMinValue) + rangeMinValue
      );

      const input = document.getElementById(inputId);

      setValue({ key: input.name, value: newValue });
    }
  };

  const knobRef = useRef(null);

  const handleGrabbingEvents = (e) => {
    switch (e.type) {
      case "pointerdown":
        setIsGrabbing(true);
        break;
      case "pointerup":
        setIsGrabbing(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const knob = knobRef.current;
    const container = knob.parentNode;

    let valueRatio = (value - rangeMinValue) / (rangeMaxValue - rangeMinValue);
    if (valueRatio < 0) valueRatio = 0;
    else if (valueRatio > 1) valueRatio = 1;

    const knobPosition =
      (container.offsetWidth - knob.offsetWidth) * valueRatio;

    knob.style.transform = `translate(${knobPosition}px, -50%)`;
  }, [value, rangeMinValue, rangeMaxValue]);

  const handleOnChange = (e) => {
    let newValue = parse(e.target.value);

    if (newValue < minValue) newValue = minValue;
    else if (e.target.value > maxValue) newValue = maxValue;

    setValue({ key: e.target.name, value: newValue });
  };

  const handleOnBlur = (e) => {
    if (e.target.value === "")
      setValue({ key: e.target.name, value: defaultValue });
  };

  return (
    <InputFrame
      inputId={inputId}
      inputContainerId={inputContainerId}
      label={label}
    >
      <div>
        <FontAwesomeIcon icon={icon} />
        <div className={styles.inputContainer}>
          <input
            type="number"
            name={name}
            id={inputId}
            min={minValue}
            max={maxValue}
            value={value}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
          />
          <span>{unit}</span>
        </div>
      </div>
      <div
        className={`${styles.sliderContainer} ${
          isOutOfRange ? "ethereal" : ""
        }`}
        title={isOutOfRange ? "The value is out of range" : ""}
        onPointerMove={updateValue}
      >
        <button
          ref={knobRef}
          className="grabbable"
          onPointerDown={handleGrabbingEvents}
          onPointerUp={handleGrabbingEvents}
        ></button>
        <div className={styles.track} onClick={updateValue}></div>
      </div>
    </InputFrame>
  );
};

export default NumericInputSlider;
