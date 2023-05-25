import { computed, reactive, ref, unref } from "vue";
import type { Ref } from "vue";

type Validator<T> = (value: T) => string | undefined;

interface UseValidationOptions<T> {
    initalValue: T;
    validators: Validator<T>[];
}

function useValidation<T>({ initalValue, validators }: UseValidationOptions<T>) {
    const data = ref(unref(initalValue)) as Ref<T>;

    const errors = computed(() =>
        validators
            .map((validator) => (validator(data.value as T) ?? "").trim())
            .filter(Boolean)
    );

    const isValid = computed(() => errors.value.length === 0);

    return reactive({ data, isValid, errors });
}

function maxLen(name: string, len: number) {
    return (value: string) => {
        if (value.length > len) {
            return `${name} must be less than ${len} characters.`;
        }
    }   
}

export { useValidation, maxLen };
