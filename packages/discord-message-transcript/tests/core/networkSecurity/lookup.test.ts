import { describe, it, expect, vi, beforeEach } from "vitest";
import net from "node:net";
import { urlToIpUrl, createLookup } from "../../../src/core/networkSecurity/lookup";

describe("lookup.ts", () => {
  describe("urlToIpUrl", () => {
    it("substitui hostname pelo IP mantendo protocolo, porta, path e query", () => {
      const url = "https://example.com:8080/path/to/page?a=1&b=2";
      const ip = "1.2.3.4";
      const result = urlToIpUrl(url, ip);
      expect(result).toBe("https://1.2.3.4:8080/path/to/page?a=1&b=2");
    });

    it("funciona sem porta", () => {
      const url = "http://example.com/test";
      const ip = "5.6.7.8";
      const result = urlToIpUrl(url, ip);
      expect(result).toBe("http://5.6.7.8/test");
    });

    it("mantém hash se houver", () => {
      const url = "https://example.com/path#section";
      const ip = "9.10.11.12";
      const result = urlToIpUrl(url, ip);
      expect(result).toBe("https://9.10.11.12/path#section");
    });

    it("mantém apenas path se URL simples", () => {
      const url = "http://example.com/";
      const ip = "127.0.0.1";
      const result = urlToIpUrl(url, ip);
      expect(result).toBe("http://127.0.0.1/");
    });
  });

  describe("createLookup", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("retorna undefined se lista de IPs estiver vazia", () => {
      const lookup = createLookup([]);
      expect(lookup).toBeUndefined();
    });

    it("retorna função que devolve IP da lista e família correta", () => {
      const ips = ["1.2.3.4", "2001:db8::1"];
      const cb = vi.fn();
      const lookup = createLookup(ips)!;

      const mathRandomMock = vi.spyOn(Math, "random").mockReturnValue(0.1);

      lookup("example.com", {}, cb);

      expect(cb).toHaveBeenCalledTimes(1);
      const [err, ip, family] = cb.mock.calls[0];
      expect(err).toBeNull();
      expect(ips).toContain(ip);
      expect(family).toBe(net.isIP(ip));

      mathRandomMock.mockRestore();
    });

    it("funciona com apenas um IP na lista", () => {
      const ips = ["9.8.7.6"];
      const cb = vi.fn();
      const lookup = createLookup(ips)!;
      lookup("example.com", {}, cb);

      expect(cb).toHaveBeenCalledOnce();
      const [err, ip, family] = cb.mock.calls[0];
      expect(err).toBeNull();
      expect(ip).toBe("9.8.7.6");
      expect(family).toBe(4);
    });

    it("retorna 0 (inválido) se IP inválido", () => {
      const ips = ["invalid-ip"];
      const cb = vi.fn();
      const lookup = createLookup(ips)!;
      lookup("example.com", {}, cb);

      const [err, ip, family] = cb.mock.calls[0];
      expect(ip).toBe("invalid-ip");
      expect(family).toBe(0);
    });
  });
});
