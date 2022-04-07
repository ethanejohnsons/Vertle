export class Line {
    /**
     * Draws the "draggable" line seen on screen when the
     * user draws a line between two points.
     * @param ctx the canvas context
     * @param originX the origin vertex X
     * @param originY the origin vertex Y
     * @param mouseX the mouse X
     * @param mouseY the mouse Y
     * @param offsetX the page offset X
     * @param offsetY the page offset Y
     * @param color the color of the line
     */
    static drawDraggable(ctx, originX, originY, mouseX, mouseY, offsetX, offsetY, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.moveTo(originX, originY);
        ctx.lineTo(mouseX - offsetX, mouseY - offsetY);
        ctx.stroke();
    }

    constructor(index, x1, y1, x2, y2, width = 2) {
        this.index = index;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.width = width;
    }

    /**
     * Draws a line on the screen.
     * @param ctx the canvas context
     * @param color the color to draw the lines using
     */
    draw(ctx, color) {
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = color;
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}