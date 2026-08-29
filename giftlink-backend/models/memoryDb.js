const crypto = require('crypto');

const state = { gifts: [], users: [] };

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function matches(document, query = {}) {
    return Object.entries(query).every(([key, expected]) => {
        const actual = document[key];
        if (expected && typeof expected === 'object' && !(expected instanceof RegExp)) {
            if (Object.prototype.hasOwnProperty.call(expected, '$regex')) {
                return new RegExp(expected.$regex, expected.$options || '').test(String(actual || ''));
            }
            if (Object.prototype.hasOwnProperty.call(expected, '$lte')) {
                return Number(actual) <= Number(expected.$lte);
            }
        }
        return String(actual) === String(expected);
    });
}

function collection(name) {
    if (!state[name]) state[name] = [];

    return {
        find(query = {}) {
            return { async toArray() { return clone(state[name].filter((item) => matches(item, query))); } };
        },
        async findOne(query = {}) {
            const item = state[name].find((entry) => matches(entry, query));
            return item ? clone(item) : null;
        },
        async insertMany(documents) {
            const insertedIds = {};
            documents.forEach((document, index) => {
                const stored = { ...clone(document), _id: document._id || crypto.randomUUID() };
                state[name].push(stored);
                insertedIds[index] = stored._id;
            });
            return { insertedCount: documents.length, insertedIds };
        },
        async insertOne(document) {
            const stored = { ...clone(document), _id: document._id || crypto.randomUUID() };
            state[name].push(stored);
            return { acknowledged: true, insertedId: stored._id };
        },
        async findOneAndUpdate(query, update) {
            const index = state[name].findIndex((entry) => matches(entry, query));
            if (index < 0) return null;
            state[name][index] = { ...state[name][index], ...(update.$set || {}) };
            return clone(state[name][index]);
        },
        async deleteMany(query = {}) {
            const before = state[name].length;
            state[name] = state[name].filter((entry) => !matches(entry, query));
            return { deletedCount: before - state[name].length };
        },
        async countDocuments(query = {}) {
            return state[name].filter((entry) => matches(entry, query)).length;
        },
    };
}

module.exports = { collection };
