export const journeyStages = [
  { id: "start", progress: 0 },
  { id: "factory", progress: 0.15 },
  { id: "export", progress: 0.35 },
  { id: "ocean", progress: 0.55 },
  { id: "delivery", progress: 0.8 },
] as const;
// Self-drawn schematic: China → South China Sea → Indian Ocean → Suez → Mediterranean → Europe.
export const seaRoute =
  "M 1270 370 C 1330 450 1290 560 1200 590 S 1080 510 1000 500 S 800 530 730 470 L 690 390 L 650 330 Q 580 300 520 340 Q 440 360 400 300 L 420 230";
