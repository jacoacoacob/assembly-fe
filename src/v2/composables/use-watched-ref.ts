import { ref, unref, type Ref, type WatchSource, watch } from "vue";

function useWatchedRef<T>(value: T, watchSource: WatchSource) {
    const data = ref(unref(value)) as Ref<T>;

    watch(
        watchSource,
        (current) => { data.value = current; },
        { immediate: true }
    );

    return data;
}

export { useWatchedRef };
