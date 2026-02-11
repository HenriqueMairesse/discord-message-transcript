import { hexColor } from "../util.js";
import { JsonButtonComponent } from "./components.js";
import { JsonComponentType, JsonSeparatorSpacingSize } from "./enum.js";
import { JsonComponentInContainer } from "./messageItens.js";
/**
 * A union of all V2 component types.
 */
export type JsonV2Component = JsonContainerComponent | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent | JsonThumbnailComponent;
/**
 * A JSON-serializable representation of a V2 container component.
 */
export interface JsonContainerComponent {
    /**
     * The components inside the container.
     */
    components: JsonComponentInContainer[];
    /**
     * The accent color of the container's border.
     */
    hexAccentColor: hexColor;
    /**
     * Whether the container's content is a spoiler.
     */
    spoiler: boolean;
    /**
     * The type of the component.
     */
    type: JsonComponentType.Container;
}
/**
 * A JSON-serializable representation of a V2 file component.
 */
export interface JsonFileComponent {
    /**
     * The name of the file.
     */
    fileName: string | null;
    /**
     * The size of the file in bytes.
     */
    size: number;
    /**
     * Whether the file is a spoiler.
     */
    spoiler: boolean;
    /**
     * The type of the component.
     */
    type: JsonComponentType.File;
    /**
     * The URL of the file.
     */
    url: string;
}
/**
 * A JSON-serializable representation of a V2 media gallery component.
 */
export interface JsonMediaGalleryComponent {
    /**
     * The items within the media gallery.
     */
    items: {
        media: {
            url: string;
        };
        spoiler: boolean;
    }[];
    /**
     * The type of the component.
     */
    type: JsonComponentType.MediaGallery;
}
/**
 * A JSON-serializable representation of a V2 section component.
 */
export interface JsonSectionComponent {
    /**
     * The accessory component on the right side of the section.
     */
    accessory: JsonButtonComponent | JsonThumbnailComponent | null;
    /**
     * The components inside the section.
     */
    components: JsonTextDisplayComponent[];
    /**
     * The type of the component.
     */
    type: JsonComponentType.Section;
}
/**
 * A JSON-serializable representation of a V2 separator component.
 */
export interface JsonSeparatorComponent {
    /**
     * Whether the separator is a visible line.
     */
    divider: boolean;
    /**
     * The spacing size of the separator.
     */
    spacing: JsonSeparatorSpacingSize;
    /**
     * The type of the component.
     */
    type: JsonComponentType.Separator;
}
/**
 * A JSON-serializable representation of a V2 text display component.
 */
export interface JsonTextDisplayComponent {
    /**
     * The content of the text display.
     */
    content: string;
    /**
     * The type of the component.
     */
    type: JsonComponentType.TextDisplay;
}
/**
 * A JSON-serializable representation of a V2 thumbnail component.
 */
export interface JsonThumbnailComponent {
    /**
     * The media information for the thumbnail.
     */
    media: {
        url: string;
    };
    /**
     * Whether the thumbnail is a spoiler.
     */
    spoiler: boolean;
    /**
     * The type of the component.
     */
    type: JsonComponentType.Thumbnail;
}
