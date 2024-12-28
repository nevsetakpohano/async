function promiseMap(array, promiseCallback) {
    return Promise.all(array.map((item, index) => promiseCallback(item, index, array)));
}

function examplePromiseCallback(item, index) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Processed ${item} at index ${index}`);
        }, Math.random() * 1000);
    });
}

const inputArray = [1, 2, 3, 4, 5];
promiseMap(inputArray, examplePromiseCallback)
    .then((results) => {
        console.log("Promise-based Results:", results);
    });
