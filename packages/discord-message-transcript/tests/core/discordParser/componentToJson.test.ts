import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentType } from "discord.js";
import { JsonComponentType } from "discord-message-transcript-base/internal";
import { componentsToJson, isJsonComponentInContainer } from "../../../src/core/discordParser/componentToJson";

vi.mock("../../../src/core/mappers", () => ({
  mapButtonStyle: vi.fn(() => 111),
  mapSelectorType: vi.fn(() => 222),
  mapSeparatorSpacing: vi.fn(() => 333),
}));

describe("componentsToJson", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters out non-action-row components when includeV2Components is false", async () => {
    const components = [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.StringSelect,
            placeholder: "choose",
            disabled: false,
            options: [{ label: "A", description: null, emoji: null }],
          },
        ],
      },
      { type: ComponentType.TextDisplay, content: "ignored" },
    ] as any;

    const result = await componentsToJson(components, {
      includeV2Components: false,
      includeButtons: true,
      includeComponents: true,
    } as any);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(JsonComponentType.ActionRow);
  });

  it("respects includeButtons/includeComponents inside action row", async () => {
    const components = [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: 1,
            label: "Click",
            emoji: null,
            url: null,
            disabled: false,
          },
          {
            type: ComponentType.StringSelect,
            placeholder: "Pick one",
            disabled: true,
            options: [{ label: "One", description: "d", emoji: null }],
          },
        ],
      },
    ] as any;

    const result = await componentsToJson(components, {
      includeV2Components: false,
      includeButtons: false,
      includeComponents: true,
    } as any);

    const row = result[0] as any;
    expect(row.type).toBe(JsonComponentType.ActionRow);
    expect(row.components).toHaveLength(1);
    expect(row.components[0].type).toBe(JsonComponentType.StringSelect);
  });

  it("forces component/button conversion inside container and filters nested container output", async () => {
    const nestedContainer = {
      type: ComponentType.Container,
      hexAccentColor: "#ffffff",
      spoiler: false,
      components: [{ type: ComponentType.TextDisplay, content: "nested-should-drop" }],
    };

    const components = [
      {
        type: ComponentType.Container,
        hexAccentColor: "#123456",
        spoiler: true,
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: 1,
                label: "Hidden by root opts, but included in container",
                emoji: null,
                url: null,
                disabled: false,
              },
            ],
          },
          { type: ComponentType.TextDisplay, content: "visible" },
          nestedContainer,
        ],
      },
    ] as any;

    const result = await componentsToJson(components, {
      includeV2Components: true,
      includeButtons: false,
      includeComponents: false,
    } as any);

    const container = result[0] as any;
    expect(container.type).toBe(JsonComponentType.Container);
    expect(container.components.some((c: any) => c.type === JsonComponentType.ActionRow)).toBe(true);
    expect(container.components.some((c: any) => c.type === JsonComponentType.TextDisplay)).toBe(true);
    expect(container.components.some((c: any) => c.type === JsonComponentType.Container)).toBe(false);
  });
});

describe("isJsonComponentInContainer", () => {
  it("returns true for container-safe types and false otherwise", () => {
    expect(isJsonComponentInContainer({ type: JsonComponentType.File } as any)).toBe(true);
    expect(isJsonComponentInContainer({ type: JsonComponentType.Container } as any)).toBe(false);
  });
});
