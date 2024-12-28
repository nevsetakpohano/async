async function asyncMapWithAbort(array, asyncCallback, concurrency = 2, debounceTime = 0, signal) {
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

                try {
                    if (signal?.aborted) throw new Error("Operation aborted");

                    results[i] = await asyncCallback(array[i], i, array, signal);

                    const elapsedTime = Date.now() - startTime;
                    if (debounceTime > elapsedTime) {
                        await new Promise(resolve => setTimeout(resolve, debounceTime - elapsedTime));
                    }
                } catch (error) {
                    if (signal?.aborted) {
                        results[i] = "Aborted";
                    } else {
                        results[i] = `Error: ${error.message}`;
                    }
                } finally {
                    active--;
                    runTask();
                }
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


async function exampleAsyncCallbackWithAbort(item, index, _, signal) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            if (signal?.aborted) {
                reject(new Error("Operation aborted"));
                return;
            }
            resolve(`Processed ${item} at index ${index}`);
        }, Math.random() * 1000);

        if (signal) {
            signal.addEventListener("abort", () => {
                clearTimeout(timeoutId);
                reject(new Error("Operation aborted"));
            });
        }
    });
}

(async () => {
    const inputArray = [1, 2, 3, 4, 5];
    const concurrencyLimit = 2;
    const debounceTime = 1000;
    const controller = new AbortController();
    const { signal } = controller;

    setTimeout(() => {
        console.log("Aborting operations...");
        controller.abort();
    }, 1500);

    try {
        const result = await asyncMapWithAbort(inputArray, exampleAsyncCallbackWithAbort, concurrencyLimit, debounceTime, signal);
        console.log("Result:", result);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
