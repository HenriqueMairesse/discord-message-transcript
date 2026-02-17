import { describe, it, expect } from "vitest";
import { isPrivateIp } from "../../../src/core/networkSecurity/ip";

describe("ip.ts - isPrivateIp", () => {
  const privateIPv4 = [
    "0.0.0.0",
    "10.0.0.1",
    "127.0.0.1",
    "169.254.1.1",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.0.1",
    "100.64.0.1",
    "224.0.0.1",
    "255.255.255.255",
  ];

  privateIPv4.forEach(ip => {
    it(`should detect private IPv4: ${ip}`, () => {
      expect(isPrivateIp(ip)).toBe(true);
    });
  });

  const publicIPv4 = [
    "1.1.1.1",
    "8.8.8.8",
    "198.51.100.0",
    "203.0.113.5",
  ];

  publicIPv4.forEach(ip => {
    it(`should detect public IPv4: ${ip}`, () => {
      expect(isPrivateIp(ip)).toBe(false);
    });
  });

  const invalidIPv4 = [
    "256.0.0.1",
    "10.0.0",
    "abc.def.ghi.jkl",
    "1234.123.123.123",
    "",
  ];

  invalidIPv4.forEach(ip => {
    it(`should treat malformed IPv4 as private: ${ip}`, () => {
      expect(isPrivateIp(ip)).toBe(true);
    });
  });

  // IPv6 privados
  const privateIPv6 = [
    "::",
    "::1",
    "fc00::1",
    "fd12:3456::1",
    "fe80::1",
    "ff00::1",
    "2001:db8::1",
  ];

  privateIPv6.forEach(ip => {
    it(`should detect private IPv6: ${ip}`, () => {
      expect(isPrivateIp(ip)).toBe(true);
    });
  });

  // IPv6 públicos
  const publicIPv6 = [
    "2001:4860:4860::8888",
    "2a00:1450:4001:816::200e",
  ];

  publicIPv6.forEach(ip => {
    it(`should detect public IPv6: ${ip}`, () => {
      expect(isPrivateIp(ip)).toBe(false);
    });
  });

  const embeddedIPv4Cases: [string, boolean][] = [
    ["::ffff:192.168.1.1", true],
    ["::ffff:8.8.8.8", false],
    ["::0:192.168.1.1", true],
    ["64:ff9b::8.8.8.8", false],
  ];

  embeddedIPv4Cases.forEach(([ip, expected]) => {
    it(`should detect IPv6 with embedded IPv4 (${ip}) as ${expected ? "private" : "public"}`, () => {
      expect(isPrivateIp(ip)).toBe(expected);
    });
  });

  const trickyIPs: [string, boolean][] = [
    ["0.255.255.255", true],
    ["10.255.255.255", true],
    ["172.15.255.255", false],
    ["172.32.0.0", false],
    ["192.167.255.255", false],
    ["100.128.0.1", false],
  ];

  trickyIPs.forEach(([ip, expected]) => {
    it(`should handle tricky IP ${ip}`, () => {
      expect(isPrivateIp(ip)).toBe(expected);
    });
  });

  const nonIPs = ["hello", "127.0.0.1/24", "192.168.1", "gggg::1"];
  nonIPs.forEach(ip => {
    it(`should treat non-IP string as private: ${ip}`, () => {
      expect(isPrivateIp(ip)).toBe(true);
    });
  });
});