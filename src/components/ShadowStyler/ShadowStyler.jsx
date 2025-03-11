import styles from "./ShadowStyler.module.css";

import { useContext, useMemo, useRef, useState } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import {
  updateShadow,
  removeShadow,
} from "@/features/textSettings/textSettingsSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSun,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";

import NumericInputSlider from "@/inputs/NumericInputSlider/NumericInputSlider";
import ColorInput from "@/inputs/ColorInput/ColorInput";
import CheckboxButton from "@/inputs/CheckboxButton/CheckboxButton";

import parse from "@/utils/parse";

const ShadowStyler = ({ shadow, index, startDragging }) => {
  const textSettings = useSelector((store) => store.textSettings);

  const { shadows } = textSettings;

  const dispatch = useDispatch();

  const [infoText, setInfoText] = useState("");
  const [showContent, setShowContent] = useState(true);

  const shouldUnmount = useRef(false);

  const stylerRef = useRef(null);

  const { highlightShadow } = useContext(WorkspaceCtxt);

  // Adds the 'hidden' class to the styler and adjusts the scroller's position if needed
  const hideStyler = () => {
    // Select the styler element and hide it
    const styler = stylerRef.current;
    styler.classList.add(styles.hidden);

    // Find the nearest scrollable container
    const scroller = styler.closest("[data-role='scroller']");

    // Calculate the height of the scroller after the styler is removed
    const newScrollerHeight = scroller.scrollHeight - styler.offsetHeight;

    // Determine the current bottom position of the scroller
    const scrollerBottom = scroller.scrollTop + scroller.offsetHeight;

    // If the new height is smaller than the current bottom position, adjust the scroll
    if (newScrollerHeight < scrollerBottom) {
      scroller.scrollBy({
        top: newScrollerHeight - scrollerBottom,
        behavior: "smooth",
      });
    }

    // Mark the ref to indicate that the styler should be unmounted once the transition ends
    shouldUnmount.current = true;
  };

  const handleUpdateShadow = (newProperty) => {
    dispatch(updateShadow({ ...newProperty, id: shadow.id }));
  };

  const toggleProperty = (e) => {
    const newProperty = {
      key: e.currentTarget.name,
      value: !parse(e.currentTarget.value),
    };
    dispatch(updateShadow({ ...newProperty, id: shadow.id }));
  };

  const toggleInfoText = (e) => {
    switch (e.type) {
      case "pointerleave":
        setInfoText("");
        break;

      case "pointerenter":
        setInfoText(e.currentTarget.title);
        break;

      default:
        break;
    }
  };

  const handleHighlight = (e) => {
    if (shadow.inputs.isVisible.value) {
      switch (e.type) {
        case "pointerenter":
          highlightShadow(index);
          break;
        case "pointerleave":
          highlightShadow(null);
          break;

        default:
          break;
      }
    }
    toggleInfoText(e);
  };

  const toggleState = (setState) => {
    setState((prev) => !prev);
  };

  const unMountComponent = () => {
    if (shouldUnmount.current) {
      dispatch(removeShadow(shadow.id));
      // shouldUnmount.current = false;
    }
  };

  const columnedInputs = useMemo(
    () =>
      Object.entries(shadow.inputs).filter((input) => input[0] !== "isVisible"),
    [shadow]
  );

  const containerClasses = useMemo(() => {
    let response = styles.shadowStyler;
    if (!showContent) response += ` ${styles.closed}`;
    if (!shadow.inputs.isVisible.value) response += ` ${styles.inactive}`;

    return response;
  }, [showContent, shadow.inputs.isVisible]);

  return (
    <div
      id={shadow.id}
      className={containerClasses}
      ref={stylerRef}
      onTransitionEnd={unMountComponent}
      data-role="draggable-container"
    >
      <div className={styles.inactiveMask}></div>
      <div data-role="drag-witness">
        <div className={styles.titleBlock}>
          <h2>#{index + 1}</h2>
          <button onPointerDown={startDragging} disabled={shadows.length === 1}>
            <FontAwesomeIcon icon={faGripVertical} />
          </button>
        </div>
        <p className={styles.infoText}>{infoText}</p>
        <div className={styles.toolsContainer}>
          <button
            id={shadow.inputs.isVisible.inputContainerId}
            value={shadow.inputs.isVisible.value}
            name={shadow.inputs.isVisible.name}
            title="Enable/Disable"
            onClick={toggleProperty}
            onPointerEnter={toggleInfoText}
            onPointerLeave={toggleInfoText}
          >
            <FontAwesomeIcon
              icon={shadow.inputs.isVisible.value ? faEye : faEyeSlash}
            />
          </button>
          <button
            title="Highlight"
            disabled={!shadow.inputs.isVisible.value}
            onPointerEnter={handleHighlight}
            onPointerLeave={handleHighlight}
          >
            <FontAwesomeIcon icon={faSun} />
          </button>
          <button
            id={`shadow-${shadow.id}-remove-button`}
            title="Remove layer"
            onClick={hideStyler}
            onPointerEnter={toggleInfoText}
            onPointerLeave={toggleInfoText}
            disabled={shadows.length === 1}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>

          <button onClick={() => toggleState(setShowContent)}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>
      <div className={styles.inputContainer}>
        {columnedInputs.map((input) => {
          const [inputName, config] = input;
          switch (config.type) {
            case "number":
              return (
                <NumericInputSlider
                  key={config.inputId}
                  inputId={config.inputId}
                  name={inputName}
                  label={config.labeltext}
                  inputContainerId={config.inputContainerId}
                  icon={config.icon}
                  range={config.range}
                  minValue={config.minValue}
                  maxValue={config.maxValue}
                  defaultValue={config.defaultValue}
                  value={config.value}
                  unit="px"
                  setValue={handleUpdateShadow}
                />
              );

            case "color":
              const overrideInput = shadow.inputs[config.depedency];

              return (
                <div key={config.inputId} className={styles.colorSelection}>
                  <ColorInput
                    inputId={config.inputId}
                    inputContainerId={config.inputContainerId}
                    name={inputName}
                    label={config.labeltext}
                    icon={config.icon}
                    defaultValue={config.defaultValue}
                    value={config.value}
                    setValue={handleUpdateShadow}
                    disabled={overrideInput.value}
                  />
                  <CheckboxButton
                    inputId={overrideInput.inputId}
                    inputContainerId={overrideInput.inputContainerId}
                    name={overrideInput.name}
                    onClick={toggleProperty}
                    value={overrideInput.value}
                    text={overrideInput.labelText}
                  />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default ShadowStyler;
