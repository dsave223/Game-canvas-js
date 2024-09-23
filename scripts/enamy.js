import { Object } from "./object.js";

export class Enemy{
    constructor(ctx, spritesheet, canvas, ship){
        this.ctx = ctx;
        this.image = new Object();
        this.canvas = canvas;
        this.ship = ship;
    }
}