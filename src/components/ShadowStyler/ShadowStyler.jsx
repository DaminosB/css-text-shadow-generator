import styles from "./ShadowStyler.module.css";

import { useContext, useMemo, useRef, useState, useCallback } from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { removeShadow } from "@/features/textSettings/textSettingsSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

import InputDisplayer from "@/inputs/InputDisplayer/InputDisplayer";
import ToolBar from "../ToolBar/ToolBar";

const ShadowStyler = ({ shadow, path, index, startDragging }) => {
  const textSettings = useSelector((store) => store.textSettings);

  const { shadows } = textSettings;

  const dispatch = useDispatch();

  const [infoText, setInfoText] = useState("");
  // const [showContent, setShowContent] = useState(true);

  const showContent = useMemo(
    () => shadow.controls.open.config.value,
    [shadow]
  );

  const shouldUnmount = useRef(false);

  const stylerRef = useRef(null);

  const isVisible = useMemo(
    () => shadow.controls.enable.config.value,
    [shadow]
  );

  // Adds the 'hidden' class to the styler and adjusts the scroller's position if needed
  const hideStyler = useCallback(() => {
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
  }, []);

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

  const unMountComponent = () => {
    if (shouldUnmount.current) {
      dispatch(removeShadow(shadow.id));
    }
  };

  const containerClasses = useMemo(() => {
    let response = styles.shadowStyler;
    if (!showContent) response += ` ${styles.closed}`;
    if (!isVisible) response += ` ${styles.inactive}`;

    return response;
  }, [showContent, isVisible]);

  const actions = useMemo(
    () => ({
      trashcan: { action: hideStyler, disabled: shadows.length === 1 },
    }),
    [shadows, hideStyler]
  );

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
        {/* <p className={styles.infoText}>{infoText}</p> */}
        <ToolBar
          controls={shadow.controls}
          path={[...path, "controls"]}
          actions={actions}
        />
        {/* <div className={styles.toolsContainer}>

          <button
            id={`shadow-${shadow.id}_button-isVisible`}
            value={isVisible}
            title="Enable/Disable"
            onClick={toggleVisibility}
            onPointerEnter={toggleInfoText}
            onPointerLeave={toggleInfoText}
          >
            <FontAwesomeIcon icon={isVisible ? faEye : faEyeSlash} />
          </button>
          <button
            title="Highlight"
            disabled={!isVisible}
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
        </div> */}
      </div>
      <div className={styles.inputContainer}>
        {Object.entries(shadow.inputs).map(([inputName, config]) => {
          const inputPath = [...path, "inputs", inputName];
          return (
            <InputDisplayer
              key={config.inputId}
              config={config}
              path={inputPath}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ShadowStyler;
