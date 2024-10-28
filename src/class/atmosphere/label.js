export class Label{
    constructor(ctx, text, position, color, fontWeith, font){
        this.ctx = ctx;
        this.text =  text;
        this.position = position;
        this.color = color;
        this.fontWeith = fontWeith
        this.font =  font;
        this.opacity = 1;
    }

    draw(){
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.font = `${this.fontWeith} 15px ${this.font}`;
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(this.text, this.position.x-30, this.position.y);
        this.ctx.globalAlpha = 1;
    }

    update(){
        this.draw();
        this.opacity -= 0.02;
        this.position.y -= 0.8;
    }
}