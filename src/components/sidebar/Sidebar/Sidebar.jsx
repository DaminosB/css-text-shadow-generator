import styles from "./Sidebar.module.css";

import { useCallback, useContext } from "react";
import { WorkspaceCtxt } from "@/components/workspace-window/Workspace/Workspace";

import { useSelector, useDispatch } from "react-redux";
import { updateState } from "@/features/controls/controlsSlice";

import createShadow from "@/config/builders/createShadow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGraduationCap,
  faPlay,
  faPlus,
  faQuestion,
  faSquareArrowUpRight,
  faThumbTack,
  faThumbTackSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ContentDisplayer from "../ContentDisplayer/ContentDisplayer";
import SmartButton from "@/components/inputs/SmartButton/SmartButton";

const Sidebar = ({ path }) => {
  const { setModaleContent, modaleContent } = useContext(WorkspaceCtxt);
  const { isOpen, isPinned, data } = useSelector((store) =>
    path.reduce((acc, entry) => acc[entry], store.controls)
  );
  const dispatch = useDispatch();

  const toggleSidebar = useCallback(
    (e) => {
      let newValue;

      switch (e.type) {
        case "mouseenter":
          newValue = true;
          break;

        case "mouseleave":
          const [header] = document.getElementsByTagName("Header");
          const headerRect = header.getBoundingClientRect();

          const isOnHeader =
            e.clientX > Math.round(headerRect.left) &&
            e.clientX < Math.round(headerRect.right) &&
            e.clientY > Math.round(headerRect.top) &&
            e.clientY < Math.round(headerRect.bottom);

          newValue = isOnHeader;

          break;

        case "click":
          newValue = !isOpen;
          document.activeElement.blur();

          break;

        default:
          break;
      }

      dispatch(updateState({ path, key: "isOpen", value: newValue }));
    },
    [path, isOpen, dispatch, modaleContent]
  );

  const togglePin = useCallback(() => {
    dispatch(updateState({ path, key: "isPinned", value: !isPinned }));
    document.activeElement.blur();
  }, [dispatch, isPinned, path]);

  const toggleItems = useCallback(
    (activeContent) => {
      if (!isOpen) {
        dispatch(updateState({ path, key: "isOpen", value: true }));
      }

      Object.entries(data).forEach(([name]) => {
        const targetPath = [...path, "data", name];

        const targetValue = name === activeContent;

        dispatch(
          updateState({ path: targetPath, key: "isOpen", value: targetValue })
        );
      });

      document.activeElement.blur();
    },
    [dispatch, path, data, isOpen]
  );

  const handleToggleItems = useCallback(
    (e) => {
      const buttonName = e.currentTarget.name;
      toggleItems(buttonName);
    },
    [toggleItems]
  );

  const addShadowAndScroll = useCallback(() => {
    toggleItems("layers");

    if (!isOpen) {
      dispatch(updateState({ path, key: "isOpen", value: true }));
    }

    dispatch(
      updateState({
        path: [...path, "data", "layers"],
        key: "data",
        value: [...data.layers.data, createShadow()],
      })
    );

    requestAnimationFrame(() => {
      const scroller = document.getElementById(layers.id);
      scroller.scrollTo({
        top: scroller.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [dispatch, data, path, toggleItems, isOpen]);

  const openDemoMode = useCallback(
    (e) => {
      setModaleContent(e.currentTarget.name);

      document.activeElement.blur();
    },
    [setModaleContent]
  );

  const openAboutModale = useCallback(() => {
    setModaleContent("about");
  }, [setModaleContent]);

  return (
    <div className={styles.sidebar}>
      <nav
        className={`${isOpen ? styles.open : ""} ${
          isPinned ? styles.pinned : ""
        }`}
        data-path={path}
        onMouseEnter={toggleSidebar}
        onMouseLeave={toggleSidebar}
      >
        <div>
          <SmartButton
            inputId="pin-sidebar"
            icons={{ on: faThumbTack, off: faThumbTackSlash }}
            value={isPinned}
            onClick={togglePin}
          />
        </div>
        <button
          className={styles.item}
          value={isPinned || isOpen}
          onClick={toggleSidebar}
        >
          <div>
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </button>
        <div>
          <div className={styles.openers}>
            <div>
              {Object.entries(data).map(([name, attributes]) => {
                const buttonPath = [...path, "data", name];
                const isActive = attributes.isOpen;
                const className = `${styles.item} ${
                  isActive ? styles.active : ""
                }`;
                return (
                  <button
                    key={attributes.id}
                    data-path={buttonPath}
                    name={name}
                    className={className}
                    onClick={handleToggleItems}
                  >
                    <div>
                      <FontAwesomeIcon icon={attributes.icon} />
                    </div>
                    <span className={styles.collapsable}>
                      {attributes.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div>
              <button
                className={styles.item}
                id="append-button"
                name="append-button"
                onClick={addShadowAndScroll}
              >
                <div>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <span className={styles.collapsable}>Add a layer</span>
              </button>
            </div>
            <div>
              <button
                className={styles.auxButton}
                name="demo"
                onClick={openDemoMode}
              >
                <div>
                  <FontAwesomeIcon icon={faPlay} />
                </div>
                <span className={styles.collapsable}>Demo mode</span>
              </button>
              <button className={styles.auxButton} name="learn">
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow"
                  target="_blank"
                >
                  <div>
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <span className={styles.collapsable}>
                    Learn{" "}
                    <span>
                      <FontAwesomeIcon icon={faSquareArrowUpRight} />
                    </span>
                  </span>
                </a>
              </button>
              <button
                className={styles.auxButton}
                name={"about"}
                onClick={openAboutModale}
              >
                <div>
                  <FontAwesomeIcon icon={faQuestion} />
                </div>
                <span className={styles.collapsable}>About</span>
              </button>
            </div>
          </div>
          <ContentDisplayer path={[...path, "data"]} />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
