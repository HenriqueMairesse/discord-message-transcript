import net from "node:net";

export function urlToIpUrl(url: string, ip: string) {

  // If got here shouldn't throw a error
  const u = new URL(url);

  return `${u.protocol}//${ip}` + `${u.port ? ":" + u.port : ""}` + `${u.pathname}${u.search}${u.hash}`;
}

export function createLookup(safeIps: string[]) {
  if (safeIps.length == 0) return undefined;
  return (_hostname: string, _opts: any, cb: any) => {
    const ip = safeIps[Math.floor(Math.random() * safeIps.length)];
    cb(null, ip, net.isIP(ip));
  };
}