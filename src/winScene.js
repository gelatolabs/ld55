import Phaser from "phaser";
import { setState } from "playroomkit";
import { createPlayers, resetGame, updatePlayers, updateScene } from "./utils";
import Button from "./button";

export default class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  preload() {
    this.load.image("bg-win", "assets/bg-win.png");
    this.load.image("pointer", "assets/pointer.png");
  }

  create() {
    this.add.image(0, 0, "bg-win").setOrigin(0);

    createPlayers(this);

    new Button(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      [0.5, 0.5],
      "large",
      "Play again",
      "#22A559",
      resetGame
    );
  }

  update() {
    updateScene(this);
    updatePlayers(this);
  }
}