async function asyncMapWithConcurrency(array, asyncCallback, concurrency = 2) {
    let active = 0; 
    let index = 0; 
    const results = new Array(array.length).fill(null); 

    const runTask = () => {
        if (index >= array.length && active === 0) return;

        while (active < concurrency && index < array.length) {
            const i = index++; 
            active++; 

            (async () => {
                results[i] = await asyncCallback(array[i], i, array);
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
