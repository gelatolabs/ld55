import { getState, setState } from "playroomkit";

export default class Tool {
  constructor(scene, x, y, imageKey) {
    this.scene = scene;
    this.imageKey = imageKey;
    this.heldImageKey = `${imageKey}-pickup`;

    this.sprite = this.scene.add.sprite(x, y, imageKey).setInteractive();
    this.pickedUp = false;
    this.stateKey = `${imageKey}Pos`;

    setState(this.stateKey, { x, y });

    this.sprite.on("pointerdown", () => {
      this.pickedUp = !this.pickedUp;
      if (this.pickedUp) {
        this.sprite.setDepth(1);
        this.scene.sound.play(`${this.imageKey}-pickup`);
        this.sprite.setTexture(this.heldImageKey);
      } else {
        this.sprite.setTexture(this.imageKey);
      }
      if (!this.pickedUp && this.scene.problems) {
        this.scene.problems.forEach(problem => {
          if (Phaser.Geom.Intersects.RectangleToRectangle(this.sprite.getBounds(), problem.sprite.getBounds()) &&
            problem.solutionTool === this.imageKey) {
            this.scene.sound.play(`${this.imageKey}-use`);
            problem.solve();
          }
        });
        this.scene.currentTool = null;
        this.sprite.setPosition(x, y);
        setState(this.stateKey, { x, y });
      }
    });

    this.scene.events.on("start", () => {
      this.pickedUp = false;
    });

    this.scene.events.on("update", () => {
      const pos = getState(this.stateKey);
      if (this.pickedUp) {
        const pointer = this.scene.input.activePointer;
        this.sprite.setPosition(pointer.x, pointer.y);
        setState(this.stateKey, { x: pointer.x, y: pointer.y });
      } else if (pos && (this.sprite.x !== pos.x || this.sprite.y !== pos.y)) {
        this.sprite.setPosition(pos.x, pos.y);
      }
    });
  }

  destroy() {
    this.sprite.destroy();
  }
}