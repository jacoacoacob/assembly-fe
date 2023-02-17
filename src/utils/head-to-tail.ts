
function headToTail<T>(list: T[]) {
    if (list.length < 2) {
        return list;
    }
    const _list: T[] = [];
    for (let i = 1; i < list.length; i++) {
        _list.push(list[i]);
    }
    _list.push(list[0]);
    return _list;
}

export { headToTail };
