
function sum(numbers: number[]) {
    return numbers.reduce((accum, n) => accum + n, 0);
}

export { sum };
