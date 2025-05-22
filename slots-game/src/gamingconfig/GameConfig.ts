export const GameConfig = {
  reels: {
    count: 4,
    symbolsPerReel: 6,
    symbolSize: 150,
    spacing: 10,
  },
  animations: {
    spinDelay: 200,
    stopDelay: 400,
    winCheckDelay: 500,
  },
  winChance: 0.3,
  textures: {
    symbols: [
      "symbol1.png",
      "symbol2.png",
      "symbol3.png",
      "symbol4.png",
      "symbol5.png",
    ],
    buttons: {
      spinEnabled: "button_spin.png",
      spinDisabled: "button_spin_disabled.png",
    },
  },
  spineAnimations: {
    frame: {
      file: "base-feature-frame.json",
      animations: {
        idle: "idle",
      },
    },
    win: {
      file: "big-boom-h.json",
      animations: {
        start: "start",
      },
    },
  },
};
