import { describe, it, expect, vi } from "vitest";
import { createLimiter as actualCreateLimiter, getCDNLimiter, getBase64Limiter, setCDNConcurrency, setBase64Concurrency } from "../../../src/core/assetResolver/limiter";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("limiter.ts", () => {

  describe("createLimiter", () => {
    it("should throw an error if concurrency is 0 or less", () => {
      expect(() => actualCreateLimiter(0)).toThrow("Limiter must be greater than 0");
      expect(() => actualCreateLimiter(-1)).toThrow("Limiter must be greater than 0");
    });

    it("should return a function", () => {
      const limiter = actualCreateLimiter(1);
      expect(typeof limiter).toBe("function");
    });

    it("should limit concurrency to the specified number", async () => {
      const concurrency = 2;
      const limiter = actualCreateLimiter(concurrency);
      const tasks: number[] = [];

      const createTask = (id: number, delay: number) =>
        limiter(async () => {
          tasks.push(id);
          await wait(delay);
          return id;
        });

      const promise1 = createTask(1, 50);
      const promise2 = createTask(2, 50);
      const promise3 = createTask(3, 10);
      const promise4 = createTask(4, 10);

      await wait(5);
      expect(tasks).toEqual([1, 2]);

      await Promise.all([promise1, promise2, promise3, promise4]);
      expect(tasks).toEqual([1, 2, 3, 4]);
    });

    it("should handle promises resolving", async () => {
      const limiter = actualCreateLimiter(1);
      const func = vi.fn(() => Promise.resolve("done"));
      const result = await limiter(func);
      expect(func).toHaveBeenCalledTimes(1);
      expect(result).toBe("done");
    });

    it("should handle promises rejecting", async () => {
      const limiter = actualCreateLimiter(1);
      const error = new Error("failed");
      const func = vi.fn(() => Promise.reject(error));
      await expect(limiter(func)).rejects.toThrow(error);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should call finally block even on rejection", async () => {
      const limiter = actualCreateLimiter(1);
      const finallyFn = vi.fn();
      const func = () => Promise.reject("error").finally(finallyFn);

      await expect(limiter(func)).rejects.toBe("error");
      expect(finallyFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCDNLimiter and getBase64Limiter", () => {
    it("should return a limiter function for CDN", () => {
      const limiter = getCDNLimiter();
      expect(typeof limiter).toBe("function");
    });

    it("should return a limiter function for Base64", () => {
      const limiter = getBase64Limiter();
      expect(typeof limiter).toBe("function");
    });

    it("should return the same limiter instance on subsequent calls for CDN", () => {
      const limiter1 = getCDNLimiter();
      const limiter2 = getCDNLimiter();
      expect(limiter1).toBe(limiter2);
    });

    it("should return the same limiter instance on subsequent calls for Base64", () => {
      const limiter1 = getBase64Limiter();
      const limiter2 = getBase64Limiter();
      expect(limiter1).toBe(limiter2);
    });
  });

  describe("setCDNConcurrency and setBase64Concurrency", () => {
    it("should replace CDN limiter instance", () => {
      const before = getCDNLimiter();
      setCDNConcurrency(3);
      const after = getCDNLimiter();

      expect(after).not.toBe(before);
      expect(typeof after).toBe("function");
    });

    it("should replace Base64 limiter instance", () => {
      const before = getBase64Limiter();
      setBase64Concurrency(2);
      const after = getBase64Limiter();

      expect(after).not.toBe(before);
      expect(typeof after).toBe("function");
    });

    it("should throw for invalid CDN concurrency", () => {
      expect(() => setCDNConcurrency(0)).toThrow("Limiter must be greater than 0");
      expect(() => setCDNConcurrency(-1)).toThrow("Limiter must be greater than 0");
    });

    it("should throw for invalid Base64 concurrency", () => {
      expect(() => setBase64Concurrency(0)).toThrow("Limiter must be greater than 0");
      expect(() => setBase64Concurrency(-1)).toThrow("Limiter must be greater than 0");
    });
  });
});
