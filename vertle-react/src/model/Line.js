export class Line {
    static existsBetween(linesToDraw, v1, v2) {
        let out = false;
        let newLine = Line.betweenVertices(v1, v2);

        linesToDraw.map(line => {
            if (line.index === newLine.index) {
                out = true;
            }
        });

        return out;
    }

    static fromVertex(vertex) {
        let n = vertex.index;
        let N = 6;
        let c = N * 0.5 - 1;
        let out = [];

        for (let i = 0; i < N - 1; i++) {
            if (i < c) {
                out.push(n + i * N);
            } else if (i > c) {
                out.push((n + i + 1) % N + (N - i - 2) * N);
            } else {
                let halfN = N * 0.5;
                out.push(n % halfN + (halfN - 1) * N);
            }
        }

        return out;
    }

    static betweenVertices(v1, v2) {
        let lines1 = Line.fromVertex(v1);
        let lines2 = Line.fromVertex(v2);
        let index = lines1.filter(l => lines2.indexOf(l) !== -1)[0];

        return new Line(index, v1.x, v1.y, v2.x, v2.y, '#222222');
    }

    static drawDraggable(ctx, originX, originY, mouseX, mouseY, offsetX, offsetY, color) {
        ctx.beginPath();
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 2;
        ctx.moveTo(originX, originY);
        ctx.lineTo(mouseX - offsetX, mouseY - offsetY);
        ctx.stroke();
    }

    constructor(index, x1, y1, x2, y2, color, width = 2) {
        this.index = index;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.width = width;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}