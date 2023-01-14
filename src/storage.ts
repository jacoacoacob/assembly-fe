
const NAMESPACE = "assemblage-";

function load<Data>(key: string): Data | null {
    const data = localStorage.getItem(NAMESPACE + key);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

function save(key: string, obj: object) {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(obj));
}

function remove(key: string) {
    localStorage.removeItem(NAMESPACE + key);
}

export { load, save, remove };
