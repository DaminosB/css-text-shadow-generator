import styles from "./HistoryNavigation.module.css";

import { useMemo } from "react";

import { Icons } from "@/assets/icons/iconsLibrary";

const HistoryNavigation = ({
  timeline,
  isActive,
  displayIndex,
  commitIndex,
  onMouseEnter,
  onClick,
}) => {
  return (
    <nav
      className={`${styles.historyNavigation} ${isActive ? styles.active : ""}`}
    >
      {timeline.length > 1 &&
        timeline.map(({ index, commit }, i) => {
          const { id, commitData } = commit;
          const InputIcon = Icons[commitData.inputIcon];
          const CategoryIcon = Icons[commitData.categoryIcon];

          const inlineStyle = {
            transitionDelay: `${i * 25}ms`,
          };

          const isHighlighted =
            (commitIndex < index && index <= displayIndex) ||
            (commitIndex > index && index >= displayIndex);

          const isCurrentCommit = commitIndex === index;

          return (
            <button
              key={id}
              data-id={id}
              className={`${styles.selection} ${
                isHighlighted ? styles.highlight : ""
              } ${isCurrentCommit ? styles.current : ""}`}
              style={inlineStyle}
              onMouseEnter={onMouseEnter}
              onClick={onClick}
            >
              <div>
                {CategoryIcon && (
                  <span>
                    <CategoryIcon weight="regular" />
                    {commitData.changedIndex != null && (
                      <sub>{commitData.changedIndex}</sub>
                    )}
                  </span>
                )}
                {InputIcon && (
                  <span>
                    <InputIcon weight="regular" />
                  </span>
                )}
              </div>
              <span>{commit.label}</span>
            </button>
          );
        })}
    </nav>
  );
};

export default HistoryNavigation;
