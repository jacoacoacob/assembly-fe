
function sum(numbers: number[]) {
    return numbers.reduce((accum, n) => accum + n, 0);
}

function sumDict(d1: Record<string, number>, d2: Record<string, number>) {
    const keys = Object.keys(d1).concat(Object.keys(d2));
    return keys.reduce((accum: Record<string, number>, key) => {
        if (typeof accum[key] === "undefined") {
            accum[key] = 0;
        }
        accum[key] += d1[key] ?? 0;
        accum[key] += d2[key] ?? 0;
        return accum;
    }, {});
}

export { sum, sumDict };
