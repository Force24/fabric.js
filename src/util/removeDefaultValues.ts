//@ts-nocheck
const include = ['left', 'top', 'type'];

function isEmptyArray(value) {
    return Array.isArray(value) && value.length === 0;
}

export function removeDefaultValues(object, defaults) {
    const dest = {};
    for (const key in object) {
        if (include.includes(key)
            || !(object[prop] === defaults[prop] || (isEmptyArray(object[prop]) && isEmptyArray(defaults[prop])))) {
            dest[key] = object[key];
        }
    }
    return dest;
}