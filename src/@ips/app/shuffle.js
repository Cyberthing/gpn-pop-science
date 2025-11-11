
/**
 * Randomly shuffle an array 
 * Fisher-Yates (aka Knuth) Shuffle
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
export default function shuffle(a) {
    var array = a.slice(0)
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

}

/**
 *  Taken from https://stackoverflow.com/questions/2450954/
 * Randomize array in-place using Durstenfeld shuffle algorithm.
 * Algorithm runtime is O(n). Note that the shuffle is done in-place 
 * so if you don't want to modify the original array, first make a copy of it with .slice(0).
 * 
 * Visualization: http://bost.ocks.org/mike/shuffle/
*/
export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/* ES6 / ECMAScript 2015 implementation of the Durstenfeld shuffle algorithm */
export function shuffleArrayES6(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}