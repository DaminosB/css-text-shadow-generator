import styles from "./DemoDisplayer.module.css";

import { useEffect, useMemo, useRef, useCallback, Fragment } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  replaceSettings,
  updateControls,
} from "@/features/workflow/workflowSlice";

import { iconsList } from "@/assets/icons/iconsLibrary";

import BoxHeader from "@/components/headers/BoxHeader/BoxHeader";
import CurrentStep from "../CurrentStep/CurrentStep";

import parse from "@/utils/parse";
import adjustBoxPosition from "@/utils/adjustBoxPosition";

const DemoDisplayer = () => {
  const controls = useSelector((state) => state.workflow.controls);
  const dispatch = useDispatch();

  const demoControls = useMemo(() => controls.demo, [controls.demo]);

  const { changeStep, currentStep, stepIndex } = useDemoStep(
    demoControls,
    controls.sidebar
  );

  const demoBoxRef = useRef(null);

  const closeDemoMode = useCallback(() => {
    const focusedContainer = document.getElementById(
      currentStep.demoConfig.target.id
    );

    focusedContainer.classList.remove("focused");

    dispatch(replaceSettings(demoControls.cache));
    dispatch(updateControls({ target: "demo", key: "step", value: null }));
    dispatch(updateControls({ target: "demo", key: "cache", value: null }));

    const modal = document.getElementById("demo");
    modal.close();
  }, [demoControls.cache, currentStep, dispatch]);

  useEffect(() => {
    if (stepIndex == null) return;

    const controller = new AbortController();
    const { signal } = controller;

    window.addEventListener(
      "keydown",
      (e) => {
        switch (e.code) {
          case "ArrowRight":
            if (stepIndex < demoControls.content.length - 1)
              changeStep(stepIndex + 1);
            break;

          case "ArrowLeft":
            if (stepIndex > 0) changeStep(stepIndex - 1);
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
  }, [
    dispatch,
    demoControls.content.length,
    stepIndex,
    closeDemoMode,
    changeStep,
  ]);

  const handleChangeStep = useCallback(
    (e) => {
      const index = parse(e.currentTarget.dataset.index);

      changeStep(index);
    },
    [changeStep]
  );
  const actions = useMemo(
    () => ({
      closeDemoMode: { callback: closeDemoMode, disabled: false },
    }),
    [closeDemoMode]
  );

  const buttons = useMemo(
    () =>
      Object.entries(demoControls.buttons).reduce(
        (acc, [controlName, data]) => {
          const newConfig = { ...data.config };
          if (newConfig.type === "action") {
            newConfig.action = actions[data.config.value];
          }

          acc[controlName] = { ...data, config: newConfig };
          return acc;
        },
        {}
      ),
    [demoControls.buttons, actions]
  );

  return (
    <dialog
      id="demo"
      ref={demoBoxRef}
      className={styles.demoBox}
      onClick={handleOnClick}
    >
      <BoxHeader
        icon={iconsList.Play}
        label={"Tutorial"}
        path={["controls", "demo", "buttons"]}
        buttons={buttons}
      />
      <CurrentStep currentStep={currentStep} onClick={handleChangeStep} />
    </dialog>
  );
};

export default DemoDisplayer;

const useDemoStep = (demoControls, sidebarControls) => {
  const dispatch = useDispatch();

  const currentStep = useMemo(
    () => demoControls.content[demoControls.step] || demoControls.content[0],
    [demoControls]
  );

  const stepIndex = useMemo(() => demoControls.step, [demoControls.step]);

  useEffect(() => {
    if (demoControls.step == null) return;

    posDemoBox(currentStep);

    dispatch(replaceSettings(currentStep.state));

    const newSidebarControls = {
      isOpen: !currentStep.demoConfig.target.id.includes("userText"),
      content: currentStep.demoConfig.target.category ?? null,
    };

    if (sidebarControls.isOpen !== newSidebarControls.isOpen) {
      dispatch(
        updateControls({
          target: "sidebar",
          key: "isOpen",
          value: newSidebarControls.isOpen,
        })
      );
    }

    if (
      newSidebarControls.content &&
      sidebarControls.content !== newSidebarControls.content
    ) {
      dispatch(
        updateControls({
          target: "sidebar",
          key: "content",
          value: newSidebarControls.content,
        })
      );
    }

    if (currentStep.demoConfig.target.index != null) {
      requestAnimationFrame(() => {
        const scroller = document.getElementById(
          currentStep.demoConfig.target.category
        );

        const scrollTarget = scroller.querySelector("[data-role='ghost']")
          .children[currentStep.demoConfig.target.index].offsetTop;

        scroller.scrollTo({ top: scrollTarget, behavior: "smooth" });
      });
    }
  }, [dispatch, demoControls.step, sidebarControls, currentStep]);

  const changeStep = useCallback(
    (newIndex) => {
      if (newIndex >= demoControls.content.length) return;

      dispatch(
        updateControls({ target: "demo", key: "step", value: newIndex })
      );

      requestAnimationFrame(() => {
        const currentFocusedContainer = document.getElementById(
          currentStep.demoConfig.target.id
        );
        if (currentFocusedContainer)
          currentFocusedContainer.classList.remove("focused");

        const nextFocusedContainer = document.getElementById(
          demoControls.content[newIndex].demoConfig.target.id
        );
        if (nextFocusedContainer) nextFocusedContainer.classList.add("focused");
      });
    },
    [dispatch, currentStep, demoControls]
  );

  return { changeStep, currentStep, stepIndex };
};

const posDemoBox = (currentStep) => {
  requestAnimationFrame(() => {
    const { demoConfig } = currentStep;

    const targetElement = document.getElementById(demoConfig.target.id);
    const scroller = targetElement.closest('[data-role="scroller"]');

    const sidebar = targetElement.closest("nav");

    const demoBox = document.getElementById("demo");

    const targetElementRect = targetElement.getBoundingClientRect();

    const clonedTargetRect = Object.assign({}, targetElementRect.toJSON());

    const {
      top: targetTop,
      bottom: targetBottom,
      height: targetHeight,
    } = targetElementRect;

    let newX = sidebar?.scrollWidth || 0;
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
  });
};

const handleOnClick = (e) => {
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
        { transform: `translate(${boxRect.x - 20}px, ${boxRect.y}px)` },
        { transform: `translate(${boxRect.x + 20}px, ${boxRect.y}px)` },
        { transform: `translate(${boxRect.x - 10}px, ${boxRect.y}px)` },
        { transform: `translate(${boxRect.x + 10}px, ${boxRect.y}px)` },
        { transform: `translate(${boxRect.x - 5}px, ${boxRect.y}px)` },
        { transform: `translate(${boxRect.x + 5}px, ${boxRect.y}px)` },
        { transform: `translate(${boxRect.x}px, ${boxRect.y}px)` },
      ],
      { duration: 750, iterations: 1 }
    );
  }
};
