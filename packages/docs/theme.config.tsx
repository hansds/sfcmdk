import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { EnshiftIcon } from "@sfcmdk/extension";
import { useRouter } from "next/router";

const ogConfig = {
  title: "⌘sfcmdk",
  description: "The command palette for Salesforce",
  author: {
    twitter: "hnsdsmt",
  },
  favicon: "/favicon.ico",
};

const config: DocsThemeConfig = {
  useNextSeoProps() {
    const { asPath } = useRouter();

    if (["/", "/docs"].includes(asPath)) {
      return { titleTemplate: `${ogConfig.title} – ${ogConfig.description}` };
    }

    return { titleTemplate: `%s | ${ogConfig.title}` };
  },
  head: () => {
    const favicon = String(ogConfig.favicon);

    return (
      <>
        <meta name="description" content={ogConfig.description} />
        <meta property="og:description" content={ogConfig.description} />
        <meta name="twitter:site" content={`@${ogConfig.author.twitter}`} />
        <meta name="twitter:creator" content={`@${ogConfig.author.twitter}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={ogConfig.title} />
        <meta property="twitter:description" content={ogConfig.description} />

        <link rel="shortcut icon" href={favicon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={favicon} type="image/svg+xml" />
        <meta name="apple-mobile-web-app-title" content={ogConfig.title} />
      </>
    );
  },
  logo: <span className="font-bold">{ogConfig.title}</span>,
  project: {
    link: "https://github.com/hansds/sfcmdk",
  },
  docsRepositoryBase:
    "https://github.com/hansds/sfcmdk/tree/main/packages/docs",
  navbar: {
    extraContent: (
      <>
        <a
          style={{ padding: "0.5rem" }}
          target="_blank"
          href={`https://twitter.com/${ogConfig.author.twitter}`}
          aria-label="Twitter"
          rel="nofollow noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 21 21"
            fill="currentColor"
          >
            <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"></path>
          </svg>
        </a>
      </>
    ),
  },
  footer: {
    text: (
      <div className="flex w-full items-center justify-between">
        <div>
          Created by{" "}
          <a
            target="_blank"
            className="font-semibold"
            href="https://hansdesmet.be"
            rel="noreferrer"
          >
            Hans De Smet
          </a>{" "}
          at{" "}
          <a
            target="_blank"
            className="font-semibold"
            href="https://enshift.co"
            rel="noreferrer"
          >
            <EnshiftIcon className="w-5 inline-block mx-1" />
            Enshift
          </a>
          .
        </div>
      </div>
    ),
  },
};

export default config;
