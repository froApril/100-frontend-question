type Fn = (...params: any[]) => Promise<any>;

function timeLimit(fn: Fn, t: number): Fn {
    return async function (...args) {
        return new Promise((resolve, reject) => {
            const timeId = setTimeout(() => {
                reject('Time Limit Exceeded')
            }, t);
            fn(...args)
            .then((result)=> {
                clearTimeout(timeId)
                resolve(result)
            })
            .catch((error) => {
                clearTimeout(timeId)
                reject(error)
            })
        });

    }
}

const limited = timeLimit((t)=>new Promise(res => setTimeout(res, t)), 100);
limited(50).catch(console.log)