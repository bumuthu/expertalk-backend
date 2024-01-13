function extract<T>(properties: Record<keyof T, true>) {
    return function <TActual extends T>(value: TActual) {
        let result = {} as T;
        for (const property of Object.keys(properties) as Array<keyof T>) {
            result[property] = value[property];
        }
        return result;
    }
}

export function trim<TypedInterface>(model: TypedInterface ) {
    let trueKeys: any = {}
    Object.keys(typeof model).map(key => {
        trueKeys[key] = true;
    });
    console.log("True keys:", trueKeys)
    return extract<TypedInterface>(trueKeys)
}