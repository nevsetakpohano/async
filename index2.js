async function asyncMapWithConcurrency(array, asyncCallback, concurrency = 2, debounceTime = 0) {
    let active = 0;
    let index = 0;
    const results = new Array(array.length).fill(null);

    const runTask = () => {
        if (index >= array.length && active === 0) return;

        while (active < concurrency && index < array.length) {
            const i = index++;
            active++;

            (async () => {
                const startTime = Date.now();
                results[i] = await asyncCallback(array[i], i, array);

                const elapsedTime = Date.now() - startTime;
                if (debounceTime > elapsedTime) {
                    await new Promise(resolve => setTimeout(resolve, debounceTime - elapsedTime));
                }

                active--;
                runTask();
            })();
        }
    };

    return new Promise((resolve, reject) => {
        try {
            runTask();
            const interval = setInterval(() => {
                if (active === 0 && index >= array.length) {
                    clearInterval(interval);
                    resolve(results);
                }
            }, 50);
        } catch (error) {
            reject(error);
        }
    });
}

async function exampleAsyncCallback(item, index) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    return `Processed ${item} at index ${index}`;
}

function promiseVersion(array, asyncCallback, concurrency, debounceTime) {
    return asyncMapWithConcurrency(array, asyncCallback, concurrency, debounceTime);
}

async function asyncAwaitVersion(array, asyncCallback, concurrency, debounceTime) {
    return asyncMapWithConcurrency(array, asyncCallback, concurrency, debounceTime);
}

(async () => {
    const inputArray = [1, 2, 3, 4, 5];
    const concurrencyLimit = 2; 
    const debounceTime = 1000;

    promiseVersion(inputArray, exampleAsyncCallback, concurrencyLimit, debounceTime)
        .then(result => {
            console.log("Promise result:", result);
        })
        .catch(error => console.error("Error in Promise version:", error));

    try {
        const asyncAwaitResult = await asyncAwaitVersion(inputArray, exampleAsyncCallback, concurrencyLimit, debounceTime);
        console.log("Async/await result:", asyncAwaitResult);
    } catch (error) {
        console.error("Error in Async/Await version:", error);
    }
})();
