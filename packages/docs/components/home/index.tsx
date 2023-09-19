import SalesforceCommand from "@sfcmdk/extension";

import "@sfcmdk/extension/src/assets/style/theme.scss";
import "@sfcmdk/extension/src/assets/style/raycast.scss";

import users from "../../assets/data/users.json";
import customObjects from "../../assets/data/custom-objects.json";

import Features from "./features";
import { useEffect, useRef, useState } from "react";

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
  const [commandsLaunched, setCommandsLaunched] = useState([]);

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
        </div>
      </div>

      <div className="relative grid place-items-center content-center">
        <OverflowFixer className="overflow-hidden w-screen sm:w-auto p-20 -my-12">
          <div className="relative -left-12 sm:left-12 md:static">
            <SalesforceCommand
              users={users.records}
              customObjects={customObjects.records}
              orgId="dummyOrgId"
              sendMessage={(message) => {
                setCommandsLaunched((commandsLaunched) => [
                  ...commandsLaunched,
                  message.type,
                ]);

                return null;
              }}
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
        className="window-fly absolute
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
          <g fill-rule="evenodd">
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
          <span className="inline-block min-h-[1em] mr-3 w-7/12 flex-auto cursor-wait bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-4/12 flex-auto cursor-wait bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-4/12 flex-auto cursor-wait bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-6/12 flex-auto cursor-wait bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 mt-4 w-8/12 flex-auto cursor-wait bg-current align-middle opacity-20 rounded-sm"></span>
          <span className="inline-block min-h-[1em] mr-3 w-4/12 flex-auto cursor-wait bg-current align-middle opacity-20 rounded-sm"></span>
        </p>
      </div>
    )
  );
}
