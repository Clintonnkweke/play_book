// TODO: Implement sound player using the "howler" package
import { Howl } from "howler";

// TODO: Implement sound player using the "howler" package

interface SoundMap {
  [key: string]: Howl;
}

const soundMap: SoundMap = {};

export const sound = {
  add: (alias: string, url: string): void => {
    if (!soundMap[alias]) {
      const howl = new Howl({
        src: [url],
      });
      soundMap[alias] = howl;
      console.log(`Sound added: ${alias} from ${url}`);
    } else {
      console.warn(`Sound with alias ${alias} already exists.`);
    }
  },
  play: (alias: string): void => {
    const sound = soundMap[alias];
    if (sound) {
      sound.play();
      console.log(`Playing sound: ${alias}`);
    } else {
      console.warn(`Sound with alias ${alias} not found.`);
    }
  },
  // Expose for testing
  _getSounds: () => soundMap,
  _clearSounds: () => {
    Object.keys(soundMap).forEach((key) => delete soundMap[key]);
  },
};
