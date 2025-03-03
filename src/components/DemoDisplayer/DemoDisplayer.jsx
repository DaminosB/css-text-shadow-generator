import styles from "./DemoDisplayer.module.css";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from "react";
import { WorkspaceCtxt } from "../Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { replaceState } from "@/features/textSettings/textSettingsSlice";

import useDemoPattern from "@/hooks/useDemoPattern";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faQuestion,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import parse from "@/utils/parse";
import Modale from "@/wrappers/Modale/Modale";

const DemoDisplayer = () => {
  const { modaleContent, setModaleContent } = useContext(WorkspaceCtxt);

  const isDemoMode = useMemo(() => modaleContent === "demo", [modaleContent]);

  const [demoStep, setDemoStep] = useState(0);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);

  const textSettings = useSelector((state) => state.textSettings);

  const demoPattern = useDemoPattern(textSettings);

  const dispatch = useDispatch();

  const demoBoxRef = useRef(null);
  const confirmationBoxRef = useRef(null);

  const currentStep = useMemo(
    () => demoPattern[demoStep],
    [demoPattern, demoStep]
  );

  const cachedState = useRef(textSettings);

  const posDemoBox = useCallback((currentStep) => {
    const { inputData, demoConfig } = currentStep;

    const targetElement = document.getElementById(inputData.inputContainerId);
    const scroller = targetElement.closest('[data-role="scroller"]');
    const demoBox = demoBoxRef.current;

    const targetElementRect = targetElement.getBoundingClientRect();

    const clonedTargetRect = Object.assign({}, targetElementRect.toJSON());

    const {
      top: targetTop,
      bottom: targetBottom,
      left: targetLeft,
      right: targetRight,
      height: targetHeight,
    } = targetElementRect;

    let newX =
      demoConfig.alignment === "left"
        ? targetLeft - demoBox.offsetWidth
        : targetRight;
    let newY = targetTop + targetHeight / 2 - demoBox.offsetHeight / 2;

    if (scroller) {
      const { top: scrollerTop, bottom: scrollerBottom } =
        scroller.getBoundingClientRect();

      const isAboveViewport = targetTop < scrollerTop;
      const isBelowViewport = targetBottom > scrollerBottom;

      if (isAboveViewport) {
        const offset = scrollerTop - targetTop;
        newY += offset;
        clonedTargetRect.top += offset;
        clonedTargetRect.bottom += offset;
        scroller.scrollBy({ top: -offset, behavior: "smooth" });
      }

      if (isBelowViewport) {
        const offset = targetBottom - scrollerBottom;
        newY -= offset;
        clonedTargetRect.top -= offset;
        clonedTargetRect.bottom -= offset;
        scroller.scrollBy({ top: offset, behavior: "smooth" });
      }
    }

    const boxSize = {
      width: demoBox.offsetWidth,
      height: demoBox.offsetHeight,
    };
    ({ adjustedX: newX, adjustedY: newY } = adjustBoxPosition(
      newX,
      newY,
      boxSize,
      clonedTargetRect
    ));
    demoBox.style.transform = `translate(${newX}px, ${newY}px)`;
  }, []);

  const toggleDemoMode = useCallback(
    (enable) => {
      const focusedContainer = document.getElementById(
        currentStep.inputData.inputContainerId
      );
      if (enable) {
        setModaleContent("demo");
        focusedContainer.classList.add("focused");
        dispatch(replaceState(currentStep.state));
        cachedState.current = textSettings;
      } else {
        focusedContainer.classList.remove("focused");
        dispatch(replaceState(cachedState.current));
        setModaleContent(null);
      }
    },
    [currentStep, dispatch, setModaleContent, textSettings]
  );

  const navigateDemoMode = useCallback(
    (newIndex) => {
      setDemoStep(newIndex);
      const newStep = demoPattern[newIndex];
      dispatch(replaceState(newStep.state));
      requestAnimationFrame(() => {
        const currentFocusedContainer = document.getElementById(
          currentStep.inputData.inputContainerId
        );
        if (currentFocusedContainer)
          currentFocusedContainer.classList.remove("focused");

        const nextFocusedContainer = document.getElementById(
          demoPattern[newIndex].inputData.inputContainerId
        );
        if (nextFocusedContainer) nextFocusedContainer.classList.add("focused");
      });
    },
    [currentStep, dispatch, demoPattern]
  );

  const displayConfirmationBox = useCallback(
    (x, y, confirmationBox) => {
      const boxSize = {
        width: confirmationBox.offsetWidth,
        height: confirmationBox.offsetHeight,
      };

      let newX = x - boxSize.width / 2;
      let newY = y - boxSize.height / 2;

      ({ adjustedX: newX, adjustedY: newY } = adjustBoxPosition(
        newX,
        newY,
        boxSize
      ));

      confirmationBox.style.transform = `translate(${newX}px, ${newY}px)`;

      setShowConfirmationBox(true);
    },
    [setShowConfirmationBox]
  );

  const handleDisplayConfirmationBox = useCallback(
    (e) => {
      const confirmationBox = confirmationBoxRef.current;

      displayConfirmationBox(e.clientX, e.clientY, confirmationBox);
    },
    [displayConfirmationBox]
  );

  const handleDemoWindowClick = useCallback(
    (e) => {
      e.stopPropagation();
      setShowConfirmationBox(false);
    },
    [setShowConfirmationBox]
  );

  const handleConfirmationBoxClick = useCallback(
    (e) => {
      setShowConfirmationBox(false);
      if (parse(e.currentTarget.value)) toggleDemoMode(false);
    },
    [setShowConfirmationBox, toggleDemoMode]
  );

  useEffect(() => {
    if (!isDemoMode) return;

    posDemoBox(currentStep);

    const controller = new AbortController();
    const { signal } = controller;

    window.addEventListener(
      "keydown",
      (e) => {
        demoBoxRef.current.focus();

        const confirmationBox = confirmationBoxRef.current;

        switch (e.code) {
          case "ArrowRight":
            if (demoStep < demoPattern.length - 1) {
              navigateDemoMode(demoStep + 1);
            } else {
              displayConfirmationBox(
                window.innerWidth / 2,
                window.innerHeight / 2,
                confirmationBox
              );
            }
            break;

          case "ArrowLeft":
            if (demoStep > 0) navigateDemoMode(demoStep - 1);
            break;

          case "Escape":
            if (showConfirmationBox) {
              setShowConfirmationBox(false);
            } else {
              displayConfirmationBox(
                window.innerWidth / 2,
                window.innerHeight / 2,
                confirmationBox
              );
            }
            break;

          case "Enter":
            if (showConfirmationBox) {
              setShowConfirmationBox(false);
              toggleDemoMode(false);
            }
            break;

          default:
            break;
        }
      },
      { signal }
    );

    return () => controller.abort();
  }, [
    isDemoMode,
    demoStep,
    showConfirmationBox,
    currentStep,
    demoPattern,
    displayConfirmationBox,
    toggleDemoMode,
    navigateDemoMode,
    posDemoBox,
  ]);

  return (
    <>
      <Modale
        darkBackground={showConfirmationBox}
        onClick={handleDisplayConfirmationBox}
        isOpen={isDemoMode}
      >
        <div
          className={`${styles.confirmationBox} ${
            showConfirmationBox ? "" : "hidden"
          } focused`}
          ref={confirmationBoxRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h3>Leave the demo mode?</h3>
          </div>
          <div>
            <button value={true} onClick={handleConfirmationBoxClick}>
              <FontAwesomeIcon icon={faCheck} /> <span>Yes</span>
            </button>
            <button value={false} onClick={handleConfirmationBoxClick}>
              <FontAwesomeIcon icon={faXmark} /> <span>No</span>
            </button>
          </div>
        </div>
        <div ref={demoBoxRef} onClick={handleDemoWindowClick}>
          <div className={`${styles.demoBox} focused`}>
            <button onClick={() => toggleDemoMode(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <p>{demoStep !== null && currentStep.demoConfig.text}</p>
            <div>
              <button
                className={demoStep === 0 ? "hidden" : ""}
                onClick={() => navigateDemoMode(demoStep - 1)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>Prev</span>
              </button>
              <button
                className={demoStep === demoPattern.length - 1 ? "hidden" : ""}
                onClick={() => navigateDemoMode(demoStep + 1)}
              >
                <span>Next</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </Modale>
    </>
  );
};

export default DemoDisplayer;

const adjustBoxPosition = (x, y, boxSize, avoidRect) => {
  let adjustedX = Math.max(0, Math.min(x, window.innerWidth - boxSize.width));
  let adjustedY = Math.max(0, Math.min(y, window.innerHeight - boxSize.height));

  if (avoidRect) {
    const isOverlappingX =
      (adjustedX >= avoidRect.left && adjustedX < avoidRect.right) ||
      (avoidRect.left >= adjustedX &&
        avoidRect.left < adjustedX + boxSize.width);

    if (isOverlappingX) {
      if (avoidRect.top - boxSize.height < 0) {
        adjustedY = avoidRect.bottom;
      } else {
        adjustedY = avoidRect.top - boxSize.height;
      }

      adjustedX = Math.max(
        0,
        Math.min(
          avoidRect.left + avoidRect.width / 2 - boxSize.width / 2,
          window.innerWidth - boxSize.width
        )
      );
    }
  }

  return { adjustedX, adjustedY };
};
