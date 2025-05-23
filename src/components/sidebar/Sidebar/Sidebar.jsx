import styles from "./Sidebar.module.css";

import { useCallback, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  updateControls,
  commitSettings,
  updateCollection,
} from "@/features/workflow/workflowSlice";

import createShadow from "@/config/builders/createShadow";

import { iconsList, Icons } from "@/assets/icons/iconsLibrary";
const { X, List } = Icons;

import ContentDisplayer from "../ContentDisplayer/ContentDisplayer";
import SmartButton from "@/components/inputs/SmartButton/SmartButton";
import CssEditorBox from "../../extras/output/CssEditorBox/CssEditorBox";
import PatternsList from "../../management/PatternsList/PatternsList";
import Pattern from "../../management/Pattern/Pattern";

const Sidebar = () => {
  const workflow = useSelector((store) => store.workflow);

  const currentData = useMemo(() => workflow.data, [workflow.data]);

  const content = useMemo(
    () => ({
      generalSettings: {
        ...currentData.settings.generalSettings,
        child: (props) => (
          <div className={styles.patternWrapper}>
            <Pattern
              {...props}
              path={["data", "settings", "generalSettings", "data"]}
            />
          </div>
        ),
      },
      layers: {
        ...currentData.settings.layers,
        child: (props) => (
          <PatternsList {...props} path={["data", "settings", "layers"]} />
        ),
      },
      output: {
        ...workflow.output,
        child: (props) => <CssEditorBox {...props} />,
      },
    }),
    []
  );

  const { isOpen, isPinned } = useMemo(
    () => workflow.controls.sidebar,
    [workflow.controls.sidebar]
  );

  const dispatch = useDispatch();

  const toggleSidebar = useCallback(
    (e) => {
      if (document.querySelector("dialog[open]")) return;

      let newValue;

      switch (e.type) {
        case "pointerenter":
          if (e.pointerType === "mouse") newValue = true;

          break;

        case "pointerleave":
          if (e.pointerType === "mouse") {
            const sidebarRect = e.currentTarget.getBoundingClientRect();
            const isOnSideBar =
              e.clientX > Math.round(sidebarRect.left) &&
              e.clientX < Math.round(sidebarRect.right);

            newValue = isOnSideBar;
          }

          break;

        case "click":
          newValue = !isOpen;
          document.activeElement.blur();

          break;

        default:
          break;
      }

      if (newValue !== undefined && newValue !== isOpen) {
        dispatch(
          updateControls({ target: "sidebar", key: "isOpen", value: newValue })
        );
      }
    },
    [isOpen, dispatch]
  );

  const togglePin = useCallback(() => {
    dispatch(
      updateControls({
        target: "sidebar",
        key: "isPinned",
        value: !isPinned,
      })
    );
    document.activeElement.blur();
  }, [dispatch, isPinned]);

  const toggleContent = useCallback(
    (activeContent) => {
      if (!isOpen) {
        dispatch(
          updateControls({
            target: "sidebar",
            key: "isOpen",
            value: true,
          })
        );
      }

      dispatch(
        updateControls({
          target: "sidebar",
          key: "content",
          value: activeContent,
        })
      );

      document.activeElement.blur();
    },
    [dispatch, isOpen]
  );

  const handleToggleContent = useCallback(
    (e) => {
      const buttonName = e.currentTarget.name;
      toggleContent(buttonName);
    },
    [toggleContent]
  );

  const addShadowAndScroll = useCallback(() => {
    toggleContent("layers");

    if (!isOpen) {
      dispatch(
        updateControls({
          target: "sidebar",
          key: "isOpen",
          value: true,
        })
      );
    }

    const dataLength = currentData.settings.layers.data.length;

    dispatch(
      updateCollection({
        category: "layers",
        targetIndex: dataLength,
        target: createShadow(),
        newIndex: dataLength,
      })
    );

    const commitLabel = `layer #${dataLength} created`;

    dispatch(
      commitSettings({
        category: "layers",
        changedIndex: dataLength,
        label: commitLabel,
        inputIcon: iconsList.StackPlus,
      })
    );

    requestAnimationFrame(() => {
      const scroller = document.getElementById("layers");

      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    });
  }, [currentData.settings.layers.data, dispatch, toggleContent, isOpen]);

  const openModale = useCallback((e) => {
    const modal = document.getElementById(e.currentTarget.name);
    modal.showModal();
  }, []);

  const openDemoMode = useCallback(
    (e) => {
      dispatch(
        updateControls({
          target: "demo",
          key: "cache",
          value: currentData.settings,
        })
      );

      dispatch(updateControls({ target: "demo", key: "step", value: 0 }));

      openModale(e);
    },
    [dispatch, currentData, openModale]
  );

  const actions = useMemo(
    () => ({
      addShadowAndScroll: {
        callback: addShadowAndScroll,
        disabled: false,
      },
      openDemoMode: {
        callback: openDemoMode,
        disabled: false,
      },
      openModale: {
        callback: openModale,
        disabled: false,
      },
    }),
    [addShadowAndScroll, openDemoMode, openModale]
  );

  const { appendButton, auxButtons } = useMemo(() => {
    const buttons = workflow.controls.sidebar.buttons;

    return Object.entries(buttons).reduce(
      (acc, [buttonName, { id, config }]) => {
        const baseConfig = {
          ...config,
          rawIcon: Icons[config.icon],
          action:
            config.type === "action" && actions[config.value]
              ? actions[config.value].callback
              : null,
        };

        if (buttonName === "append") {
          acc.appendButton = { id, config: baseConfig };
        } else {
          acc.auxButtons[buttonName] = { id, config: baseConfig };
        }

        return acc;
      },
      { appendButton: null, auxButtons: {} }
    );
  }, [workflow.controls.sidebar.buttons, actions]);

  const AppendIcon = useMemo(() => appendButton.config.rawIcon, [appendButton]);

  return (
    <div className={styles.sidebar}>
      <nav
        className={`${isOpen ? styles.open : ""} ${
          isPinned ? styles.pinned : ""
        }`}
        onPointerEnter={toggleSidebar}
        onPointerLeave={toggleSidebar}
      >
        <div>
          <SmartButton
            inputId="pin-sidebar"
            name="pin-sidebar"
            icons={{ on: iconsList.PushPin, off: iconsList.PushPinSlash }}
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
            <List />
          </div>
          <div>
            <X />
          </div>
        </button>
        <div>
          <div className={styles.openers}>
            <div>
              {Object.entries(content).map(([name, attributes]) => {
                const isActive = workflow.controls.sidebar.content === name;
                const className = `${styles.item} ${
                  isActive ? styles.active : ""
                }`;
                const Icon = Icons[attributes.icon];
                return (
                  <button
                    key={attributes.id}
                    name={name}
                    className={className}
                    onClick={handleToggleContent}
                  >
                    <div>
                      <Icon />
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
                id={appendButton.id}
                name={appendButton.config.name}
                onClick={appendButton.config.action}
              >
                <div>
                  <AppendIcon />
                </div>
                <span className={styles.collapsable}>
                  {appendButton.config.labelText}
                </span>
              </button>
            </div>
            <div>
              {Object.entries(auxButtons).map(
                ([buttonName, { id, config }]) => {
                  const Icon = config.rawIcon;

                  const Wrapper = ({ children }) =>
                    config.type === "link" ? (
                      <a href={config.value} target="_blank">
                        {children}
                      </a>
                    ) : (
                      <>{children}</>
                    );

                  return (
                    <Wrapper key={id}>
                      <button
                        className={styles.auxButton}
                        name={buttonName}
                        onClick={config.action}
                      >
                        <div>
                          <Icon />
                        </div>
                        <span className={styles.collapsable}>
                          {config.labelText}
                        </span>
                      </button>
                    </Wrapper>
                  );
                }
              )}
            </div>
          </div>
          <ContentDisplayer content={content} />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
