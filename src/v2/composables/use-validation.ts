import { ref, watch } from "vue";
import type { Ref } from "vue";

type Validator<T> = (label: string, value: T) => string | undefined;

interface UseValidationOptions<T> {
    fieldName?: string;
    ref: Ref<T>;
    validators: Validator<T>[];
}

// function useValidation<T>(name: string, value: Ref<T>, ...validators: Validator<T>[]) {
function useValidation<T>({ fieldName, ref: ref_, validators }: UseValidationOptions<T>) {
    const errors = ref<string[]>([]);

    watch(ref_, (current) => {
        errors.value = validators
            .map((validate) => (validate(fieldName ?? "This field", current) ?? "").trim())
            .filter(Boolean);
    }, { immediate: true });

    return errors;
}

function maxLen(len: number) {
    return (name: string, value: string) => {
        if (value.length > len) {
            return `${name} must be less than ${len} characters.`;
        }
    }   
}

function noSpaces(name: string, value: string) {
    if (/\s+/.test(value)) {
        return `${name} must not contain any spaces.`;
    }
    return;
}

export { useValidation, maxLen, noSpaces };
export type { Validator };
