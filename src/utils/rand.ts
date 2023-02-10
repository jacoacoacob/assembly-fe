
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

function selectRandomFrom<Data>(list: Data[], count: number) {
    if (list.length === 0) {
        console.warn("[selectRandomFrom] list is empty");
        return [];
    }
    const rv: Data[] = [];
    let i = 0;
    while (i < count) {
        const value = list[randFromRange(0, list.length)];
        if (rv.includes(value)) {
            continue;
        }
        rv.push(value);
        i += 1;
    }
    return rv;
}

function shuffle<Data>(list: Data[]) {
    const list_ = Array.from(list);
    while (true) {
        for (let i = 0; i < list.length * 2; i++) {
            list_.sort(() => Math.random() > 0.5 ? -1 : 1);
        }
        if (list_.every((item) => list_.indexOf(item) !== list.indexOf(item))) {
            break;
        }
    }
    return list_;
}

export { randFromRange, randId, selectRandomFrom, shuffle };
