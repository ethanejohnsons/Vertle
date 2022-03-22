import { Line } from './Line';

export class Vertex {
    static getPosition(index, vertexCount, radius) {
        return [
            radius * Math.sin((2 * Math.PI * index) / vertexCount),
            -1.0 * radius * Math.cos((2 * Math.PI * index) / vertexCount)
        ];
    }

    constructor(index, x, y, color, radius = 15) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    wasClicked(x, y) {
        return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < Math.pow(this.radius * 2, 2);
    }

    onClick(gameState, current, setCurrent) {
        if (current === null) {
            setCurrent(this);
            return true;
        } else if (current.index !== this.index) {
            if (!Line.existsBetween(gameState.lines, current, this)) {
                let line = Line.betweenVertices(current, this);
                gameState.lines.push(line);
                gameState.binary += Math.pow(2, line.index);
            } else {
                let line = Line.betweenVertices(current, this);

                for (let i = 0; i < gameState.lines.length; i++) {
                    if (gameState.lines[i].index === line.index) {
                        gameState.lines.splice(i, 1);
                    }
                }

                gameState.binary -= Math.pow(2, line.index);
            }

            setCurrent(null);
        }
    }
}