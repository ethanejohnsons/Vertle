export function createShareable(gameNumber, guessHistory) {
    const greenCircle = '🟢';
    const yellowCircle = '🟡';
    const blackCircle = '⚫';

    const baseColor = '#222222';
    const correctColor = '#8DBA69';
    const closeColor = '#DCC55B';

    let output = `Vertle ${gameNumber} ${guessHistory.length}/6\n`;

    guessHistory.forEach(guess => {
        guess.vertices.forEach(vertex => {
            switch (vertex.color) {
                case baseColor:
                    output += blackCircle;
                    break;
                case correctColor:
                    output += greenCircle;
                    break;
                case closeColor:
                    output += yellowCircle;
                    break;
            }
        });

        if (guessHistory.indexOf(guess) !== guessHistory.length - 1) {
            output += ' \n';
        }
    });

    return output;
}