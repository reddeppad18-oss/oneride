import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";


/*
 * =========================================================
 * RESTORE ALRIDES THEME BEFORE REACT STARTS
 * =========================================================
 *
 * Settings.jsx stores the selected theme using:
 *
 *     alrides-theme
 *
 * Possible values:
 *
 *     light
 *     dark
 *     system
 *
 * The CSS uses:
 *
 *     html[data-theme="light"]
 *     html[data-theme="dark"]
 *     html[data-theme="system"]
 *
 * Therefore we must restore the data-theme attribute
 * before React renders the application.
 */

const savedTheme =
  localStorage.getItem("alrides-theme") || "system";


/*
 * Apply saved theme to <html>
 */

document.documentElement.setAttribute(
  "data-theme",
  savedTheme
);


/*
 * Keep browser controls synchronized
 * with the selected theme.
 */

if (savedTheme === "dark") {

  document.documentElement.style.colorScheme =
    "dark";

} else if (savedTheme === "light") {

  document.documentElement.style.colorScheme =
    "light";

} else {

  document.documentElement.style.colorScheme =
    "light dark";

}


/*
 * =========================================================
 * START REACT APPLICATION
 * =========================================================
 */

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <App />
  </StrictMode>
);