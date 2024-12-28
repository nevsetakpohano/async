async function asyncMap(array, asyncCallback, debounceTime = 0) {
    const results = [];
    for (let i = 0; i < array.length; i++) {
        const result = await asyncCallback(array[i], i, array);
        results.push(result);
    }
    return results;
}

async function exampleAsyncCallback(item, index) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return `Processed ${item} at index ${index}`;
}

(async () => {
    console.log("Testing asyncMap without debounce");
    const result = await asyncMap([1, 2, 3], exampleAsyncCallback);
    console.log(result);
})();
