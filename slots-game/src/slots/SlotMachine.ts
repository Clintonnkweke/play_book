import * as PIXI from "pixi.js";
import "pixi-spine";
import { Reel } from "./Reel";
import { sound } from "../utils/sound";
import { AssetLoader } from "../utils/AssetLoader";
import { GameConfig } from "../gamingconfig/GameConfig";
import { SpineManager } from "../animations/SpineManager";

export class SlotMachine {
  public container: PIXI.Container;
  private reels: Reel[];
  private app: PIXI.Application;
  private isSpinning: boolean = false;
  private spinButton: PIXI.Sprite | null = null;
  private spineManager: SpineManager;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
    this.reels = [];

    // Center the slot machine
    const totalWidth =
      GameConfig.reels.symbolSize * GameConfig.reels.symbolsPerReel;
    const totalHeight =
      GameConfig.reels.symbolSize * GameConfig.reels.count +
      GameConfig.reels.spacing * (GameConfig.reels.count - 1);

    this.container.x = this.app.screen.width / 2 - totalWidth / 2;
    this.container.y = this.app.screen.height / 2 - totalHeight / 2;

    this.createBackground();
    this.createReels();

    this.spineManager = new SpineManager(this.container, {
      width: totalWidth,
      height: totalHeight,
    });
  }

  private createBackground(): void {
    try {
      const background = new PIXI.Graphics();
      background.beginFill(0x000000, 0.5);
      background.drawRect(
        -20,
        -20,
        GameConfig.reels.symbolSize * GameConfig.reels.symbolsPerReel + 40,
        GameConfig.reels.symbolSize * GameConfig.reels.count +
          GameConfig.reels.spacing * (GameConfig.reels.count - 1) +
          40
      );
      background.endFill();
      this.container.addChild(background);
    } catch (error) {
      console.error("Error creating background:", error);
    }
  }

  private createReels(): void {
    for (let i = 0; i < GameConfig.reels.count; i++) {
      const reel = new Reel(
        GameConfig.reels.symbolsPerReel,
        GameConfig.reels.symbolSize
      );
      reel.container.y =
        i * (GameConfig.reels.symbolSize + GameConfig.reels.spacing);
      this.container.addChild(reel.container);
      this.reels.push(reel);
    }
  }

  public update(delta: number): void {
    for (const reel of this.reels) {
      reel.update(delta);
    }
  }

  public spin(): void {
    if (this.isSpinning) return;

    this.isSpinning = true;
    sound.play("Reel spin");

    if (this.spinButton) {
      this.spinButton.texture = AssetLoader.getTexture(
        GameConfig.textures.buttons.spinDisabled
      );
      this.spinButton.interactive = false;
    }

    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].startSpin();
      }, i * GameConfig.animations.spinDelay);
    }

    setTimeout(() => {
      this.stopSpin();
    }, GameConfig.animations.spinDelay * (this.reels.length - 1) + GameConfig.animations.winCheckDelay);
  }

  private stopSpin(): void {
    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].stopSpin();

        if (i === this.reels.length - 1) {
          setTimeout(() => {
            this.checkWin();
            this.isSpinning = false;

            if (this.spinButton) {
              this.spinButton.texture = AssetLoader.getTexture(
                GameConfig.textures.buttons.spinEnabled
              );
              this.spinButton.interactive = true;
            }
          }, GameConfig.animations.winCheckDelay);
        }
      }, i * GameConfig.animations.stopDelay);
    }
  }

  private checkWin(): void {
    const randomWin = Math.random() < GameConfig.winChance;

    if (randomWin) {
      sound.play("win");
      console.log("Winner!");
      this.spineManager.playWinAnimation();
    }
  }

  public setSpinButton(button: PIXI.Sprite): void {
    this.spinButton = button;
  }
}
