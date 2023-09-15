import { SalesforceCommand } from "@sfcmdk/extension";

import "@sfcmdk/extension/src/assets/style/theme.scss";
import "@sfcmdk/extension/src/assets/style/raycast.scss";

import bg from "../../assets/images/hero-bg.jpg";
import bgDark from "../../assets/images/hero-bg-dark.jpg";
import { useTheme } from "nextra-theme-docs";

export function Home() {
  const darkMode = useTheme().resolvedTheme === "dark";

  return (
    <main
      className="space-y-40 min-h-screen "
      style={{
        backgroundBlendMode: darkMode ? "lighten" : "darken",
        backgroundPositionX: "-100%",
        backgroundPositionY: "0, 50%",
        backgroundSize: "auto, 120%",
        backgroundRepeat: "no-repeat",
        backgroundImage: darkMode
          ? `radial-gradient(circle at top, #100036 , #030b1e), url(${bgDark.src})`
          : `radial-gradient(circle at top, #fdfafc , #d7dff1), url(${bg.src})`,
      }}
    >
      <div>
        <div className="grid place-items-center content-center overflow-hidden">
          <div className="mt-32 mb-12 text-center">
            <h1 className="text-7xl font-bold mb-8">
              The command palette <br /> for Salesforce
            </h1>
            <h3 className="text-xl font-semibold leading-5">
              <div className="bg-black text-white px-3 py-2 rounded-md m-2 inline-block">
                <span className="text-indigo-400">⌘</span>sfcmdk
              </div>
              is a Chrome Extension that supercharges your Salesforce
              <br />
              admin and developer capabilities
            </h3>
          </div>
          <div className="overflow-hidden scale-50 sm:scale-75 md:scale-90 lg:scale-100 p-20">
            <SalesforceCommand
              users={[]}
              customObjects={[]}
              orgId="dummyOrgId"
              sendTypedMessage={() => {
                return null;
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
