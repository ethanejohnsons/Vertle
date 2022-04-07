import { Convert } from "../math/VertleMath"
import { Vertex } from "./Vertex";
import { Line } from "./Line";

export class GameState {
    // Basically all the colors we use lol
    static baseColor = '#222222';
    static correctColor = '#8DBA69';
    static closeColor = '#DCC55B';
    static lastColor = '#AAAAAA';

    /**
     * All a {@link GameState} should need is a binary string representing
     * the current state, as well as the number of vertices. From there,
     * everything can be inferred via the {@link buildLines} and {@link buildVertices} methods.
     * If width and height are provided, {@link GameState#build} is called upon completion.
     * @param binary
     * @param width
     * @param height
     * @param previous
     */
    constructor(binary, width, height, previous) {
        this.binary = binary;
        this.vertexCount = Convert.toVertexCountFromLength(binary.length);

        this.buildVertices(width, height);
        this.buildLines();

        if (previous) {
            this.previous = new GameState(previous, width, height);
        }
    }

    /**
     * Draw the game state. Involves calling each {@link Line}
     * and {@link Vertex}s' draw function.
     * @see Line
     * @see Vertex
     */
    draw(ctx, showNumbers = false) {
        // Draw each line first.
        this.lines.forEach(line => line.draw(ctx, showNumbers ? GameState.lastColor : GameState.baseColor));

        // Draw each vertex on top.
        this.vertices.forEach(vertex => {
            if (showNumbers) {
                let connectedLines = Vertex.getConnectedLines(this, vertex.index);
                vertex.draw(ctx, connectedLines.length);
            } else {
                vertex.draw(ctx);
            }
        });
    }

    buildVertices(width, height, answer = null) {
        this.vertices = [];

        for (let i = 0; i < this.vertexCount; i++) {
            let pos = Convert.toCoordsFromVertex(i, this.vertexCount, Math.min(width * 0.45, height * 0.45));
            let x = pos.x + width * 0.5;
            let y = pos.y + height * 0.5;
            let color = GameState.baseColor;

            // Assign colors based on closeness to the answer.
            if (answer) {
                if (Vertex.getConnectedLines(this, i).length === Vertex.getConnectedLines(new GameState(answer, 100, 100), i).length) {
                    let same = true;

                    Convert.toLinesFromVertex(i, this.vertexCount).forEach(line => {
                        if (answer[answer.length - line] !== this.binary[answer.length - line]) {
                            same = false;
                        }
                    });

                    color = same ? GameState.correctColor : GameState.closeColor;
                }
            }


            this.vertices.push(new Vertex(i, x, y, color));
        }

        return this;
    }

    buildLines() {
        this.lines = [];
        let lineIndicesToCreate = [];

        // First, collect which lines should exist.
        for (let i = 0; i < this.binary.length; i++) {
            if (this.binary[i] === '1') {
                let index = this.binary.length - 1 - i;
                lineIndicesToCreate.push(index);
            }
        }

        // Next, create each line based on the binary string.
        for (let i = 0; i < lineIndicesToCreate.length; i++) {
            let index = lineIndicesToCreate[i];
            let vertexIndices = Convert.toVerticesFromLine(index, this.vertexCount);
            let v1, v2;

            for (let j = 0; j < this.vertices.length; j++) {
                if (this.vertices[j].index === vertexIndices.v1) {
                    v1 = this.vertices[j];
                }

                if (this.vertices[j].index === vertexIndices.v2) {
                    v2 = this.vertices[j];
                }
            }

            if (v1 && v2) {
                this.lines.push(new Line(index, v1.x, v1.y, v2.x, v2.y));
            }
        }

        return this;
    }

    isEmpty() {
        return this.vertices.length === 0 || this.lines.length === 0;
    }
}
