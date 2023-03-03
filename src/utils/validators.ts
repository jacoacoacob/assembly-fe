
function isMinLength(value: string, len: number) {
    if (value.length < len) {
        return `This field must contain at least ${len} characters.`;
    }
}

function isMaxLength(value: string, len: number) {
    if (value.length > len) {
        return `This field must contain ${len} or fewer characters.`
    }
}

function isValidChars(value: string) {
    if (!/^[\w-]*$/.test(value.trim())) {
        return "This field may contain only letters, numbers, hyphens, or underscores."
    }
}

function isEmail(value: string) {
    if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value)) {
        return "This field must contain a valid email address."
    }
}

export { isMinLength, isMaxLength, isValidChars, isEmail };
