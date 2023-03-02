
function minLength(value: string, len: number) {
    if (value.length < len) {
        return `This field must contain at least ${len} characters.`;
    }
}

function maxLength(value: string, len: number) {
    if (value.length > len) {
        return `This field must contain ${len} or fewer characters.`
    }
}

function specialChars(value: string) {
    if (!/^[\w-]*$/.test(value.trim())) {
        return "This field may contain only letters, numbers, hyphens, or underscores."
    }
}

export { minLength, maxLength, specialChars };
