import { Resolver } from "dns/promises";
import { DNS_LOOKUP_TIMEOUT, DNS_SERVERS } from "./constants.js";
export async function resolveAllIps(host) {
    const resolver = new Resolver();
    resolver.setServers(DNS_SERVERS);
    const lookupPromise = (async () => {
        const results = [];
        const [v4, v6] = await Promise.allSettled([
            resolver.resolve4(host),
            resolver.resolve6(host)
        ]);
        if (v4.status === "fulfilled") {
            for (const ip of v4.value) {
                results.push({ address: ip, family: 4 });
            }
        }
        if (v6.status === "fulfilled") {
            for (const ip of v6.value) {
                results.push({ address: ip, family: 6 });
            }
        }
        if (results.length === 0) {
            throw new Error(`No DNS records found for ${host}`);
        }
        return results;
    })();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error(`DNS timeout for ${host}`)), DNS_LOOKUP_TIMEOUT));
    return Promise.race([lookupPromise, timeoutPromise]);
}
