import styles from "./PatternsList.module.css";

import { useRef, useState, useMemo, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  commitSettings,
  updateCollection,
} from "@/features/workflow/workflowSlice";

import BoxHeader from "@/components/headers/BoxHeader/BoxHeader";
import Pattern from "../Pattern/Pattern";

import { iconsList } from "@/assets/icons/iconsLibrary";

import interpolate from "@/utils/interpolate";
import clamp from "@/utils/clamp";
import resolvePath from "@/utils/resolvePath";

const PatternsList = ({ path }) => {
  const target = useSelector((store) => resolvePath(store.workflow, path));

  const [grabbedLayer, setGrabbedLayer] = useState(null);

  const scrollerRef = useRef(null);

  const dispatch = useDispatch();

  const dragLayer = useCallback(
    (pdEvent) => {
      pdEvent.preventDefault();

      const container = pdEvent.currentTarget.closest(
        '[data-role="container"]'
      );
      const scroller = container.closest('[data-role="scroller"]');
      const [contentWindow, dropZone, dragWitness] = Array.from(
        scroller.firstElementChild.children
      );
      const initialIndex = Array.from(contentWindow.children).findIndex(
        (sibling) => sibling === container
      );
      const containerRect = container.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();

      let dragWitnessPosition = containerRect.y - scrollerRect.y;
      dragWitness.style.transform = `translateY(${dragWitnessPosition}px)`;
      dragWitness.classList = styles.active;

      const headers = Array.from(dropZone.children);

      const headersPositions = headers.map((header) => ({
        top: header.offsetTop + scrollerRect.y,
        get bottom() {
          return this.top + header.offsetHeight;
        },
      }));

      let currentIndex = initialIndex;
      let dropZonePosition =
        containerRect.y - headersPositions[initialIndex].top;
      let cursorY = pdEvent.clientY - dropZonePosition;

      dropZone.style.transform = `translateY(${dropZonePosition}px)`;

      setGrabbedLayer(currentIndex);

      const dragging = (pmEvent) => {
        pmEvent.preventDefault();

        dropZone.classList = styles.active;
        contentWindow.classList = styles.inactive;
        scroller.classList.add(styles.inactive);

        const newCursorY = pmEvent.clientY - dropZonePosition;
        const deltaY = newCursorY - cursorY;
        cursorY = newCursorY;
        dragWitnessPosition += deltaY;
        dragWitness.style.transform = `translateY(${dragWitnessPosition}px)`;

        const newIndex = headersPositions.findIndex(
          (position) =>
            newCursorY > position.top && newCursorY < position.bottom
        );

        if (newIndex !== -1 && newIndex !== currentIndex) {
          const newLayering = [...target.data];

          const [pattern] = newLayering.splice(initialIndex, 1);

          newLayering.splice(newIndex, 0, pattern);

          dispatch(
            updateCollection({
              category: path[2],
              target: pattern,
              newIndex,
            })
          );

          currentIndex = newIndex;
          setGrabbedLayer(newIndex);
        }
      };

      const stopDragging = () => {
        controller.abort();
        setGrabbedLayer(null);

        contentWindow.classList = styles.active;
        dropZone.classList = styles.inactive;
        dragWitness.classList = styles.inactive;
        dragWitness.style.transform = "";
        scroller.classList.remove(styles.inactive);

        if (currentIndex !== initialIndex) {
          const commitlabel = `layer #${initialIndex} moved to #${currentIndex}`;
          dispatch(
            commitSettings({
              category: path[2],
              changedIndex: currentIndex,
              label: commitlabel,
              inputIcon: iconsList.ListNumbers,
            })
          );
        }
      };

      const controller = new AbortController();
      const { signal } = controller;

      window.addEventListener("pointermove", dragging, { signal });
      window.addEventListener("pointerup", stopDragging, { signal });
    },
    [dispatch, path, target.data]
  );

  const openPattern = useCallback(
    (e) => {
      const container = e.currentTarget.closest('[data-role="container"]');

      const containerId = container.id;
      const containerIndex = target.data.findIndex(
        (entry) => entry.id === containerId
      );
      const scroller = container.closest('[data-role="scroller"]');

      const scrolltarget = scroller.querySelector('[data-role="ghost"]')
        .children[containerIndex].offsetTop;

      scroller.scrollTo({ top: scrolltarget, behavior: "smooth" });
    },
    [target.data]
  );

  const removePattern = useCallback(
    (e) => {
      // Select the container element and hide it
      const container = e.currentTarget.closest('[data-role="container"]');
      container.classList.add("hidden");

      const containerPath = JSON.parse(container.dataset.path);

      const containerCategory = containerPath[2];
      const containerIndex = containerPath[4];

      // Find the nearest scrollable container
      const scroller = container.closest("[data-role='scroller']");
      const ghost = scroller.querySelector("[data-role='ghost']");

      const ghostAnchors = Array.from(ghost.children).map(
        (child) => child.offsetTop
      );

      const displayIndex = ghostAnchors.findIndex(
        (anchor) => scroller.scrollTop === anchor
      );

      const nextSibling = container.nextSibling;
      if (nextSibling) {
        const nextSiblingHeader = nextSibling.firstElementChild;
        const gap =
          nextSibling.offsetTop +
          nextSiblingHeader.offsetHeight -
          (container.offsetTop + container.offsetHeight);

        container.style.marginTop = `-${gap}px`;
      }
      container.style.transform = `scaleY(0)`;

      if (displayIndex === containerIndex) {
        scroller.scrollTo({
          top:
            ghostAnchors[containerIndex + 1] ||
            ghostAnchors[containerIndex - 1],
          behavior: "smooth",
        });
      }

      const filteredPath = containerPath.filter(
        (entry, index) => entry !== path[index]
      );

      const pattern = resolvePath(target, filteredPath);

      setTimeout(() => {
        dispatch(
          updateCollection({
            category: containerCategory,
            target: pattern,
            newIndex: null,
          })
        );

        const patternLabel = interpolate(pattern.label, {
          index: containerIndex,
        });

        const commitLabel = `${patternLabel} removed`;

        dispatch(
          commitSettings({
            category: containerCategory,
            targetIndex: displayIndex,
            changedIndex: containerIndex,
            label: commitLabel,
            inputIcon: pattern.buttons.trashcan.config.icon,
          })
        );
      }, 750);
    },
    [dispatch, path, target]
  );

  const actions = useMemo(
    () => ({
      removePattern: {
        callback: removePattern,
        disabled: target.data.length === 1,
      },
      onClick: {
        callback: openPattern,
        disabled: false,
      },
      onPointerDown: {
        callback: dragLayer,
        disabled: target.data.length === 1,
      },
    }),
    [removePattern, openPattern, dragLayer, target.data.length]
  );

  return (
    <div
      id={target.id}
      className={styles.scroller}
      onScroll={displayPattern}
      data-role="scroller"
      ref={scrollerRef}
    >
      <div data-role="display" className={styles.display}>
        <div data-role="window" className={styles.active}>
          {target.data.map((pattern, index) => {
            return (
              <Pattern
                key={pattern.id}
                path={[...path, "data", index]}
                actions={actions}
              />
            );
          })}
        </div>
        <div className={styles.inactive}>
          {target.data.map((pattern, index) => {
            return (
              <div
                key={pattern.id}
                className={grabbedLayer === index ? styles.active : ""}
              >
                <BoxHeader
                  icon={target.icon}
                  label={`layer #${index}`}
                  buttons={{}}
                  path={[]}
                />
              </div>
            );
          })}
        </div>
        <div className={styles.inactive}>
          <BoxHeader
            icon={target.icon}
            label={`layer #${grabbedLayer}`}
            buttons={{}}
            path={[]}
          />
        </div>
      </div>
      <div data-role="ghost" className={styles.ghost}>
        {target.data.map((pattern) => {
          return <div key={pattern.id}></div>;
        })}
      </div>
    </div>
  );
};

