import styles from "./DemoDisplayer.module.css";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from "react";
import { WorkspaceCtxt } from "../../workspace-window/Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { replaceState } from "@/features/controls/controlsSlice";

import demoPattern from "@/config/builders/createDemoPattern";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import Modale from "@/components/wrappers/Modale/Modale";

import parse from "@/utils/parse";
import adjustBoxPosition from "@/utils/adjustBoxPosition";

const DemoDisplayer = () => {
  const { modaleContent, setModaleContent } = useContext(WorkspaceCtxt);

  const isDemoMode = useMemo(() => modaleContent === "demo", [modaleContent]);

  const [demoStep, setDemoStep] = useState(0);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);

  const controls = useSelector((state) => state.controls);

  const dispatch = useDispatch();

  const demoBoxRef = useRef(null);
  const confirmationBoxRef = useRef(null);

  const currentStep = useMemo(() => demoPattern[demoStep], [demoStep]);

  const cachedState = useRef(controls);

  const posDemoBox = useCallback((currentStep) => {
    const { demoConfig } = currentStep;

    const targetElement = document.getElementById(demoConfig.targetId);
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

  const closeDemoMode = useCallback(() => {
    const focusedContainer = document.getElementById(
      currentStep.demoConfig.targetId
    );

    focusedContainer.classList.remove("focused");
    dispatch(replaceState(cachedState.current));
    setModaleContent(null);
  }, [currentStep, dispatch, setModaleContent]);

  const navigateDemoMode = useCallback(
    (newIndex) => {
      setDemoStep(newIndex);
      const newStep = demoPattern[newIndex];
      dispatch(replaceState(newStep.state));
      requestAnimationFrame(() => {
        const currentFocusedContainer = document.getElementById(
          currentStep.demoConfig.targetId
        );
        if (currentFocusedContainer)
          currentFocusedContainer.classList.remove("focused");

        const nextFocusedContainer = document.getElementById(
          demoPattern[newIndex].demoConfig.targetId
        );
        if (nextFocusedContainer) nextFocusedContainer.classList.add("focused");
      });
    },
    [currentStep, dispatch]
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
      if (parse(e.currentTarget.value)) closeDemoMode();
    },
    [setShowConfirmationBox, closeDemoMode]
  );

  useEffect(() => {
    if (!isDemoMode) return;

    posDemoBox(currentStep);
    dispatch(replaceState(currentStep.state));

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
              closeDemoMode();
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
    displayConfirmationBox,
    closeDemoMode,
    navigateDemoMode,
    posDemoBox,
    dispatch,
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
            <button onClick={() => closeDemoMode()}>
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
