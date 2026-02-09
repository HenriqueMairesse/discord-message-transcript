import net from "node:net";
export function urlToIpUrl(url, ip) {
    // If got here shouldn't throw a error
    const u = new URL(url);
    return `${u.protocol}//${ip}` + `${u.port ? ":" + u.port : ""}` + `${u.pathname}${u.search}`;
}
export function createLookup(safeIps) {
    if (safeIps.length == 0)
        return undefined;
    return (_hostname, _opts, cb) => {
        const ip = safeIps[Math.floor(Math.random() * safeIps.length)];
        cb(null, ip, net.isIP(ip));
    };
}
