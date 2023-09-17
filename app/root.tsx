import "./bootstrap-reboot.css";
import "./google-fonts.css";
import "./globals.css";
import styles from "./layout.module.css";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.png",
    type: "image/png",
  },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className={styles.BeerRatingApp}>
          <header className={styles.Header}>
            <div className={styles.MainHeader}>
              <h1>
                <Link to={"/"}>Beer Advisor</Link>
              </h1>
            </div>
          </header>
          <div className={styles.Main}>
            <Outlet />
          </div>
          <footer className={styles.Footer}>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              {GITHUB_REPO}
            </a>
          </footer>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const GITHUB_REPO = "https://github.com/nilshartmann/remix-beeradvisor";
