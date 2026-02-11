import { TopLevelComponent, ComponentType, ActionRow, MessageActionRowComponent, ContainerComponent, FileComponent, MediaGalleryComponent, SectionComponent, SeparatorComponent, TextDisplayComponent } from "discord.js";
import { mapButtonStyle, mapSelectorType, mapSeparatorSpacing } from "../mappers.js"
import { JsonTopLevelComponent, JsonButtonComponent, JsonSelectMenu, JsonComponentType, JsonThumbnailComponent, JsonTextDisplayComponent, TranscriptOptionsBase, JsonActionRow, JsonContainerComponent, JsonFileComponent, JsonMediaGalleryComponent, JsonSectionComponent, JsonSeparatorComponent, JsonComponentInContainer, isValidHexColor } from "discord-message-transcript-base/internal";

export async function componentsToJson(components: TopLevelComponent[], options: TranscriptOptionsBase): Promise<JsonTopLevelComponent[]> {

    const filtered = components.filter(c => options.includeV2Components || c.type === ComponentType.ActionRow);

    const processed: (JsonTopLevelComponent | null)[] = await Promise.all(filtered.map(c => convertComponent(c, options)));

    return processed.filter(c => c != null);
}

async function convertComponent(component: TopLevelComponent, options: TranscriptOptionsBase): Promise<JsonTopLevelComponent | null> {
    switch (component.type) {
        case ComponentType.ActionRow:
            return convertActionRow(component, options);
        case ComponentType.Container:
            return convertContainer(component, options);
        case ComponentType.File:
            return convertFile(component);
        case ComponentType.MediaGallery:
            return convertMediaGallery(component);
        case ComponentType.Section:
            return convertSection(component);
        case ComponentType.Separator:
            return convertSeparator(component);
        case ComponentType.TextDisplay:
            return convertTextDisplay(component);
        default:
            return null;
    }
}

async function convertActionRow(component: ActionRow<MessageActionRowComponent>, options: TranscriptOptionsBase): Promise<JsonActionRow | null> {
    const rowComponents = await Promise.all(component.components
        .filter(c => (c.type === ComponentType.Button ? options.includeButtons : options.includeComponents))
        .map(c => convertActionRowChild(c))
    );

    if (rowComponents.length === 0) return null;
    return { type: JsonComponentType.ActionRow, components: rowComponents };
}

async function convertActionRowChild(component: MessageActionRowComponent): Promise<JsonButtonComponent | JsonSelectMenu> {
    switch (component.type) {
        case ComponentType.Button: {
            return {
                type: JsonComponentType.Button,
                style: mapButtonStyle(component.style),
                label: component.label,
                emoji: component.emoji?.name ?? null,
                url: component.url,
                disabled: component.disabled,
            };
        }

        case ComponentType.StringSelect: {
            return {
                type: JsonComponentType.StringSelect,
                placeholder: component.placeholder,
                disabled: component.disabled,
                options: component.options.map(option => ({
                    label: option.label,
                    description: option.description ?? null,
                    emoji: option.emoji ? { id: option.emoji.id ?? null, name: option.emoji.name ?? null, animated: option.emoji.animated ?? false } : null,
                })),
            };
        }
    
        default: {
            return {
                type: mapSelectorType(component.type),
                placeholder: component.placeholder,
                disabled: component.disabled,
            };
        }
    }
}

async function convertContainer(component: ContainerComponent, options: TranscriptOptionsBase): Promise<JsonContainerComponent> {
    const newOptions = {...options, includeComponents: true, includeButtons: true};
    const componentsJson = await componentsToJson(component.components, newOptions);
    return {
        type: JsonComponentType.Container,
        components: componentsJson.filter(isJsonComponentInContainer), // Input components that are container-safe must always produce container-safe output.
        hexAccentColor: isValidHexColor(component.hexAccentColor, false),
        spoiler: component.spoiler,
    };
}

function convertFile(component: FileComponent): JsonFileComponent {
    return {
        type: JsonComponentType.File,
        fileName: component.data.name ?? null,
        size: component.data.size ?? 0,
        url: component.file.url,
        spoiler: component.spoiler,
    };
}

async function convertMediaGallery(component: MediaGalleryComponent): Promise<JsonMediaGalleryComponent> {
    const mediaItems = await Promise.all(component.items.map(item => {
        return {
            media: { url: item.media.url },
            spoiler: item.spoiler,
        };
    }));
    return {
        type: JsonComponentType.MediaGallery,
        items: mediaItems,
    };
}

function convertSection(component: SectionComponent): JsonSectionComponent {

    let accessoryJson: JsonButtonComponent | JsonThumbnailComponent | null = null;
    switch (component.accessory.type) {
        case ComponentType.Button: {
            accessoryJson = {
                type: JsonComponentType.Button,
                style: mapButtonStyle(component.accessory.style),
                label: component.accessory.label,
                emoji: component.accessory.emoji?.name ? component.accessory.emoji.name : null,
                url: component.accessory.url,
                disabled: component.accessory.disabled,
            };
            break;
        }

        case ComponentType.Thumbnail: {
            accessoryJson = {
                type: JsonComponentType.Thumbnail,
                media: {
                    url: component.accessory.media.url,
                },
                spoiler: component.accessory.spoiler,
            };
            break;
        }
    
        default:
            break;
    }

    const sectionComponents: JsonTextDisplayComponent[] = component.components.map(c => ({
        type: JsonComponentType.TextDisplay,
        content: c.content,
    })); 

    return {
        type: JsonComponentType.Section,
        accessory: accessoryJson,
        components: sectionComponents,
    };
}

function convertSeparator(component: SeparatorComponent): JsonSeparatorComponent {
    return {
        type: JsonComponentType.Separator,
        spacing: mapSeparatorSpacing(component.spacing),
        divider: component.divider,
    };
}

function convertTextDisplay(component: TextDisplayComponent): JsonTextDisplayComponent {
    return {
        type: JsonComponentType.TextDisplay,
        content: component.content,
    };
}

export function isJsonComponentInContainer(
  component: JsonTopLevelComponent
): component is JsonComponentInContainer {
  return (
    component.type == JsonComponentType.ActionRow ||
    component.type == JsonComponentType.File ||
    component.type == JsonComponentType.MediaGallery ||
    component.type == JsonComponentType.Section ||
    component.type == JsonComponentType.Separator ||
    component.type == JsonComponentType.TextDisplay
  );
}