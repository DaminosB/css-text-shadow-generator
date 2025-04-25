import styles from "./PatternsList.module.css";

import { useRef, useState, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { updateState } from "@/features/controls/controlsSlice";

import BoxHeader from "@/components/headers/BoxHeader/BoxHeader";
import Pattern from "../Pattern/Pattern";

import clamp from "@/utils/clamp";

const PatternsList = ({ path }) => {
  const target = useSelector((store) =>
    path.reduce((acc, entry) => acc[entry], store.controls)
  );

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

          dispatch(updateState({ path, key: "data", value: newLayering }));

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
        scroller.classList.remove(styles.inactive);

        if (currentIndex !== initialIndex) {
          const scrolltarget = scroller.querySelector('[data-role="ghost"]')
            .children[currentIndex].offsetTop;
          scroller.scrollTo({ top: scrolltarget, behavior: "instant" });
        }
      };

      const controller = new AbortController();
      const { signal } = controller;

      window.addEventListener("pointermove", dragging, { signal });
      window.addEventListener("pointerup", stopDragging, { signal });
    },
    [dispatch, path, target.data]
  );

  const openShadow = (e) => {
    const container = e.currentTarget.closest('[data-role="container"]');

    const containerId = container.id;
    const containerIndex = target.data.findIndex(
      (entry) => entry.id === containerId
    );
    const scroller = container.closest('[data-role="scroller"]');

    const scrolltarget = scroller.querySelector('[data-role="ghost"]').children[
      containerIndex
    ].offsetTop;

    scroller.scrollTo({ top: scrolltarget, behavior: "smooth" });
  };

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
            const patternLabel = `${pattern.label} ${
              target.data.length > 1 ? `#${index + 1}` : ""
            }`;
            return (
              <Pattern
                key={pattern.id}
                icon={target.icon}
                label={patternLabel}
                pattern={pattern}
                path={path}
                index={index}
                dragLayer={target.data.length > 1 ? dragLayer : null}
                openShadow={openShadow}
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
                  label={`layer #${index + 1}`}
                  controls={{}}
                  path={[]}
                />
              </div>
            );
          })}
        </div>
        <div className={styles.inactive}>
          <BoxHeader
            icon={target.icon}
            label={`layer #${grabbedLayer + 1}`}
            controls={{}}
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
  const scrollTarget =
    heightRatio * scroller.scrollTop - scroller.offsetHeight / 2;
  container.scrollTo({ top: scrollTarget, behavior: "instant" });

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
};
