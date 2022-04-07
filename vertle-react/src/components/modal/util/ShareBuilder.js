import { GameState} from '../../game/model/GameState';

export function createShareable(shareState) {
    const greenCircle = '🟢';
    const yellowCircle = '🟡';
    const blackCircle = '⚫';
    let output = `Vertle ${shareState.gameNumber} ${shareState.history.length}/6\n`;

    shareState.history.forEach(state => {
        let gameState = new GameState(state, 100, 100).buildVertices(100, 100, shareState.answer);

        gameState.vertices.forEach(vertex => {
            switch (vertex.color) {
                case GameState.baseColor:
                    output += blackCircle;
                    break;
                case GameState.closeColor:
                    output += yellowCircle;
                    break;
                case GameState.correctColor:
                    output += greenCircle;
                    break;
            }

            if (gameState.vertices.indexOf(vertex) === gameState.vertices.length - 1) {
                output += ' \n';
            }
        });
    });

    return output;
}