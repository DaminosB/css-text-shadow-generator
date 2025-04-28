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

import adjustBoxPosition from "@/utils/adjustBoxPosition";

const DemoDisplayer = () => {
  const { modalContent, manageModale } = useContext(WorkspaceCtxt);

  const isDemoMode = useMemo(() => modalContent === "demo", [modalContent]);
  const [demoStep, setDemoStep] = useState(0);
  const currentStep = useMemo(() => demoPattern[demoStep], [demoStep]);

  const controls = useSelector((state) => state.controls);
  const dispatch = useDispatch();
  const cachedState = useRef(controls);

  const demoBoxRef = useRef(null);

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
    manageModale("demo", false);
  }, [currentStep, dispatch, manageModale]);

  const navigateDemoMode = useCallback(
    (newIndex) => {
      setDemoStep(newIndex);

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
    [currentStep]
  );

  const handleOnClick = useCallback((e) => {
    const box = e.currentTarget;

    const boxRect = box.getBoundingClientRect();

    const isOutside =
      e.clientX < Math.round(boxRect.left) ||
      e.clientX > Math.round(boxRect.right) ||
      e.clientY < Math.round(boxRect.top) ||
      e.clientY > Math.round(boxRect.bottom);

    if (isOutside) {
      box.animate(
        [
          { backgroundColor: "var(--primary-color)" },
          { transform: `translate(${boxRect.x - 20}px, ${boxRect.y}px)` },
          { transform: `translate(${boxRect.x + 20}px, ${boxRect.y}px)` },
          { transform: `translate(${boxRect.x - 10}px, ${boxRect.y}px)` },
          { transform: `translate(${boxRect.x + 10}px, ${boxRect.y}px)` },
          { transform: `translate(${boxRect.x - 5}px, ${boxRect.y}px)` },
          { transform: `translate(${boxRect.x + 5}px, ${boxRect.y}px)` },
          { transform: `translate(${boxRect.x}px, ${boxRect.y}px)` },
        ],
        { duration: 1000, iterations: 1 }
      );
    }
  }, []);

  const handleCloseDemoMode = useCallback(
    (e) => {
      e.stopPropagation();
      closeDemoMode();
    },
    [closeDemoMode]
  );

  useEffect(() => {
    if (isDemoMode) {
      posDemoBox(currentStep);

      dispatch(replaceState(currentStep.state));

      const controller = new AbortController();
      const { signal } = controller;

      window.addEventListener(
        "keydown",
        (e) => {
          switch (e.code) {
            case "ArrowRight":
              if (demoStep < demoPattern.length - 1)
                navigateDemoMode(demoStep + 1);
              break;

            case "ArrowLeft":
              if (demoStep > 0) navigateDemoMode(demoStep - 1);
              break;

            case "Escape":
              closeDemoMode();
              break;

            default:
              break;
          }
        },
        { signal }
      );

      return () => controller.abort();
    }
  }, [
    controls,
    dispatch,
    isDemoMode,
    demoStep,
    currentStep,
    closeDemoMode,
    navigateDemoMode,
    posDemoBox,
  ]);

  return (
    <dialog
      id="demo"
      ref={demoBoxRef}
      className={`${styles.demoBox} focused`}
      onClick={handleOnClick}
    >
      <button onClick={handleCloseDemoMode}>
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
    </dialog>
  );
};

export default DemoDisplayer;
