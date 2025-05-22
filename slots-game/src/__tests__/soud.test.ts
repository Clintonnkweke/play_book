import { sound } from "../utils/sound";
import { Howl } from "howler";

jest.mock("howler");

describe("Sound System", () => {
  let mockHowl: { play: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHowl = { play: jest.fn() };
    (Howl as jest.Mock).mockImplementation(() => mockHowl);
    sound._clearSounds();
  });

  test("should add a new sound", () => {
    sound.add("test", "test.webm");
    expect(Howl).toHaveBeenCalledWith({
      src: ["test.webm"],
    });
  });

  test("should play an existing sound", () => {
    sound.add("test", "test.webm");
    sound.play("test");
    expect(mockHowl.play).toHaveBeenCalled();
  });

  test("should not play a non-existent sound", () => {
    const consoleSpy = jest.spyOn(console, "warn");
    sound.play("nonexistent");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Sound with alias nonexistent not found."
    );
  });
});
