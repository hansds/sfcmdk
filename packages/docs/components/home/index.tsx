import SalesforceCommand from "@sfcmdk/extension";
import { useInView } from "react-intersection-observer";

import "@sfcmdk/extension/src/assets/style/raycast.scss";
import "@sfcmdk/extension/src/assets/style/theme.scss";

import customObjects from "../../assets/data/custom-objects.json";
import users from "../../assets/data/users.json";

import { MessageType } from "@sfcmdk/extension/src/shared/messaging/types";
import { useEffect, useRef, useState } from "react";
import Features from "./features";

const simulationRun = `␡log john⏎␡sandbox⏎␡lis case⏎␡␠⏎`;

// Fixes overflow scrolling when focus is on the command palette
function OverflowFixer({ ...props }: any) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (event.target instanceof HTMLDivElement) {
        event.target.scrollLeft = 0;
      }
    };

    ref.current?.addEventListener("scroll", listener);

    return () => {
      ref.current?.removeEventListener("scroll", listener);
    };
  }, []);

  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  );
}

export function Home() {
  const timeoutId = useRef(null);
  const [commandsLaunched, setCommandsLaunched] = useState([]);
  const [currentSimulationKeyIndex, setCurrentSimulationKeyIndex] = useState(0);
  const [shouldRunSimulation, setShouldRunSimulation] = useState(true);

  function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function simulateKey() {
    if (!shouldRunSimulation) return;
    setCurrentSimulationKeyIndex((currentSimulationKeyIndex) =>
      currentSimulationKeyIndex + 1 == simulationRun.length
        ? 0
        : currentSimulationKeyIndex + 1
    );
  }

  useEffect(() => {
    clearTimeout(timeoutId.current);

    const currentKey = simulationRun[currentSimulationKeyIndex];
    const timeout =
      currentKey == "⏎"
        ? 1000
        : currentKey == "␡"
        ? 2000
        : currentKey == "␠"
        ? 1200
        : randomNumberBetween(100, 800);

    timeoutId.current = setTimeout(simulateKey, timeout);

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [currentSimulationKeyIndex, shouldRunSimulation]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setShouldRunSimulation(true);
    } else {
      setShouldRunSimulation(false);
    }
  }, [inView]);

  return (
    <main
      className="space-y-16 min-h-screen bg-hero-light dark:bg-hero-dark bg-blend-darken dark:bg-blend-lighten bg-no-repeat overflow-hidden"
      style={{
        backgroundPositionX: "-100%",
        backgroundPositionY: "0, 0",
        backgroundSize: "auto, 120% auto",
      }}
    >
      <div className="grid place-items-center content-center max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
        <div className="mt-32 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold mb-8">
            The command palette for Salesforce
          </h1>
          <h3 className="text-lg lg:text-xl font-semibold">
            <div className="bg-black text-white px-2 py-1 lg:px-3 lg:py-2 rounded-md mx-2 inline-block">
              <span className="text-indigo-400">⌘</span>sfcmdk
            </div>
            is a Chrome Extension that supercharges your Salesforce admin and
            developer capabilities
          </h3>

          <a
            href="https://chrome.google.com/webstore/detail/%E2%8C%98sfcmdk-salesforce-comman/bmgfnhdlojiieehhdlfmngfhnnhhgeml"
            target="_blank"
            className="inline-flex items-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:to-purple-400 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-4 text-center mt-8 mb-2"
            rel="noreferrer"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-3 h-3 text-white mr-2"
              fill="currentColor"
            >
              {" "}
              <path d="M 12 2 C 8.728 2 5.8318125 3.5778125 4.0078125 6.0078125 L 7.6269531 9.6269531 C 8.4739531 8.0699531 10.103 7 12 7 C 13.118 7 14.139656 7.38 14.972656 8 L 21 8 L 16.474609 9.8105469 C 16.800609 10.474547 17 11.211 17 12 C 17 13.643 16.195656 15.089 14.972656 16 L 15 16 L 11.033203 21.951172 C 11.351203 21.982172 11.673 22 12 22 C 17.523 22 22 17.523 22 12 C 22 6.477 17.523 2 12 2 z M 4.0058594 6.0117188 C 2.7528594 7.6827188 2 9.75 2 12 C 2 17.191 5.9565781 21.455219 11.017578 21.949219 L 12.689453 16.929688 C 12.461453 16.961688 12.236 17 12 17 C 9.239 17 7 14.761 7 12 L 4.0058594 6.0117188 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z" />
            </svg>
            Get it on the Chrome Web Store
          </a>

          <div className="h-0">
            {/* honeypot for focus to autostart animation */}
            <input type="text" className="opacity-0" autoFocus />
          </div>
        </div>
      </div>

      <div className="relative grid place-items-center content-center">
        <div
          className="absolute z-10 top-2 left-1/2 md:top-10 md:ml-64 md:scale-125 animate-wiggle rotate-6"
          ref={ref}
        >
          <Tooltip />
        </div>
        <OverflowFixer className="overflow-hidden w-screen sm:w-auto p-20 -my-12">
          <div className="relative -left-12 sm:left-12 md:static">
            <SalesforceCommand
              users={users.records}
              customObjects={customObjects.records}
              orgId="dummyOrgId"
              sendMessage={(message) => {
                const commandType = MessageType[message.type];

                setCommandsLaunched((commandsLaunched) => [
                  ...commandsLaunched,
                  commandType,
                ]);

                return Promise.resolve({ type: message.type });
              }}
              input={simulationRun[currentSimulationKeyIndex]}
            />
          </div>
        </OverflowFixer>

        <div>
          {commandsLaunched.map((command, index) => (
            <CommandWindow key={index} command={command} />
          ))}
        </div>
      </div>

      <div className="pb-24">
        <Features />
      </div>
    </main>
  );
}

