import { Convert } from '../math/VertleMath';

export class Vertex {
    /**
     * Get a list of all lines connected to the given vertex.
     * @param gameState the {@link GameState} to pull lines from
     * @param index the index of the {@link Vertex}
     * @returns {array} the list of connected lines
     */
    static getConnectedLines(gameState, index) {
        let possibleLines = Convert.toLinesFromVertex(index, gameState.vertexCount);
        let connectedLines = [];

        possibleLines.forEach(line => {
            let l = gameState.lines.find(l => l.index === line);

            if (l) {
                connectedLines.push(l);
            }
        });

        return connectedLines;
    }

    constructor(index, x, y, color, radius = 15) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
    }

    /**
     * Draws this vertex on the screen.
     * @param ctx the canvas context
     * @param count optional, used for rendering numbers on top of vertices
     */
    draw(ctx, count = -1) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        if (count !== -1) {
            ctx.fillStyle = '#fdfff5';
            ctx.font = '15px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(count, this.x, this.y + 5);
        }
    }

    /**
     * Detects whether the user's mouse is over this vertex.
     * @param x the mouse X
     * @param y the mouse Y
     * @returns {boolean}
     */
    isCursorOver(x, y) {
        return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < Math.pow(this.radius * 2, 2);
    }

    /**
     * Called on each vertex mouseDown and mouseUp.
     * @param workingState the binary of the working state
     * @param current the {@link Vertex} on the other end of the line, if this is the mouseUp action. Otherwise, null.
     * @param vertexCount the number of vertices
     */
    onClick(workingState, current, vertexCount) {
        let line = Convert.toLineFromVertices(current.index, this.index, vertexCount);

        if (workingState[workingState.length - line - 1] === '1') {
            return (parseInt(workingState, 2) - Math.pow(2, line)).toString(2).padStart(workingState.length, '0');
        }

        return (parseInt(workingState, 2) + Math.pow(2, line)).toString(2).padStart(workingState.length, '0');
    }
}