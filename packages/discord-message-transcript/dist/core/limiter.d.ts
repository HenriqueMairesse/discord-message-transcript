export declare function getCDNLimiter(): <T>(fn: () => Promise<T>) => Promise<T>;
export declare function getBase64Limiter(): <T>(fn: () => Promise<T>) => Promise<T>;
export declare function setCDNConcurrency(n: number): void;
export declare function setBase64Concurrency(n: number): void;
export declare function createLimiter(concurrency: number): <T>(fn: () => Promise<T>) => Promise<T>;
