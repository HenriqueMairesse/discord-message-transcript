import { ButtonStyle, ComponentType, SeparatorSpacingSize } from "discord.js";
import { CustomError, JsonButtonStyle, JsonComponentType, JsonSeparatorSpacingSize, ReturnTypeBase } from "discord-message-transcript-base";
import { ReturnType } from "../types/types.js";
export function mapButtonStyle(style) {
    switch (style) {
        case ButtonStyle.Primary:
            return JsonButtonStyle.Primary;
        case ButtonStyle.Secondary:
            return JsonButtonStyle.Secondary;
        case ButtonStyle.Success:
            return JsonButtonStyle.Success;
        case ButtonStyle.Danger:
            return JsonButtonStyle.Danger;
        case ButtonStyle.Link:
            return JsonButtonStyle.Link;
        case ButtonStyle.Premium:
            return JsonButtonStyle.Premium;
        default:
            throw new CustomError(`Unknow ButtonStyle: ${style}`);
    }
}
export function mapSeparatorSpacing(spacing) {
    switch (spacing) {
        case SeparatorSpacingSize.Small:
            return JsonSeparatorSpacingSize.Small;
        case SeparatorSpacingSize.Large:
            return JsonSeparatorSpacingSize.Large;
        default:
            throw new CustomError(`Unknow SeparatorSpacingSize: ${spacing}`);
    }
}
export function mapComponentType(componentType) {
    switch (componentType) {
        case ComponentType.ActionRow:
            return JsonComponentType.ActionRow;
        case ComponentType.Button:
            return JsonComponentType.Button;
        case ComponentType.StringSelect:
            return JsonComponentType.StringSelect;
        case ComponentType.TextInput:
            return JsonComponentType.TextInput;
        case ComponentType.UserSelect:
            return JsonComponentType.UserSelect;
        case ComponentType.RoleSelect:
            return JsonComponentType.RoleSelect;
        case ComponentType.MentionableSelect:
            return JsonComponentType.MentionableSelect;
        case ComponentType.ChannelSelect:
            return JsonComponentType.ChannelSelect;
        case ComponentType.Section:
            return JsonComponentType.Section;
        case ComponentType.TextDisplay:
            return JsonComponentType.TextDisplay;
        case ComponentType.Thumbnail:
            return JsonComponentType.Thumbnail;
        case ComponentType.MediaGallery:
            return JsonComponentType.MediaGallery;
        case ComponentType.File:
            return JsonComponentType.File;
        case ComponentType.Separator:
            return JsonComponentType.Separator;
        case ComponentType.ContentInventoryEntry:
            return JsonComponentType.ContentInventoryEntry;
        case ComponentType.Container:
            return JsonComponentType.Container;
        case ComponentType.Label:
            return JsonComponentType.Label;
        case ComponentType.FileUpload:
            return JsonComponentType.FileUpload;
        default:
            throw new CustomError(`Unknow ComponentType: ${componentType}`);
    }
}
export function mapSelectorType(selectorType) {
    switch (selectorType) {
        case ComponentType.UserSelect:
            return JsonComponentType.UserSelect;
        case ComponentType.RoleSelect:
            return JsonComponentType.RoleSelect;
        case ComponentType.MentionableSelect:
            return JsonComponentType.MentionableSelect;
        case ComponentType.ChannelSelect:
            return JsonComponentType.ChannelSelect;
        default:
            throw new CustomError(`Unknow SelectorComponentType: ${selectorType}`);
    }
}
export function returnTypeMapper(type) {
    switch (type) {
        case ReturnType.Buffer:
            return ReturnTypeBase.Buffer;
        case ReturnType.Stream:
            return ReturnTypeBase.Stream;
        case ReturnType.String:
            return ReturnTypeBase.String;
        case ReturnType.Uploadable:
            return ReturnTypeBase.Uploadable;
        default:
            throw new CustomError(`Can't convert ReturnType.Attachment to ReturnTypeBase!`);
    }
}
