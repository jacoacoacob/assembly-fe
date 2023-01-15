
function randFromRange(low: number, high: number) {
    return Math.floor(Math.random() * (high + 1 - low) + low);
}

const RAND_ID_SEED = "abcdefghijklmnopqrstuvwxyz0123456789";

function randId(len: number) {
    let rv = "";
    for (let i = 0; i < len; i++) {
        rv += RAND_ID_SEED[randFromRange(0, RAND_ID_SEED.length - 1)];
    }
    return rv;
}

export { randFromRange, randId };
