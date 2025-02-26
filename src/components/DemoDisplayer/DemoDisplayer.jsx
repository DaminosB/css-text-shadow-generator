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
  faChevronLeft,
  faChevronRight,
  faQuestion,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const DemoDisplayer = () => {
  const [demoStep, setDemoStep] = useState(0);

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

    const demoWindowPositions = {
      top:
        focusedContainerRect.top +
        focusedContainerRect.height / 2 -
        demoWindow.offsetHeight / 2,
      left: scrollerRight,
    };

    if (scroller && scrollerTop > focusedContainerRect.top) {
      const difference = scrollerTop - focusedContainerRect.top;
      demoWindowPositions.top += difference;
      scroller?.scrollBy({ top: -difference, behavior: "smooth" });
    } else if (scroller && scrollerBottom < focusedContainerRect.bottom) {
      const difference = focusedContainerRect.bottom - scrollerBottom;
      demoWindowPositions.top -= difference;
      scroller?.scrollBy({ top: difference, behavior: "smooth" });
    }

    demoWindow.style.transform = `translate(${demoWindowPositions.left}px, ${demoWindowPositions.top}px)`;
  }, []);

  const toggleDemoMode = useCallback(() => {
    const newBoolean = !isDemoMode;

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
  }, [
    isDemoMode,
    currentStep,
    dispatch,
    posDemoWindow,
    setIsDemoMode,
    textSettings,
  ]);

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

  useEffect(() => {
    posDemoWindow(currentStep);
  }, []);

  return (
    <>
      <button className={styles.toogleButton} onClick={toggleDemoMode}>
        <FontAwesomeIcon icon={faQuestion} />
      </button>
      <div
        className={`${styles.demoDisplayer} ${isDemoMode ? styles.open : ""}`}
      >
        <div className={`${styles.demoWindow} focused`} ref={demoWindowRef}>
          <button onClick={toggleDemoMode}>
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
