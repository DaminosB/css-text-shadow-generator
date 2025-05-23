import styles from "./HistoryContainer.module.css";

import { useRef, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  revertSettings,
  updateControls,
} from "@/features/workflow/workflowSlice";

import HistoryNavigation from "../HistoryNavigation/HistoryNavigation";

import { Icons } from "@/assets/icons/iconsLibrary";
const { ArrowCounterClockwise, ArrowClockwise } = Icons;

const HistoryContainer = () => {
  const workflow = useSelector((store) => store.workflow);

  const cachedCommitIndex = useRef(
    findCommitIndex(workflow.commits, workflow.data.id)
  );

  const displayIndex = useMemo(
    () => findCommitIndex(workflow.commits, workflow.data.id),
    [workflow.commits, workflow.data.id]
  );

  const commitIndex = useMemo(
    () =>
      workflow.controls.history.content
        ? cachedCommitIndex.current
        : displayIndex,
    [workflow.controls.history.content, displayIndex]
  );

  const { back, forward } = useMemo(
    () =>
      workflow.commits.reduce(
        (acc, commit, index) => {
          if (index < commitIndex) acc.back.unshift({ index, commit });
          else if (index === commitIndex) {
            acc.back.unshift({ index, commit });
            acc.forward.push({ index, commit });
          } else if (index > commitIndex) acc.forward.push({ index, commit });

          return acc;
        },
        { back: [], forward: [] }
      ),
    [workflow.commits, commitIndex]
  );

  const { showBackNav, showForwardNav } = useMemo(
    () => ({
      showBackNav:
        back.length > 0 && workflow.controls.history.content === "back",
      showForwardNav:
        forward.length > 0 && workflow.controls.history.content === "forward",
    }),
    [workflow.controls.history.content, back.length, forward.length]
  );

  const dispatch = useDispatch();

  const navigate = (index, origin) => {
    const nextData = workflow.commits[index];

    if (nextData.commitData.targetIndex) {
      const scroller = document.getElementById(nextData.commitData.category);

      const ghost = scroller.querySelector("[data-role='ghost']");

      if (ghost) {
        const indexDifference =
          nextData.commitData.targetIndex - (ghost.children.length - 1);

        const clones = [];
        if (indexDifference > 0) {
          Array.from({ length: indexDifference }).forEach(() => {
            clones.push(ghost.children[0].cloneNode(true));
          });

          ghost.replaceChildren(...Array.from(ghost.children), ...clones);
        }

        const scrollTarget =
          ghost.children[nextData.commitData.targetIndex].offsetTop;

        scroller.scrollTo({ top: scrollTarget, behavior: "instant" });

        requestAnimationFrame(() => {
          clones.forEach((clone) => {
            ghost.removeChild(clone);
          });
        });
      }
    }

    dispatch(revertSettings(index));
  };

  const handleNavigate = (e) => {
    navigate(
      workflow.commits.findIndex(
        (entry) => entry.id === e.currentTarget.dataset.id
      ),
      "handleNavigate"
    );
  };

  const handleClick = (e) => {
    const newContent = e.currentTarget.dataset.content || null;

    if (newContent !== workflow.controls.history.content) {
      const siblings = Array.from(e.currentTarget.parentNode.children);

      siblings.forEach((sibling) => {
        sibling.style.pointerEvents = "none";
      });

      dispatch(
        updateControls({ target: "history", key: "content", value: newContent })
      );

      requestAnimationFrame(() => {
        siblings.forEach((sibling) => {
          sibling.style.pointerEvents = "";
        });
      });
    }

    const index = workflow.commits.findIndex(
      (entry) => entry.id === e.currentTarget.dataset.id
    );

    if (newContent) {
      navigate(index, "handleClick");
    }

    cachedCommitIndex.current = index;
  };

  const toggleContent = (e) => {
    const newContent =
      e.type === "mouseenter" ? e.currentTarget.dataset.name : null;

    const historyLength =
      e.currentTarget.dataset.name === "back" ? back.length : forward.length;

    if (workflow.controls.content !== newContent && historyLength > 0) {
      dispatch(
        updateControls({ target: "history", key: "content", value: newContent })
      );
    }

    const currentIndex = findCommitIndex(workflow.commits, workflow.data.id);
    if (e.type === "mouseleave" && commitIndex !== currentIndex) {
      navigate(commitIndex, "toggleContent");
    }

    cachedCommitIndex.current = currentIndex;
  };

  return (
    <div className={styles.historyContainer}>
      <div>
        <div
          className={styles.historyDisplay}
          data-name="back"
          onMouseEnter={toggleContent}
          onMouseLeave={toggleContent}
        >
          <div>
            <button
              disabled={back.length === 1}
              data-content="back"
              data-id={
                back.length > 1 ? workflow.commits[commitIndex - 1].id : null
              }
              onClick={handleClick}
            >
              <span>
                <ArrowCounterClockwise />
              </span>
            </button>
          </div>
          <HistoryNavigation
            timeline={back}
            current={workflow.commits[commitIndex]}
            isActive={showBackNav}
            commitIndex={commitIndex}
            displayIndex={displayIndex}
            onMouseEnter={handleNavigate}
            onClick={handleClick}
          />
        </div>
        <div
          className={styles.historyDisplay}
          data-name="forward"
          onMouseEnter={toggleContent}
          onMouseLeave={toggleContent}
        >
          <div>
            <button
              disabled={forward.length === 1}
              data-content="forward"
              data-id={
                forward.length > 1 ? workflow.commits[commitIndex + 1].id : null
              }
              onClick={handleClick}
            >
              <span>
                <ArrowClockwise />
              </span>
            </button>
          </div>
          <HistoryNavigation
            timeline={forward}
            isActive={showForwardNav}
            current={workflow.commits[commitIndex]}
            commitIndex={commitIndex}
            displayIndex={displayIndex}
            onMouseEnter={handleNavigate}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryContainer;

const findCommitIndex = (commits, currentId) =>
  commits.findIndex((commit) => commit.id === currentId);
