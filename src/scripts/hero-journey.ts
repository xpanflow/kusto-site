import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journeyStages } from "../data/journey";
gsap.registerPlugin(ScrollTrigger);
const root = document.querySelector<HTMLElement>(".journey");
if (root) {
  const media = gsap.matchMedia();
  media.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      const route = root.querySelector<SVGPathElement>(".route-draw")!;
      const marker = root.querySelector<SVGGElement>(".route-marker")!;
      const stages = [...root.querySelectorAll<HTMLElement>("[data-stage]")];
      const opening = root.querySelector<HTMLElement>(".journey-opening")!;
      const story = root.querySelector<HTMLElement>(".journey-story")!;
      const panels = [...root.querySelectorAll<HTMLElement>("[data-story]")];
      const map = root.querySelector<SVGSVGElement>(".journey-map svg")!;
      const length = route.getTotalLength();
      const state = { progress: 0 };
      root.classList.add("journey-enhanced");
      const render = () => {
        const p = state.progress;
        route.style.strokeDasharray = String(length);
        route.style.strokeDashoffset = String(length * (1 - p));
        const point = route.getPointAtLength(length * p);
        gsap.set(marker, { x: point.x, y: point.y });
        const current = journeyStages.filter((s) => p >= s.progress).length - 1;
        stages.forEach((el, i) => el.classList.toggle("active", i === current));
        opening.hidden = current > 0;
        story.hidden = current === 0;
        panels.forEach(
          (el) => (el.hidden = Number(el.dataset.story) !== current),
        );
        gsap.set(map, {
          scale: 1 + Math.sin(p * Math.PI) * 0.08,
          transformOrigin: "50% 50%",
        });
      };
      const tween = gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: root,
          start: "top top+=76",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      render();
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        root.classList.remove("journey-enhanced");
        opening.hidden = false;
        story.hidden = true;
        map.removeAttribute("style");
        route.removeAttribute("style");
        marker.removeAttribute("style");
        stages.forEach((s) => s.classList.remove("active"));
      };
    },
  );
  window.addEventListener("pagehide", () => media.revert(), { once: true });
}