export default PatternsList;

const displayPattern = (e) => {
  const scroller = e.currentTarget;
  const display = scroller.querySelector('[data-role="display"]');
  const container = display.querySelector('[data-role="window"]');
  const ghost = scroller.querySelector('[data-role="ghost"]');
  const collapsables = Array.from(container.children).map((child) =>
    child.querySelector('[data-role="collapsable"]')
  );

  const heightRatio = container.scrollHeight / scroller.scrollHeight;

  const ghostAnchors = Array.from(ghost.children).map(
    (child) => child.offsetTop
  );

  const viewCoords = {
    top: scroller.scrollTop,
    bottom: scroller.scrollTop + scroller.offsetHeight,
  };

  collapsables.forEach((element, index) => {
    const relativeCoords = {
      top: ghostAnchors[index],
      bottom: ghostAnchors[index + 1] || scroller.scrollHeight,
    };
    const elementHeight = relativeCoords.bottom - relativeCoords.top;
    const visibleHeight =
      Math.min(viewCoords.bottom, relativeCoords.bottom) -
      Math.max(viewCoords.top, relativeCoords.top);
    const visibleRatio = clamp(visibleHeight / elementHeight, 0, 1);

    const newHeight = element.scrollHeight * visibleRatio;

    element.style.height = visibleRatio < 1 ? `${newHeight}px` : "";
    element.style.maskImage = `linear-gradient(
          to bottom,
          rgba(0, 0, 0, 1) 20%,
          rgba(0, 0, 0, ${visibleRatio})
        )`;
    element.style.filter = `blur(${(1 - visibleRatio) * 2}px)`;
    element.style.overflow = visibleRatio === 1 ? "visible" : "hidden";
  });

  const scrollTarget =
    heightRatio * scroller.scrollTop - scroller.offsetHeight / 2;
  container.scrollTo({ top: scrollTarget, behavior: "instant" });
};
