
const NAMESPACE = "assemblage-";

function save(key: string, obj: object) {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(obj));
}

function load<Data>(key: string): Data | null {
    const data = localStorage.getItem(NAMESPACE + key);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

export { save, load };
