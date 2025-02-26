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

const DemoDisplayer = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);

  const textSettings = useSelector((state) => state.textSettings);

  const { isDemoMode, setIsDemoMode } = useContext(WorkspaceCtxt);

  const demoPattern = useDemoPattern(textSettings);

  const dispatch = useDispatch();

  const demoWindowRef = useRef(null);

  const currentStep = useMemo(
    () => demoPattern[demoStep],
    [demoPattern, demoStep]
  );

  const cachedState = useRef(textSettings);

  const posDemoWindow = useCallback((currentStep) => {
    const focusedContainer = document.getElementById(
      currentStep.inputData.inputContainerId
    );

    const scroller = focusedContainer.closest('[data-role="scroller"]');
    const demoWindow = demoWindowRef.current;

    const focusedContainerRect = focusedContainer.getBoundingClientRect();
    const {
      top: scrollerTop = 0,
      bottom: scrollerBottom = 0,
      right: scrollerRight = 0,
    } = scroller ? scroller.getBoundingClientRect() : {};

    let newX = scrollerRight;
    let newY =
      focusedContainerRect.top +
      focusedContainerRect.height / 2 -
      demoWindow.offsetHeight / 2;

    const bottomOffset = scroller?.lastElementChild.offsetHeight;

    if (scroller && scrollerTop > focusedContainerRect.top) {
      const difference = scrollerTop - focusedContainerRect.top;
      newY += difference;
      scroller?.scrollBy({ top: -difference, behavior: "smooth" });
    } else if (
      scroller &&
      scrollerBottom - bottomOffset < focusedContainerRect.bottom
    ) {
      const difference =
        focusedContainerRect.bottom - scrollerBottom + bottomOffset;
      newY -= difference;
      scroller?.scrollBy({ top: difference, behavior: "smooth" });
    }

    const demoWindowWidth = demoWindow.offsetWidth;
    const demoWindowHeight = demoWindow.offsetHeight;
    newX = adjustBoxPosition(newX, demoWindowWidth, "x");
    newY = adjustBoxPosition(newY, demoWindowHeight, "y");

    demoWindow.style.transform = `translate(${newX}px, ${newY}px)`;
  }, []);

  const adjustBoxPosition = useCallback((initialPosition, boxSize, axis) => {
    const windowSize = axis === "x" ? window.innerWidth : window.innerHeight;
    return Math.max(0, Math.min(initialPosition, windowSize - boxSize));
  }, []);

  const toggleDemoMode = useCallback(
    (newBoolean) => {
      setIsDemoMode(newBoolean);

      const focusedContainer = document.getElementById(
        currentStep.inputData.inputContainerId
      );

      if (newBoolean) {
        posDemoWindow(currentStep);
        focusedContainer.classList.add("focused");
        dispatch(replaceState(currentStep.state));
        cachedState.current = textSettings;
      } else {
        focusedContainer.classList.remove("focused");
        dispatch(replaceState(cachedState.current));
      }
    },
    [currentStep, dispatch, posDemoWindow, setIsDemoMode, textSettings]
  );

  const navigateDemoMode = useCallback(
    (newIndex) => {
      setDemoStep(newIndex);
      const newStep = demoPattern[newIndex];
      dispatch(replaceState(newStep.state));
      requestAnimationFrame(() => {
        posDemoWindow(newStep);

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
    [currentStep, dispatch, posDemoWindow, demoPattern]
  );

  const displayConfirmationBox = useCallback(
    (e) => {
      const confirmationBox = Array.from(e.target.children).find((child) =>
        child.className.includes(styles.confirmationBox)
      );

      const boxWidth = confirmationBox.offsetWidth;
      const boxHeight = confirmationBox.offsetHeight;

      let newX = e.clientX - boxWidth / 2;
      let newY = e.clientY - boxHeight / 2;

      newX = adjustBoxPosition(newX, boxWidth, "x");
      newY = adjustBoxPosition(newY, boxHeight, "y");

      confirmationBox.style.transform = `translate(${newX}px, ${newY}px)`;

      setShowConfirmationBox(true);
    },
    [setShowConfirmationBox, adjustBoxPosition]
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
      e.stopPropagation();
      setShowConfirmationBox(false);

      if (parse(e.currentTarget.value)) toggleDemoMode(false);
    },
    [setShowConfirmationBox, toggleDemoMode]
  );

  useEffect(() => {
    posDemoWindow(currentStep);
  }, []);

  const demoDisplayerClasses = useMemo(
    () =>
      `${styles.demoDisplayer} ${isDemoMode ? styles.open : ""} ${
        showConfirmationBox ? styles.darker : ""
      }`,
    [isDemoMode, showConfirmationBox]
  );

  return (
    <>
      <button
        className={styles.toogleButton}
        onClick={() => toggleDemoMode(!isDemoMode)}
      >
        <FontAwesomeIcon icon={faQuestion} />
      </button>
      <div className={demoDisplayerClasses} onClick={displayConfirmationBox}>
        <div
          className={`${styles.confirmationBox} ${
            showConfirmationBox ? "" : "hidden"
          } focused`}
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
        <div
          className={`${styles.demoWindow} focused`}
          ref={demoWindowRef}
          onClick={handleDemoWindowClick}
        >
          <button onClick={() => toggleDemoMode(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <p>{demoStep !== null && currentStep.demoText}</p>
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
    </>
  );
};

export default DemoDisplayer;
