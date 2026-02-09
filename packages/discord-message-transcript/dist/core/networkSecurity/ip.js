import net from "node:net";
export function isPrivateIp(ip) {
    const family = net.isIP(ip);
    if (!family)
        return true;
    if (family === 4)
        return isPrivateIPv4(ip);
    return isPrivateIPv6(ip);
}
function isPrivateIPv4(ip) {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(n => isNaN(n)))
        return true;
    const [a, b] = parts;
    return (a === 0 ||
        a === 10 ||
        a === 127 ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 100 && b >= 64 && b <= 127) ||
        a >= 224);
}
function parseIPv6(ip) {
    if (net.isIP(ip) !== 6)
        return null;
    // handle IPv4 at end
    if (ip.includes(".")) {
        const lastColon = ip.lastIndexOf(":");
        const ipv4Part = ip.slice(lastColon + 1);
        const nums = ipv4Part.split(".").map(Number);
        if (nums.length === 4 && nums.every(n => !isNaN(n))) {
            const hex = ((nums[0] << 8) | nums[1]).toString(16) +
                ":" +
                ((nums[2] << 8) | nums[3]).toString(16);
            ip = ip.slice(0, lastColon) + ":" + hex;
        }
    }
    const sections = ip.split("::");
    let head = sections[0] ? sections[0].split(":") : [];
    let tail = sections[1] ? sections[1].split(":") : [];
    if (sections.length === 2) {
        const missing = 8 - (head.length + tail.length);
        head = [...head, ...Array(missing).fill("0"), ...tail];
    }
    if (head.length !== 8)
        return null;
    const bytes = [];
    for (const part of head) {
        const n = parseInt(part || "0", 16);
        if (isNaN(n))
            return null;
        bytes.push((n >> 8) & 0xff);
        bytes.push(n & 0xff);
    }
    return bytes;
}
function extractEmbeddedIPv4(bytes) {
    const isMapped = bytes.slice(0, 10).every(b => b === 0) &&
        bytes[10] === 0xff &&
        bytes[11] === 0xff;
    if (isMapped) {
        return `${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`;
    }
    const isCompat = bytes.slice(0, 12).every(b => b === 0);
    if (isCompat) {
        return `${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`;
    }
    const isNat64 = bytes[0] === 0x00 &&
        bytes[1] === 0x64 &&
        bytes[2] === 0xff &&
        bytes[3] === 0x9b &&
        bytes.slice(4, 12).every(b => b === 0);
    if (isNat64) {
        return `${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`;
    }
    return null;
}
function isPrivateIPv6(ip) {
    const bytes = parseIPv6(ip);
    if (!bytes)
        return true;
    const embedded = extractEmbeddedIPv4(bytes);
    if (embedded)
        return isPrivateIPv4(embedded);
    // ::
    if (bytes.every(b => b === 0))
        return true;
    // ::1
    if (bytes.slice(0, 15).every(b => b === 0) && bytes[15] === 1)
        return true;
    const first = bytes[0];
    const second = bytes[1];
    // fc00::/7
    if ((first & 0xfe) === 0xfc)
        return true;
    // fe80::/10
    if (first === 0xfe && (second & 0xc0) === 0x80)
        return true;
    // multicast
    if (first === 0xff)
        return true;
    // 2001:db8::/32
    if (bytes[0] === 0x20 &&
        bytes[1] === 0x01 &&
        bytes[2] === 0x0d &&
        bytes[3] === 0xb8)
        return true;
    return false;
}
