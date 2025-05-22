// Mock PIXI
jest.mock("pixi.js", () => ({
  Application: jest.fn().mockImplementation(() => ({
    screen: { width: 800, height: 600 },
    stage: { addChild: jest.fn() },
  })),
  Container: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
    x: 0,
    y: 0,
  })),
  Sprite: jest.fn().mockImplementation(() => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })),
  Texture: {
    from: jest.fn(),
  },
}));

// Mock Howler
jest.mock("howler", () => ({
  Howl: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    stop: jest.fn(),
  })),
}));
