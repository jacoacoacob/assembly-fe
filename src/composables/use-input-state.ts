import { computed, reactive, ref, type Ref } from "vue";

interface UseInputStateParams<Value extends string | number> {
    isRequired?: boolean;
    value: Value;
    validatedOnBlur?: boolean;
    validators?: ((value: Value, isDirty: boolean) => string | undefined)[];
}

interface InputState<Value extends string | number> {
    errors: string[];
    isDirty: boolean;
    isRequired: boolean;
    value: Value;
    validate: () => void;
    onBlur: (event: FocusEvent) => void;
}

function useInputState<Value extends string | number>({
    isRequired,
    value,
    validators,
    validatedOnBlur
}: UseInputStateParams<Value>): InputState<Value> {
    const _value = ref<Value>(value) as Ref<Value>;
    
    const isDirty = ref(false);
    const errors = ref<string[]>([]);

    function validate() {
        const _validators = validators ?? [];
        if (isRequired) {
            _validators.push((value) => {
                if (typeof value === "string" && value.trim().length === 0) {
                    return "This field is required.";
                }
            });
        }
        errors.value = _validators.reduce((accum: string[], validator) => {
            const message = validator(_value.value, isDirty.value);
            if (message && message.trim()) {
                accum.push(message);
            }
            return accum;
        }, []);
    }

    function onBlur(_event: FocusEvent) {
        if (validatedOnBlur) {
            validate();
        }
    }

    return reactive({
        errors,
        isDirty,
        onBlur,
        validate,
        isRequired: isRequired ?? false,
        value: computed({
            get() {
                return _value.value;
            },
            set(value: Value) {
                isDirty.value = true;
                _value.value = value;
                if (!validatedOnBlur) {
                    validate();
                }
            },
        }),
  
    });
}

export { useInputState };
export type { InputState };
