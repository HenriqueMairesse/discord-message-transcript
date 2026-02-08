import { ComponentType } from "discord.js";
import { mapButtonStyle, mapSelectorType, mapSeparatorSpacing } from "./mappers.js";
import { JsonComponentType } from "discord-message-transcript-base";
import { isValidHexColor } from "../../../discord-message-transcript-base/src/core/sanitizer.js";
export async function componentsToJson(components, options) {
    const processedComponents = await Promise.all(components.filter(component => !(!options.includeV2Components && component.type != ComponentType.ActionRow))
        .map(async (component) => {
        switch (component.type) {
            case ComponentType.ActionRow: {
                const actionRowComponents = await Promise.all(component.components.filter(c => {
                    if (c.type == ComponentType.Button && !options.includeButtons)
                        return false;
                    if (c.type != ComponentType.Button && !options.includeComponents)
                        return false;
                    return true;
                }).map(async (c) => {
                    if (c.type === ComponentType.Button) {
                        return {
                            type: JsonComponentType.Button,
                            style: mapButtonStyle(c.style),
                            label: c.label,
                            emoji: c.emoji?.name ? c.emoji.name : null,
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
                            type: mapSelectorType(c.type),
                            placeholder: c.placeholder,
                            disabled: c.disabled,
                        };
                    }
                }));
                if (actionRowComponents.length > 0)
                    return { type: JsonComponentType.ActionRow, components: actionRowComponents };
                return null;
            }
            case ComponentType.Container: {
                const newOptions = { ...options, includeComponents: true, includeButtons: true };
                const componentsJson = await componentsToJson(component.components, newOptions);
                return {
                    type: JsonComponentType.Container,
                    components: componentsJson.filter(isJsonComponentInContainer), // Input components that are container-safe must always produce container-safe output.
                    hexAccentColor: isValidHexColor(component.hexAccentColor, false),
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
                const mediaItems = component.items.map(item => {
                    return {
                        media: { url: item.media.url },
                        spoiler: item.spoiler,
                    };
                });
                return {
                    type: JsonComponentType.MediaGallery,
                    items: mediaItems,
                };
            }
            case ComponentType.Section: {
                let accessoryJson;
                if (component.accessory.type === ComponentType.Button) {
                    accessoryJson = {
                        type: JsonComponentType.Button,
                        style: mapButtonStyle(component.accessory.style),
                        label: component.accessory.label,
                        emoji: component.accessory.emoji?.name ? component.accessory.emoji.name : null,
                        url: component.accessory.url,
                        disabled: component.accessory.disabled,
                    };
                }
                else if (component.accessory.type === ComponentType.Thumbnail) {
                    accessoryJson = {
                        type: JsonComponentType.Thumbnail,
                        media: {
                            url: component.accessory.media.url,
                        },
                        spoiler: component.accessory.spoiler,
                    };
                }
                else
                    return null;
                const sectionComponents = component.components.map(c => ({
                    type: JsonComponentType.TextDisplay,
                    content: c.content,
                }));
                return {
                    type: JsonComponentType.Section,
                    accessory: accessoryJson,
                    components: sectionComponents,
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
    }));
    return processedComponents.filter(c => c != null);
}
export function isJsonComponentInContainer(component) {
    return (component.type == JsonComponentType.ActionRow ||
        component.type == JsonComponentType.File ||
        component.type == JsonComponentType.MediaGallery ||
        component.type == JsonComponentType.Section ||
        component.type == JsonComponentType.Separator ||
        component.type == JsonComponentType.TextDisplay);
}
