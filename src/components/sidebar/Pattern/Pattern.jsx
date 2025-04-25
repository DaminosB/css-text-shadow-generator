import styles from "./Pattern.module.css";

import { useMemo, useCallback, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { updateState } from "@/features/controls/controlsSlice";

import BoxHeader from "../../headers/BoxHeader/BoxHeader";
import InputMapper from "../../modules/InputMapper/InputMapper";

const Pattern = ({
  pattern,
  icon,
  label,
  path,
  openShadow,
  index,
  dragLayer,
}) => {
  const target = useSelector((store) =>
    path.reduce((acc, entry) => acc[entry], store.controls)
  );

  const dispatch = useDispatch();

  const containerRef = useRef(null);

  const removePattern = useCallback(() => {
    // Select the container element and hide it
    const container = containerRef.current;
    container.classList.add(styles.removed);

    // Find the nearest scrollable container
    const scroller = container.closest("[data-role='scroller']");
    const ghost = scroller.querySelector("[data-role='ghost']");

    const ghostAnchors = Array.from(ghost.children).map(
      (child) => child.offsetTop
    );

    const displayIndex = ghostAnchors.findIndex(
      (anchor) => scroller.scrollTop === anchor
    );

    if (displayIndex === index) {
      scroller.scrollTo({
        top: ghostAnchors[index + 1] || ghostAnchors[index - 1],
        behavior: "smooth",
      });
    }
    setTimeout(() => {
      dispatch(
        updateState({
          path: path,
          key: "data",
          value: target.data.filter((layer) => layer.id !== pattern.id),
        })
      );
    }, 750);
  }, [target, pattern.id, dispatch, path, index]);

  const actions = useMemo(
    () => ({
      trashcan: { action: removePattern, disabled: target.data.length === 1 },
    }),
    [target, removePattern]
  );

  return (
    <div
      className={styles.container}
      id={pattern.id}
      data-role="container"
      ref={containerRef}
    >
      <BoxHeader
        icon={icon}
        label={label}
        controls={pattern.controls}
        actions={actions}
        path={[...path, "data", index, "controls"]}
        onPointerDown={dragLayer}
        onClick={openShadow}
      />
      <div data-role="collapsable">
        <div>
          <InputMapper
            inputs={pattern.inputs}
            path={[...path, "data", index, "inputs"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Pattern;
