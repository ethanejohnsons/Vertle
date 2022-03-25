import {Line} from "./Line";
import {Vertex} from "./Vertex";

export class GameState {

    // horrendous
    static generateAnswerState(answer, vertexCount, width, height, baseColor, correctColor) {
        let vertices = [];
        let lines = [];
        let connectedLines = [];
        let linesForLater = [];

        Array(answer.toString(2).length).fill(null).map((_, i) => i).map(i => {
            if (answer.toString(2)[i] === '1') {
                connectedLines.push(14 - i);
            }
        });

        Array(vertexCount).fill(null).map((_, i) => i).map(i => {
            let pos = Vertex.getPosition(i, vertexCount, Math.min(width * 0.45, height * 0.45));
            let x = pos[0] + (width * 0.5);
            let y = pos[1] + (height * 0.5);
            let v = new Vertex(i, x, y, correctColor);
            vertices.push(v);

            let possibleLines = Line.fromVertex(v);

            for (let j = 0; j < possibleLines.length; j++) {
                for (let k = 0; k < connectedLines.length; k++) {
                    if (possibleLines[j] === connectedLines[k]) {
                        linesForLater.push({
                            index: possibleLines[j],
                            v: v
                        });
                    }
                }
            }
        });

        linesForLater.forEach(l1 => {
            linesForLater.forEach(l2 => {
                if (l1.index === l2.index) {
                    lines.push(new Line(l1.index, l1.v.x, l1.v.y, l2.v.x, l2.v.y, baseColor));
                }
            });
        });

        return new GameState(vertices, lines, baseColor, null, correctColor, null);
    }

    constructor(vertices, lines, baseColor, closeColor, correctColor, lastColor, verified = false) {
        this.vertices = vertices;
        this.lines = lines;
        this.hasWon = false;
        this.binary = 0b0;

        this.baseColor = baseColor;
        this.closeColor = closeColor;
        this.correctColor = correctColor;
        this.lastColor = lastColor;

        this.verified = verified;
    }

    cleanFromJSON() {
        this.vertices = this.vertices.map(vertex => new Vertex(vertex.index, vertex.x, vertex.y, vertex.color, vertex.radius));
        this.lines = this.lines.map(line => new Line(line.index, line.x1, line.y1, line.x2, line.y2, line.color, line.width));
    }

    draw(ctx) {
        this.lines.forEach(line => line.draw(ctx, this.baseColor));

        this.vertices.forEach(vertex => {
            if (this.verified) {
                let possibleLines = Line.fromVertex(vertex);
                let connectedLines = 0;

                for (let i = 0; i < possibleLines.length; i++) {
                    for (let j = 0; j < this.lines.length; j++) {
                        if (possibleLines[i] === this.lines[j].index) {
                            connectedLines++;
                        }
                    }
                }

                vertex.draw(ctx, connectedLines);
            } else {
                vertex.draw(ctx, null);
            }
        });
    }

    verifyAndReturn(answer) {
        this.verified = true;

        // Generate a list of all the correct lines based on the binary.
        let correctLines = [];

        for (let i = 0; i < answer.length; i++) {
            let digit = answer[i];

            if (digit === '1') {
                correctLines.push(answer.length - 1 - i);
            }
        }

        // Check each vertex for connected lines.
        // Verify whether they are also present in the "correct lines" list.
        this.vertices.map(vertex => {
            // Possible lines for vertex.
            let possibleLines = Line.fromVertex(vertex);

            // Correct lines for vertex.
            let correctLinesForVertex = [];

            // Actual lines for vertex.
            let drawnLinesForVertex = [];

            // For each possible line...
            for (let i = 0; i < possibleLines.length; i++) {
                // Collect all correct lines...
                for (let j = 0; j < correctLines.length; j++) {
                    if (possibleLines[i] === correctLines[j]) {
                        correctLinesForVertex.push(possibleLines[i]);
                    }
                }

                // Collect all actual lines...
                for (let j = 0; j < this.lines.length; j++) {
                    if (possibleLines[i] === this.lines[j].index) {
                        drawnLinesForVertex.push(possibleLines[i]);
                    }
                }
            }

            // Correct number of lines to vertex. Will at least be partially correct.
            if (correctLinesForVertex.length === drawnLinesForVertex.length) {
                // Check if all lines are actually correct. Green color.
                if (correctLinesForVertex.length === 0 || correctLinesForVertex.sort().join(',') === drawnLinesForVertex.sort().join(',')) {
                    vertex.color = this.correctColor;

                // Else yellow
                } else {
                    vertex.color = this.closeColor;
                }
            }
        });

        // Assign all lines to lighter gray color.
        this.lines.map(line => line.color = this.lastColor);

        this.hasWon = answer === this.binary.toString(2).padStart(15, '0');
        return this;
    }
}