function CommandWindow({ command }: { command: string }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);

      return () => clearTimeout(timeoutId);
    }, 1300);
  }, []);

  return (
    isVisible && (
      <div
        className="window-fly absolute z-10
       top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-bottom-left  w-80 h-60 p-8 rounded-lg bg-white dark:bg-black bg-opacity-60 dark:border-zinc-900  border-solid border backdrop-filter backdrop-blur-lg drop-shadow-2xl"
      >
        <svg
          className="w-6 inline-block mr-2"
          version="1.1"
          viewBox="0 0 273 191"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <path id="a" d="m0.06 0.5h272v190h-272z" />
          </defs>
          <g fillRule="evenodd">
            <mask id="b" fill="#fff">
              <use xlinkHref="#a" />
            </mask>
            <path
              d="m113 21.3c8.78-9.14 21-14.8 34.5-14.8 18 0 33.6 10 42 24.9a58 58 0 0 1 23.7-5.05c32.4 0 58.7 26.5 58.7 59.2s-26.3 59.2-58.7 59.2c-3.96 0-7.82-0.398-11.6-1.15-7.35 13.1-21.4 22-37.4 22a42.7 42.7 0 0 1-18.8-4.32c-7.45 17.5-24.8 29.8-45 29.8-21.1 0-39-13.3-45.9-32a45.1 45.1 0 0 1-9.34 0.972c-25.1 0-45.4-20.6-45.4-45.9 0-17 9.14-31.8 22.7-39.8a52.6 52.6 0 0 1-4.35-21c0-29.2 23.7-52.8 52.9-52.8 17.1 0 32.4 8.15 42 20.8"
              fill="#00A1E0"
              mask="url(#b)"
            />
          </g>
        </svg>

        <p className="inline-block font-semibold">{command}</p>

        <p className="my-4 animate-pulse text-base text-neutral-700 dark:text-white">
          <span className="inline-block min-h-[1em] mr-3 w-7/12 flex-auto bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-4/12 flex-auto bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-4/12 flex-auto bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-6/12 flex-auto bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 mt-4 w-8/12 flex-auto bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-4/12 flex-auto bg-current align-middle opacity-20 rounded-sm"></span>
        </p>
      </div>
    )
  );
}

function Tooltip() {
  return (
    <div className="absolute ml-8 shadow-lg dark:bg-white bg-purple-600 px-4 py-2 rounded-md w-28 -rotate-6 opacity-90">
      <p className="text-md font-semibold dark:text-zinc-800 text-white pb-1 -mb-1 tracking-tight">
        Try me! <span className="text-xl relative left-1">🦦</span>
      </p>
      <svg
        className="absolute left-0 -ml-2 bottom-0 top-0 h-full dark:text-white text-purple-600"
        width="9px"
        height="16px"
        viewBox="0 0 9 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g
            transform="translate(-874.000000, -1029.000000)"
            fill="currentColor"
          >
            <g transform="translate(850.000000, 975.000000)">
              <g transform="translate(24.000000, 0.000000)">
                <polygon
                  transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                  points="4.5 57.5 12.5 66.5 -3.5 66.5"
                ></polygon>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
