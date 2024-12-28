function promiseMap(array, promiseCallback) {
    return Promise.all(array.map((item, index) => promiseCallback(item, index, array)));
}

const slowCallback = (item) => {
    return new Promise((resolve) => setTimeout(() => resolve(`Slow Process ${item}`), 1000));
};

const fastCallback = (item) => {
    return new Promise((resolve) => setTimeout(() => resolve(`Fast Process ${item}`), 100));
};

const inputArray = [1, 2, 3, 4, 5];

promiseMap(inputArray, slowCallback)
    .then((results) => {
        console.log("Slow Callback Results:", results);
    });

promiseMap(inputArray, fastCallback)
    .then((results) => {
        console.log("Fast Callback Results:", results);
    });
