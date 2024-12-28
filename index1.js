async function asyncMap(array, asyncCallback, debounceTime = 0) {
    const results = [];
    for (let i = 0; i < array.length; i++) {
        const startTime = Date.now();
        const result = await asyncCallback(array[i], i, array);
        const elapsed = Date.now() - startTime;

        if (debounceTime > elapsed) {
            await new Promise(resolve => setTimeout(resolve, debounceTime - elapsed));
        }

        results.push(result);
    }
    return results;
}

async function exampleAsyncCallback(item, index) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    return `Processed ${item} at index ${index}`;
}

(async () => {
    const inputArray = [1, 2, 3, 4, 5];
    const testTime = 1000;
    
    console.log("Without Debounce");
    const resultWithoutDebounce = await asyncMap(inputArray, exampleAsyncCallback);
    console.log("Result without debounce:",resultWithoutDebounce);

    console.log(`With Debounce (${testTime}ms)`);
    const resultWithDebounce = await asyncMap(inputArray, exampleAsyncCallback, testTime);
    console.log("Result with debounce:", resultWithDebounce);

})();
