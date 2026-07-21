import "./install-ui.css";
import { bootInstallUi } from "./install-ui.js";
bootInstallUi();

import "./r7-media.js";
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// open curtains after short beat
requestAnimationFrame(() => {
  setTimeout(() => document.body.classList.add("curtains-open"), reduce ? 0 : 400);
});

const reveals = document.querySelectorAll(".reveal");
if (reduce) reveals.forEach((el) => el.classList.add("visible"));
else if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
  );
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add("visible"));

document.querySelectorAll("video[data-auto]").forEach((v) => {
  if (reduce) {
    v.removeAttribute("autoplay");
    v.pause();
    v.controls = true;
  } else {
    v.muted = true;
    v.play().catch(() => {});
  }
});

// cycle demo card states if present
const label = document.querySelector("[data-demo-label]");
const glyph = document.querySelector("[data-demo-glyph]");
const chip = document.querySelector("[data-bar-chip]");
if (label && glyph && !reduce) {
  const states = [
    { g: "●", l: "WORKING", c: "working" },
    { g: "✅", l: "DONE", c: "done" },
    { g: "⚠", l: "NEEDS YOU", c: "needs" },
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % states.length;
    glyph.textContent = states[i].g;
    label.textContent = states[i].l;
    if (chip) {
      chip.textContent = states[i].g + " " + states[i].l;
      chip.dataset.state = states[i].c;
    }
  }, 2800);
}
