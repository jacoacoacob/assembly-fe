
function checkMinLength(value: string, len: number) {
    if (value.length < len) {
        return (thing: string) => `${thing} must be at least ${len} characters in length.`;
    }
}

function checkMaxLength(value: string, len: number) {
    if (value.length > len) {
        return (thing: string) => `${thing} must be ${len} or fewer characters in lengh.`
    }
}

function checkSepecialChars(value: string) {
    if (!/^[\w-]*$/.test(value)) {
        return (thing: string) => `${thing} may only contain letters, numbers, hyphens, or underscores.`
    }
}

export { checkMinLength, checkMaxLength, checkSepecialChars };
