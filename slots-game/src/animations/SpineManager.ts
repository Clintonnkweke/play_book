import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import { AssetLoader } from "../utils/AssetLoader";
import { GameConfig } from "../gamingconfig/GameConfig";

export class SpineManager {
  private frameSpine: Spine | null = null;
  private winAnimation: Spine | null = null;

  constructor(
    private container: PIXI.Container,
    private dimensions: { width: number; height: number }
  ) {
    this.initSpineAnimations();
  }

  private initSpineAnimations(): void {
    try {
      this.initFrameAnimation();
      this.initWinAnimation();
    } catch (error) {
      console.error("Error initializing spine animations:", error);
    }
  }

  private initFrameAnimation(): void {
    const frameSpineData = AssetLoader.getSpine(
      GameConfig.spineAnimations.frame.file
    );
    if (frameSpineData) {
      this.frameSpine = new Spine(frameSpineData.spineData);
      this.frameSpine.y = this.dimensions.height / 2;
      this.frameSpine.x = this.dimensions.width / 2;

      if (
        this.frameSpine.state.hasAnimation(
          GameConfig.spineAnimations.frame.animations.idle
        )
      ) {
        this.frameSpine.state.setAnimation(
          0,
          GameConfig.spineAnimations.frame.animations.idle,
          true
        );
      }

      this.container.addChild(this.frameSpine);
    }
  }

  private initWinAnimation(): void {
    const winSpineData = AssetLoader.getSpine(
      GameConfig.spineAnimations.win.file
    );
    if (winSpineData) {
      this.winAnimation = new Spine(winSpineData.spineData);
      this.winAnimation.x = this.dimensions.height / 2;
      this.winAnimation.y = this.dimensions.width / 2;
      this.winAnimation.visible = false;
      this.container.addChild(this.winAnimation);
    }
  }

  public playWinAnimation(): void {
    if (this.winAnimation) {
      this.winAnimation.visible = true;
      this.winAnimation.state.setAnimation(
        0,
        GameConfig.spineAnimations.win.animations.start,
        false
      );
      this.winAnimation.state.addListener({
        complete: () => {
          if (this.winAnimation) {
            this.winAnimation.visible = false;
          }
        },
      });
    }
  }
}
