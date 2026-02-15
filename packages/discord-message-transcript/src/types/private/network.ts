/**
 * Result from dns.lookup
 */
export type LookupResult = {
  address: string,
  family: 4 | 6
};

export interface safeUrlReturn { 
    safe: boolean,
    safeIps: string[],
    url: string
}

export interface cacheSafeUrlReturn {
  safeUrlReturn: Promise<safeUrlReturn>,
  expired: number,
}