import { describe, it, expect } from "vitest";
import { ButtonStyle, ComponentType, SeparatorSpacingSize } from "discord.js";
import { mapButtonStyle, mapSeparatorSpacing, mapComponentType, mapSelectorType, returnTypeMapper } from "../../src/core/mappers";
import { JsonButtonStyle, JsonComponentType, JsonSeparatorSpacingSize, CustomError} from "discord-message-transcript-base/internal";
import { ReturnType as ReturnTypeBase } from "discord-message-transcript-base";
import { ReturnType } from "../../src/types/public/return.js";

describe("mapper", () => {

  describe("mapButtonStyle", () => {
    it("maps all button styles", () => {
      expect(mapButtonStyle(ButtonStyle.Primary)).toBe(JsonButtonStyle.Primary);
      expect(mapButtonStyle(ButtonStyle.Secondary)).toBe(JsonButtonStyle.Secondary);
      expect(mapButtonStyle(ButtonStyle.Success)).toBe(JsonButtonStyle.Success);
      expect(mapButtonStyle(ButtonStyle.Danger)).toBe(JsonButtonStyle.Danger);
      expect(mapButtonStyle(ButtonStyle.Link)).toBe(JsonButtonStyle.Link);
      expect(mapButtonStyle(ButtonStyle.Premium)).toBe(JsonButtonStyle.Premium);
    });

    it("throws on unknown", () => {
      expect(() => mapButtonStyle(999 as ButtonStyle)).toThrow(CustomError);
    });
  });

  describe("mapSeparatorSpacing", () => {
    it("maps spacing", () => {
      expect(mapSeparatorSpacing(SeparatorSpacingSize.Small))
        .toBe(JsonSeparatorSpacingSize.Small);

      expect(mapSeparatorSpacing(SeparatorSpacingSize.Large))
        .toBe(JsonSeparatorSpacingSize.Large);
    });

    it("throws on unknown", () => {
      expect(() => mapSeparatorSpacing(999 as any)).toThrow(CustomError);
    });
  });

  describe("mapComponentType", () => {
    it("maps core components", () => {
      expect(mapComponentType(ComponentType.ActionRow))
        .toBe(JsonComponentType.ActionRow);

      expect(mapComponentType(ComponentType.Button))
        .toBe(JsonComponentType.Button);

      expect(mapComponentType(ComponentType.StringSelect))
        .toBe(JsonComponentType.StringSelect);

      expect(mapComponentType(ComponentType.TextInput))
        .toBe(JsonComponentType.TextInput);
    });

    it("maps advanced components", () => {
      expect(mapComponentType(ComponentType.Section))
        .toBe(JsonComponentType.Section);

      expect(mapComponentType(ComponentType.Container))
        .toBe(JsonComponentType.Container);

      expect(mapComponentType(ComponentType.FileUpload))
        .toBe(JsonComponentType.FileUpload);
    });

    it("throws on unknown", () => {
      expect(() => mapComponentType(999 as ComponentType)).toThrow(CustomError);
    });
  });

  describe("mapSelectorType", () => {
    it("maps selector types", () => {
      expect(mapSelectorType(ComponentType.UserSelect))
        .toBe(JsonComponentType.UserSelect);

      expect(mapSelectorType(ComponentType.RoleSelect))
        .toBe(JsonComponentType.RoleSelect);

      expect(mapSelectorType(ComponentType.MentionableSelect))
        .toBe(JsonComponentType.MentionableSelect);

      expect(mapSelectorType(ComponentType.ChannelSelect))
        .toBe(JsonComponentType.ChannelSelect);
    });

    it("throws on invalid selector", () => {
      expect(() =>
        mapSelectorType(ComponentType.Button as any)
      ).toThrow(CustomError);
    });
  });

  describe("returnTypeMapper", () => {
    it("maps return types", () => {
      expect(returnTypeMapper(ReturnType.Buffer))
        .toBe(ReturnTypeBase.Buffer);

      expect(returnTypeMapper(ReturnType.Stream))
        .toBe(ReturnTypeBase.Stream);

      expect(returnTypeMapper(ReturnType.String))
        .toBe(ReturnTypeBase.String);

      expect(returnTypeMapper(ReturnType.Uploadable))
        .toBe(ReturnTypeBase.Uploadable);
    });

    it("throws on unknown", () => {
      expect(() =>
        returnTypeMapper(999 as unknown as ReturnType)
      ).toThrow(CustomError);
    });
  });

});
