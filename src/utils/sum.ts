
function sum(numbers: number[]) {
    return numbers.reduce((accum, n) => accum + n, 0);
}

function sumDict(d1: Record<string, number>, d2: Record<string, number>) {
    const uniqueKeys = Array.from(
        new Set([
            ...Object.keys(d1),
            ...Object.keys(d2)
        ])
    );
    return Object.fromEntries(
        uniqueKeys.map(
            (key) => [key, (d1[key] ?? 0) + (d2[key] ?? 0)]
        )
    );
}

export { sum, sumDict };
