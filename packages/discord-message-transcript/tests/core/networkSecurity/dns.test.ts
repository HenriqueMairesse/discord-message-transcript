import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveAllIps } from "../../../src/core/networkSecurity/dns";

const mockResolve4 = vi.fn();
const mockResolve6 = vi.fn();

vi.mock("dns/promises", () => {
  return {
    Resolver: class {
      setServers() {}
      resolve4 = mockResolve4;
      resolve6 = mockResolve6;
    },
  };
});

describe("dns.ts - resolveAllIps", () => {
  beforeEach(() => {
    mockResolve4.mockReset();
    mockResolve6.mockReset();
  });

  it("resolves both IPv4 and IPv6 successfully", async () => {
    mockResolve4.mockImplementation(() => Promise.resolve(["1.2.3.4"]));
    mockResolve6.mockImplementation(() => Promise.resolve(["abcd::1"]));

    const result = await resolveAllIps("example.com");

    expect(result).toEqual([
      { address: "1.2.3.4", family: 4 },
      { address: "abcd::1", family: 6 },
    ]);
  });

  it("throws error if no records found", async () => {
    mockResolve4.mockImplementation(() => Promise.resolve([]));
    mockResolve6.mockImplementation(() => Promise.resolve([]));

    await expect(resolveAllIps("empty.com")).rejects.toThrow("No DNS records found");
  });

  it("timeout triggers if DNS does not resolve", async () => {
    mockResolve4.mockImplementation(() => new Promise(() => {}));
    mockResolve6.mockImplementation(() => new Promise(() => {}));

    const timeoutPromise = new Promise((_res, rej) => setTimeout(() => rej(new Error("DNS timeout")), 50));

    await expect(Promise.race([resolveAllIps("timeout.com"), timeoutPromise])).rejects.toThrow("DNS timeout");
  });

  it("only includes fulfilled records", async () => {
    mockResolve4.mockImplementation(() => Promise.reject(new Error("fail")));
    mockResolve6.mockImplementation(() => Promise.resolve(["abcd::1"]));

    const result = await resolveAllIps("partial.com");

    expect(result).toEqual([{ address: "abcd::1", family: 6 }]);
  });
});
