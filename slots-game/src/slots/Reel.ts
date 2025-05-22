import * as PIXI from "pixi.js";
import { AssetLoader } from "../utils/AssetLoader";
import { GameConfig } from "../gamingconfig/GameConfig";

const SYMBOL_TEXTURES = [
  "symbol1.png",
  "symbol2.png",
  "symbol3.png",
  "symbol4.png",
  "symbol5.png",
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
  public container: PIXI.Container;
  private symbols: PIXI.Sprite[];
  private symbolSize: number;
  private symbolCount: number;
  private speed: number = 0;
  private isSpinning: boolean = false;

  constructor(symbolCount: number, symbolSize: number) {
    this.container = new PIXI.Container();
    this.symbols = [];
    this.symbolSize = symbolSize;
    this.symbolCount = symbolCount;

    this.createSymbols();
  }

  private createSymbols(): void {
    // Create symbols for the reel, arranged horizontally
    for (let i = 0; i < this.symbolCount; i++) {
      const symbol = this.createRandomSymbol();
      symbol.x = i * this.symbolSize;
      symbol.y = 0; // Assuming symbols are aligned at the top of the reel container for horizontal spinning
      this.container.addChild(symbol);
      this.symbols.push(symbol);
    }
  }

  private createRandomSymbol(): PIXI.Sprite {
    const randomTextureName =
      GameConfig.textures.symbols[
        Math.floor(Math.random() * GameConfig.textures.symbols.length)
      ];
    const texture = AssetLoader.getTexture(randomTextureName);

    // TODO:Create a sprite with the texture
    const sprite = new PIXI.Sprite(texture);
    sprite.width = this.symbolSize;
    sprite.height = this.symbolSize;

    return sprite;
  }

  public update(delta: number): void {
    if (!this.isSpinning && this.speed === 0) return;

    // TODO:Move symbols horizontally
    for (const symbol of this.symbols) {
      symbol.x -= this.speed * delta;

      // Wrap symbols around when they go off screen
      if (symbol.x < -this.symbolSize) {
        symbol.x += this.symbols.length * this.symbolSize;
        // Optionally, change the symbol texture when it wraps for variety
        const randomTextureName =
          GameConfig.textures.symbols[
            Math.floor(Math.random() * GameConfig.textures.symbols.length)
          ];
        symbol.texture = AssetLoader.getTexture(randomTextureName);
      }
    }

    // If we're stopping, slow down the reel
    if (!this.isSpinning && this.speed > 0) {
      this.speed *= SLOWDOWN_RATE;

      // If speed is very low, stop completely and snap to grid
      if (this.speed < 0.5) {
        this.speed = 0;
        this.snapToGrid();
      }
    }
  }

  private snapToGrid(): void {
    // TODO: Snap symbols to horizontal grid positions
    const reelWidth = this.symbols.length * this.symbolSize;
    for (const symbol of this.symbols) {
      // Ensure symbols are within the visible reel area after snapping
      symbol.x = ((symbol.x % reelWidth) + reelWidth) % reelWidth;
      symbol.x = Math.round(symbol.x / this.symbolSize) * this.symbolSize;
    }
  }

  public startSpin(): void {
    this.isSpinning = true;
    this.speed = SPIN_SPEED;
  }

  public stopSpin(): void {
    this.isSpinning = false;
    // The reel will gradually slow down in the update method
  }
}
