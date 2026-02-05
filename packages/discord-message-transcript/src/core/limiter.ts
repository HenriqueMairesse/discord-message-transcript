const globalLimiters = {
    cdn: createLimiter(12),
    base64: createLimiter(6)
};

export function getCDNLimiter() {
    return globalLimiters.cdn;
}

export function getBase64Limiter() {
    return globalLimiters.base64;
}

export function setCDNConcurrency(n: number) {
    globalLimiters.cdn = createLimiter(n);
}

export function setBase64Concurrency(n: number) {
    globalLimiters.base64 = createLimiter(n);
}

export function createLimiter(concurrency: number) {
    if (concurrency <= 0) {
        throw new Error("Limiter must be greater than 0");
    }

    let active = 0;
    const queue: Array<() => void> = [];

    const next = () => {
        active = Math.max(0, active - 1);

        if (queue.length > 0 && active < concurrency) {
            const run = queue.shift();
            run?.();
        }
    };

    return function limit<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const run = () => {
                active++;

                Promise.resolve()
                    .then(fn)
                    .then(resolve, reject)
                    .finally(next);
            };

            if (active < concurrency) {
                run();
            } else {
                queue.push(run);
            }
        });
    };
}
