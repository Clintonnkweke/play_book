import { Reel } from "../slots/Reel";
import * as PIXI from "pixi.js";

jest.mock("pixi.js");

describe("Reel", () => {
  let reel: Reel;

  beforeEach(() => {
    jest.clearAllMocks();
    reel = new Reel(3, 150); // 3 symbols, 150px size
  });

  test("should create correct number of symbols", () => {
    expect(reel["symbols"].length).toBe(3);
  });

  test("should start spinning when startSpin is called", () => {
    reel.startSpin();
    expect(reel["isSpinning"]).toBe(true);
    expect(reel["speed"]).toBeGreaterThan(0);
  });

  test("should set isSpinning to false when stopSpin is called", () => {
    reel.startSpin();
    reel.stopSpin();
    expect(reel["isSpinning"]).toBe(false);
  });

  test("should gradually slow down after stopSpin is called", () => {
    reel.startSpin();
    const initialSpeed = reel["speed"];
    reel.stopSpin();
    reel.update(1 / 60); // Update one frame
    expect(reel["speed"]).toBeLessThan(initialSpeed);
  });

  test("should update symbol positions when spinning", () => {
    reel.startSpin();
    const initialPositions = reel["symbols"].map((symbol) => symbol.x);
    reel.update(1 / 60); // Update with one frame
    const newPositions = reel["symbols"].map((symbol) => symbol.x);

    // Positions should have changed
    expect(newPositions).not.toEqual(initialPositions);
  });
});
