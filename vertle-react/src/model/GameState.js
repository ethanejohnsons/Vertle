import {Line} from "./Line";

export class GameState {
    constructor(vertices, lines, baseColor, closeColor, correctColor, lastColor) {
        this.vertices = vertices;
        this.lines = lines;
        this.hasWon = false;
        this.binary = 0b0;

        this.baseColor = baseColor;
        this.closeColor = closeColor;
        this.correctColor = correctColor;
        this.lastColor = lastColor;
    }

    draw(ctx) {
        this.lines.forEach(line => line.draw(ctx, this.baseColor));
        this.vertices.forEach(vertex => vertex.draw(ctx));
    }

    onClick(x, y, currentVertex, setCurrentVertex) {
        let clicked = false;

        this.vertices.map(v => {
            if (v.wasClicked(x, y)) {
                if (v.onClick(this, currentVertex, setCurrentVertex)) {
                    clicked = true;
                }
            }
        });

        return clicked;
    }

    verifyAndReturn(answer) {
        // Generate a list of all the correct lines based on the binary.
        let correctLines = [];

        for (let i = 0; i < answer.toString(2).length; i++) {
            let digit = answer.toString(2)[i];

            if (digit === '1') {
                correctLines.push(answer.toString(2).length - 1 - i);
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
                if (correctLinesForVertex.sort().join(',') === drawnLinesForVertex.sort().join(',')) {
                    vertex.color = this.correctColor;

                // Else yellow
                } else {
                    vertex.color = this.closeColor;
                }

            // Else gray (if # of lines is not zero).
            } else if (correctLinesForVertex.length !== 0) {
                vertex.color = this.baseColor;
            }
        });

        // Assign all lines to lighter gray color.
        this.lines.map(line => line.color = this.lastColor);

        this.hasWon = answer === this.binary;
        return this;
    }
}