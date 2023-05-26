import { ref, unref, type Ref } from "vue"
import { useValidation, type Validator } from "./use-validation";

interface UseValidatedRefOptions<T> {
    value: T;
    fieldName?: string;
    validators: Validator<T>[]
}

function useValidatedRef<T>(options: UseValidatedRefOptions<T>): [Ref<T>, Ref<string[]>] {
    const { validators, value, fieldName } = options;
    
    const data = ref(unref(value)) as Ref<T>;

    const errors = useValidation({
        fieldName,
        validators,
        ref: data,
    });

    return [data, errors];
}

export { useValidatedRef };
