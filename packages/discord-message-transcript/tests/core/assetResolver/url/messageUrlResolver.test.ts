import { describe, it, expect, vi, beforeEach } from "vitest";
import { JsonComponentType } from "discord-message-transcript-base/internal";
import { messagesUrlResolver } from "../../../../src/core/assetResolver/url/messageUrlResolver";
import { imageUrlResolver } from "../../../../src/core/assetResolver/url/imageUrlResolver";
import { isSafeForHTML } from "../../../../src/core/networkSecurity";
import { urlResolver } from "../../../../src/core/assetResolver/url/urlResolver";
import { isJsonComponentInContainer } from "../../../../src/core/discordParser/componentToJson.js";

vi.mock("../../../../src/core/assetResolver/url/imageUrlResolver", () => ({
  imageUrlResolver: vi.fn(),
}));

vi.mock("../../../../src/core/networkSecurity", () => ({
  isSafeForHTML: vi.fn(),
}));

vi.mock("../../../../src/core/assetResolver/url/urlResolver", () => ({
  urlResolver: vi.fn(),
}));

vi.mock("../../../../src/core/discordParser/componentToJson.js", () => ({
  isJsonComponentInContainer: vi.fn((component: any) => component.id !== "drop"),
}));

describe("messagesUrlResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(imageUrlResolver).mockImplementation(async (url: string | null) => {
      if (!url) return null;
      return { safe: true, safeIps: [], url: `safe:${url}` };
    });

    vi.mocked(isSafeForHTML).mockImplementation(async (url: string) => ({
      safe: true,
      safeIps: [],
      url: `safe:${url}`,
    }));

    vi.mocked(urlResolver).mockImplementation(async (safeUrlObject: any) => `final:${safeUrlObject.url}`);
  });

  it("resolves URLs for attachments, embeds and components", async () => {
    const messages = [
      {
        attachments: [
          { name: "image.png", url: "https://discord.test/image.png", contentType: "image/png" },
          { name: "doc.txt", url: "https://discord.test/doc.txt", contentType: "text/plain" },
        ],
        embeds: [
          {
            author: { iconURL: "attachment://image.png" },
            footer: { iconURL: "https://discord.test/footer.png" },
            image: { url: "https://discord.test/embed-image.png" },
            thumbnail: { url: "https://discord.test/thumb.png" },
          },
        ],
        components: [
          {
            type: JsonComponentType.Section,
            accessory: {
              type: JsonComponentType.Thumbnail,
              media: { url: "attachment://image.png" },
            },
          },
          {
            type: JsonComponentType.MediaGallery,
            items: [{ media: { url: "https://discord.test/gallery.png" } }],
          },
          {
            type: JsonComponentType.File,
            url: "https://discord.test/file-component.bin",
          },
          {
            type: JsonComponentType.Container,
            components: [
              { type: 999, id: "keep" },
              { type: 999, id: "drop" },
            ],
          },
        ],
      },
    ] as any;

    const result = await messagesUrlResolver(
      messages,
      { disableWarnings: false, saveImages: false, fileName: "out.txt" } as any,
      { provider: "CUSTOM", resolver: vi.fn(), customData: null } as any,
      new Map(),
    );

    expect(result[0].attachments[0].url).toBe("final:safe:https://discord.test/image.png");
    expect(result[0].attachments[1].url).toBe("final:safe:https://discord.test/doc.txt");
    expect(result[0].embeds[0].author?.iconURL).toBe("final:safe:attachment://image.png");
    expect(result[0].embeds[0].footer?.iconURL).toBe("final:safe:https://discord.test/footer.png");
    expect(result[0].embeds[0].image?.url).toBe("final:safe:https://discord.test/embed-image.png");
    expect(result[0].embeds[0].thumbnail?.url).toBe("final:safe:https://discord.test/thumb.png");
    const sectionComponent = result[0].components[0] as any;
    const galleryComponent = result[0].components[1] as any;
    const fileComponent = result[0].components[2] as any;
    const containerComponent = result[0].components[3] as any;

    expect(sectionComponent.accessory.media.url).toBe("final:safe:attachment://image.png");
    expect(galleryComponent.items[0].media.url).toBe("final:safe:https://discord.test/gallery.png");
    expect(fileComponent.url).toBe("final:safe:https://discord.test/file-component.bin");
    expect(containerComponent.components).toEqual([{ type: 999, id: "keep" }]);

    expect(isJsonComponentInContainer).toHaveBeenCalled();
    expect(urlResolver).toHaveBeenCalled();
  });
});
