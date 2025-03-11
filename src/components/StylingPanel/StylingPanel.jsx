import styles from "./StylingPanel.module.css";

import { useState, useRef, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  addShadow,
  moveShadow,
} from "@/features/textSettings/textSettingsSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";

import TextStyler from "@/components/TextStyler/TextStyler";
import ShadowStyler from "../ShadowStyler/ShadowStyler";
import DragLayerPanel from "../DragLayerPanel/DragLayerPanel";

const StylingPanel = () => {
  const [showPanel, setShowPanel] = useState(true);
  const [showDragLayerPanel, setShowDragLayerPanel] = useState(false);
  const [grabbedLayer, setGrabbedLayer] = useState(null);

  const scrollerRef = useRef(null);
  const dragWitnessRef = useRef(null);

  const { shadows } = useSelector((store) => store.textSettings);

  const dispatch = useDispatch();

  const addShadowAndScroll = () => {
    dispatch(addShadow());
    requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    });
  };

  // This function allows the user to manually reorder shadow layers
  const startDragging = useCallback(
    (pointerDownEvent) => {
      const gripButton = pointerDownEvent.currentTarget;
      if (gripButton.disabled) return;

      pointerDownEvent.preventDefault();

      // Show the drag layer panel
      setShowDragLayerPanel(true);

      // Store the initial pointer Y position
      let cachedYPosition = pointerDownEvent.clientY;

      // The container corresponds to the dragged ShadowStyler
      const container = gripButton.closest('[data-role="draggable-container"]');

      // Reference to the scroller
      const scroller = scrollerRef.current;

      // The drop zone contains the draggable layer headers (title blocks)
      const dropZone = scroller.parentNode.querySelector(
        '[data-role="drop-zone"]'
      );
      const shadowHeaders = Array.from(dropZone.children);

      // Find the index of the dragged shadow layer
      let currentIndex = Array.from(container.parentNode.children)
        .slice(1) // Ignore the first entry (not a ShadowStyler)
        .findIndex((sibling) => sibling.id === container.id);

      // Floating indicator that follows the pointer (visual feedback)
      const dragWitness = dragWitnessRef.current;

      // Compute initial position of dragWitness relative to the scroller
      const containerRect = container.getBoundingClientRect();
      let dragValue = containerRect.top - scroller.getBoundingClientRect().top;
      dragWitness.style.transform = `translateY(${dragValue}px)`;

      const scrollerRelativeTop =
        scroller.getBoundingClientRect().top - scroller.offsetTop;

      // Adjust dropZone position to align with the dragged element
      let dropZoneOffset =
        containerRect.top -
        shadowHeaders[currentIndex].offsetTop -
        scrollerRelativeTop;
      dropZone.style.transform = `translateY(${dropZoneOffset}px)`;

      const shadowHeadersPositions = shadowHeaders.map((header) => ({
        top: header.offsetTop,
        get bottom() {
          return this.top + header.offsetHeight;
        },
      }));

      // Set the currently grabbed layer index
      setGrabbedLayer(currentIndex);

      // Function handling pointer movement during drag
      const dragLayer = (pointerMoveEvent) => {
        // Compute movement offset
        const deltaY = pointerMoveEvent.clientY - cachedYPosition;
        dragValue += deltaY;
        dragWitness.style.transform = `translateY(${dragValue}px)`;

        // Update cached position
        cachedYPosition = pointerMoveEvent.clientY;

        // Determine the new layer position based on pointer location
        const cursorY =
          pointerMoveEvent.clientY - dropZoneOffset - scrollerRelativeTop;

        // Detect if the cursor is near the top or bottom of the visible container
        const scrollerRect = scroller.getBoundingClientRect();
        const scrollThreshold = 50; // Auto-scroll activation zone (in pixels)
        const scrollSpeed = 5; // Auto-scroll speed

        if (pointerMoveEvent.clientY < scrollerRect.top + scrollThreshold) {
          // Scroll up
          dropZoneOffset = Math.min(dropZoneOffset + scrollSpeed, 0);
        } else if (
          pointerMoveEvent.clientY >
          scrollerRect.bottom - scrollThreshold
        ) {
          // Scroll down
          dropZoneOffset = Math.max(
            dropZoneOffset - scrollSpeed,
            scrollerRect.height - dropZone.scrollHeight
          );
        }

        dropZone.style.transform = `translateY(${dropZoneOffset}px)`;

        const newIndex = shadowHeadersPositions.findIndex(
          (position) => cursorY > position.top && cursorY < position.bottom
        );

        // If the index changed, update the store and UI
        if (newIndex !== -1 && newIndex !== currentIndex) {
          currentIndex = newIndex;
          setGrabbedLayer(currentIndex);
          dispatch(moveShadow({ id: container.id, newIndex }));
        }
      };

      // Function handling the drop event (when the pointer is released)
      const dropLayer = () => {
        // Hide the drag layer panel
        setShowDragLayerPanel(false);

        // Scroll to the new position of the dragged element
        const scrollTarget =
          container.offsetTop - cachedYPosition + scroller.offsetTop;
        scroller.scrollTo({ top: scrollTarget, behavior: "instant" });

        // Clean up event listeners
        window.removeEventListener("pointermove", dragLayer);
        window.removeEventListener("pointerup", dropLayer);
      };

      // Attach event listeners for dragging and dropping
      window.addEventListener("pointermove", dragLayer);
      window.addEventListener("pointerup", dropLayer);
    },
    [dispatch]
  );

  const toggleShowPanel = () => setShowPanel((prev) => !prev);
  return (
    <div className={`${styles.stylingPanel} ${showPanel ? "" : styles.closed}`}>
      <div className={styles.buttonContainer}>
        <button onClick={toggleShowPanel}>
          <span className={showPanel ? styles.active : ""}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
          <span className={!showPanel ? styles.active : ""}>
            <FontAwesomeIcon icon={faSliders} />
          </span>
        </button>
      </div>
      <div
        className={`${styles.optionsScroller} ${
          showDragLayerPanel ? styles.unscrollable : ""
        }`}
        ref={scrollerRef}
        data-role="scroller"
      >
        <div>
          <TextStyler />
          {shadows.map((shadow, index) => {
            return (
              <ShadowStyler
                key={shadow.id}
                shadow={shadow}
                index={index}
                startDragging={startDragging}
              />
            );
          })}
        </div>
        <DragLayerPanel
          grabbedLayer={grabbedLayer}
          showDragLayerPanel={showDragLayerPanel}
        />
        <div
          ref={dragWitnessRef}
          className={`${styles.dragWitness} ${
            showDragLayerPanel ? "" : "hidden"
          }`}
        >
          <h2>Layer at #{grabbedLayer + 1}</h2>
        </div>
      </div>
      <div className={styles.appendContainer}>
        <button id="append-button" onClick={addShadowAndScroll}>
          <FontAwesomeIcon icon={faPlus} /> Add a layer
        </button>
      </div>
    </div>
  );
};

export default StylingPanel;
