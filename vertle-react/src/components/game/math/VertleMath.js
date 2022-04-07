export class Convert {

    /**
     * Gets the number of vertices from a binary string.
     * @param length the length of the binary string
     * @returns {number} the number of vertices
     * @author Peyon
     */
    static toVertexCountFromLength(length) {
        return Math.floor((1 + Math.sqrt(1 + 8 * length)) / 2.0);
    }

    /**
     * @param k the line index
     * @param N the number of vertices
     * @returns {{v1: number, v2: number}} two points indices
     * @author Peyon
     */
    static toVerticesFromLine(k, N) {
        return {
            v1: k % N,
            v2: (k + Math.floor(k / N) + 1) % N
        }
    }

    /**
     * @param n the vertex index
     * @param N the number of vertices
     * @returns {*[]} a list of line indices
     * @author Peyon
     */
    static toLinesFromVertex(n, N) {
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

    /**
     * @param n the vertex index
     * @param N the number of vertices
     * @param r the radius of the game
     * @returns {{x: number, y: number}}
     * @author Peyon
     */
    static toCoordsFromVertex(n, N, r) {
        return {
            x: r * Math.sin((2 * Math.PI * n) / N),
            y: - 1.0 * r* Math.cos((2 * Math.PI * n) / N)
        };
    }

    /**
     * @param v1 the first vertex index
     * @param v2 the second vertex index
     * @param N the number of vertices
     * @returns {number} the line index
     * @author Peyon
     */
    static toLineFromVertices(v1, v2, N) {
        /**
         * Finds the minimum distance between nodes a and b in either
         * direction when nodes N - 1 and 0 are taken to be adjacent.
         * @param N the number of nodes
         * @param a node A
         * @param b node B
         */
        const D = (N, a, b) =>
            Math.min((N - b + a) % N, (N + b - a) % N);

        let dResult = D(N, v1, v2);
        return (dResult - 1) * N +
            (dResult === Math.abs(v2 - v1) ? Math.min(v1, v2) : Math.max(v1, v2));
    }
}