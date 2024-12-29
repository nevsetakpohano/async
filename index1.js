function asyncMap(array, asyncCallback, debounceTime = 0, finalCallback) {
    const results = [];
    let index = 0;

    function processNext() {
        if (index >= array.length) {
            if (finalCallback) finalCallback(results);
            return;
        }

        const startTime = Date.now();
        asyncCallback(array[index], index, array, (result) => {
            const elapsed = Date.now() - startTime;
            results.push(result);

            if (debounceTime > elapsed) {
                const delay = debounceTime - elapsed;
                setTimeout(() => {
                    index++;
                    processNext();
                }, delay);
            } else {
                index++;
                processNext();
            }
        });
    }

    processNext();
}

function exampleAsyncCallback(item, index, array, callback) {
    const delay = Math.random() * 1000;
    setTimeout(() => {
        callback(`Processed ${item} at index ${index}`);
    }, delay);
}

const inputArray = [1, 2, 3, 4, 5];
const testTime = 1000;

console.log("Without Debounce");
asyncMap(inputArray, exampleAsyncCallback, 0, (resultWithoutDebounce) => {
    console.log("Result without debounce:", resultWithoutDebounce);

    console.log(`With Debounce (${testTime}ms)`);
    asyncMap(inputArray, exampleAsyncCallback, testTime, (resultWithDebounce) => {
        console.log("Result with debounce:", resultWithDebounce);
    });
});