import { ref, watchEffect } from "vue";



// Up, Up, Down, Down, Left, Right, Left, Right, B, A.
const SEQUENCE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA"
];

function useKonamiCode() {

    const didKonami = ref(false);

    const _keyCodeQueue = ref<string[]>([]);

    function _checkDidKonami() {
        let nValidChars = 0;

        for (let i = 0; i < _keyCodeQueue.value.length; i++) {
            const current = _keyCodeQueue.value[i];

            if (current === SEQUENCE[nValidChars]) {
                nValidChars += 1;
            } else {
                nValidChars = 0;
            }
            
            if (nValidChars === SEQUENCE.length) {
                return true;
            }
        }

        return false;
    }

    function recordKeyPress(keyCode: string) {
        _keyCodeQueue.value.push(keyCode);
    }

    function reset() {
        didKonami.value = false;
    }

    let _timeoutHandle: NodeJS.Timeout;

    watchEffect(() => {
        if (_checkDidKonami() && didKonami.value === false) {
            didKonami.value = true;
        }
        clearTimeout(_timeoutHandle);
        _timeoutHandle = setTimeout(() => {
            if (_keyCodeQueue.value.length > 0) {
                _keyCodeQueue.value = [];
            }
        }, 1000)
    });

    return { didKonami, reset, recordKeyPress };
}

export { useKonamiCode };
