import styles from "./CurrentStep.module.css";

import { useMemo, Fragment } from "react";

import { useSelector } from "react-redux";

import { Icons } from "@/assets/icons/iconsLibrary";
const { CaretLeft, X, CaretRight } = Icons;

import Image from "next/image";

const CurrentStep = ({ currentStep, onClick }) => {
  const demoControls = useSelector((state) => state.workflow.controls.demo);

  const isDarkMode = useMemo(
    () => demoControls.buttons.dark.config.value,
    [demoControls.buttons.dark.config.value]
  );

  const CurrentIcon = useMemo(
    () => (currentStep ? Icons[currentStep.demoConfig.icon] : null),
    [currentStep]
  );

  return (
    currentStep && (
      <div className={`${styles.currentStep} ${isDarkMode ? styles.dark : ""}`}>
        <h3>
          <span>
            <CurrentIcon />
          </span>
          <span>{currentStep.demoConfig.title}</span>
        </h3>
        <div className={styles.mediaContainer}>
          <Image
            src={currentStep.demoConfig.img}
            alt={currentStep.demoConfig.title}
          />
        </div>
        <div className={styles.textContainer}>
          <div>
            <p>{currentStep.demoConfig.desc}</p>
          </div>
          <div className={styles.progressbar}>
            {demoControls.content.map((step, index) => {
              const { demoConfig } = step;
              const StepIcon = Icons[demoConfig.icon];
              return (
                <Fragment key={step.id}>
                  <button
                    key={step.id}
                    className={`${
                      index <= demoControls.step ? styles.active : ""
                    } ${isDarkMode ? styles.dark : ""}`}
                    data-index={index}
                    onClick={onClick}
                  ></button>

                  <div>
                    <span>
                      <StepIcon weight="thin" />
                    </span>
                    <span>{demoConfig.title}</span>
                  </div>
                </Fragment>
              );
            })}
          </div>
          <div>
            <button
              onClick={onClick}
              data-index={demoControls.step - 1}
              disabled={demoControls.step === 0}
            >
              <span>
                <CaretLeft />
              </span>
              <span>Prev.</span>
            </button>
            <button
              onClick={onClick}
              data-index={demoControls.step + 1}
              disabled={demoControls.step === demoControls.content.length - 1}
            >
              <span>Next</span>
              <span>
                <CaretRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CurrentStep;
