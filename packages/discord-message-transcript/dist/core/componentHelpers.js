import { ComponentType, ButtonStyle, SeparatorSpacingSize } from "discord.js";
import { JsonComponentType, JsonButtonStyle, JsonSeparatorSpacingSize } from "../types/types";
import { CustomError } from "./error";
export function componentsToJson(components, options) {
    return components.filter(component => {
        return !(!options.includeV2Components && component.type != ComponentType.ActionRow);
    }).map(component => {
        switch (component.type) {
            case ComponentType.ActionRow: {
                const actionRowComponents = component.components.filter(c => {
                    if (c.type == ComponentType.Button && !options.includeButtons) {
                        return false;
                    }
                    if (c.type != ComponentType.Button && !options.includeComponents) {
                        return false;
                    }
                    return true;
                }).map(c => {
                    if (c.type === ComponentType.Button) {
                        return {
                            type: JsonComponentType.Button,
                            style: mapButtonStyle(c.style),
                            label: c.label,
                            emoji: c.emoji ? {
                                id: c.emoji.id ?? null,
                                name: c.emoji.name ?? null,
                                animated: c.emoji.animated ?? false,
                            } : null,
                            url: c.url,
                            disabled: c.disabled,
                        };
                    }
                    else if (c.type === ComponentType.StringSelect) {
                        return {
                            type: JsonComponentType.StringSelect,
                            placeholder: c.placeholder,
                            disabled: c.disabled,
                            options: c.options.map(option => ({
                                label: option.label,
                                description: option.description ?? null,
                                emoji: option.emoji ? {
                                    id: option.emoji.id ?? null,
                                    name: option.emoji.name ?? null,
                                    animated: option.emoji.animated ?? false,
                                } : null,
                            }))
                        };
                    }
                    else {
                        return {
                            type: JsonComponentType.RoleSelect,
                            placeholder: c.placeholder,
                            disabled: c.disabled,
                        };
                    }
                });
                if (actionRowComponents.length > 0) {
                    return {
                        type: JsonComponentType.ActionRow,
                        components: actionRowComponents,
                    };
                }
                else {
                    return null;
                }
            }
            case ComponentType.Container: {
                const newOptions = { ...options, includeComponents: true, includeButtons: true };
                return {
                    type: JsonComponentType.Container,
                    components: componentsToJson(component.components, newOptions).filter(isJsonComponentInContainer), // Impossible to send an component that can be used inside and return an component that can't be used inside
                    hexAccentColor: component.hexAccentColor,
                    spoiler: component.spoiler,
                };
            }
            case ComponentType.File: {
                return {
                    type: JsonComponentType.File,
                    fileName: component.data.name ?? null,
                    size: component.data.size ?? 0,
                    url: component.file.url,
                    spoiler: component.spoiler,
                };
            }
            case ComponentType.MediaGallery: {
                return {
                    type: JsonComponentType.MediaGallery,
                    items: component.items.map(item => ({
                        media: { url: item.media.url },
                        spoiler: item.spoiler,
                    })),
                };
            }
            case ComponentType.Section: {
                return {
                    type: JsonComponentType.Section,
                    accessory: (component.accessory.type === ComponentType.Button ? {
                        type: JsonComponentType.Button,
                        style: mapButtonStyle(component.accessory.style),
                        label: component.accessory.label,
                        emoji: component.accessory.emoji ? {
                            id: component.accessory.emoji.id ?? null,
                            name: component.accessory.emoji.name ?? null,
                            animated: component.accessory.emoji.animated ?? false,
                        } : null,
                        url: component.accessory.url,
                        disabled: component.accessory.disabled,
                    } : {
                        type: JsonComponentType.Thumbnail,
                        media: {
                            url: component.accessory.media.url,
                        },
                        spoiler: component.accessory.spoiler,
                    }),
                    components: component.components.map(c => ({
                        type: JsonComponentType.TextDisplay,
                        content: c.content,
                    })),
                };
            }
            case ComponentType.Separator: {
                return {
                    type: JsonComponentType.Separator,
                    spacing: mapSeparatorSpacing(component.spacing),
                    divider: component.divider,
                };
            }
            case ComponentType.TextDisplay: {
                return {
                    type: JsonComponentType.TextDisplay,
                    content: component.content,
                };
            }
            default:
                return null;
        }
    })
        .filter(c => c != null);
}
function mapButtonStyle(style) {
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
function mapSeparatorSpacing(spacing) {
    switch (spacing) {
        case SeparatorSpacingSize.Small:
            return JsonSeparatorSpacingSize.Small;
        case SeparatorSpacingSize.Large:
            return JsonSeparatorSpacingSize.Large;
        default:
            throw new CustomError(`Unknow SeparatorSpacingSize: ${spacing}`);
    }
}
function isJsonComponentInContainer(component) {
    return (component.type == JsonComponentType.ActionRow ||
        component.type == JsonComponentType.File ||
        component.type == JsonComponentType.MediaGallery ||
        component.type == JsonComponentType.Section ||
        component.type == JsonComponentType.Separator ||
        component.type == JsonComponentType.TextDisplay);
}
