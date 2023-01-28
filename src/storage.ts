
const NAMESPACE = "assemblage-";

function listKeys() {
    return Object.keys(localStorage).reduce((accum: string[], key) => {
        if (key.startsWith(NAMESPACE)) {
            accum.push(key.slice(NAMESPACE.length));
        }
        return accum;
    }, []);
}

function load<Data>(key: string, namespace?: string): Data | null {
    const data = localStorage.getItem((namespace ?? NAMESPACE) + key);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

function save(key: string, obj: object, namespace?: string) {
    localStorage.setItem((namespace ?? NAMESPACE) + key, JSON.stringify(obj));
}

function remove(key: string) {
    localStorage.removeItem(NAMESPACE + key);
}

export { load, save, remove, listKeys };
