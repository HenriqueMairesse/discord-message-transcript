/**
 * An enum-like object for the possible return types, excluding 'attachment'.
 */
export const ReturnTypeBase = {
    /**
     * Returns a `Buffer`.
     */
    Buffer: "buffer",
    /**
     * Returns a `Stream.Readable`.
     */
    Stream: "stream",
    /**
     * Returns a `string`.
     */
    String: "string",
    /**
     * Returns an `Uploadable` object.
     */
    Uploadable: "uploadable"
};
/**
 * An enum for all possible return types, used for parsing.
 */
export var ReturnTypeParse;
(function (ReturnTypeParse) {
    ReturnTypeParse["Attachment"] = "attachment";
    ReturnTypeParse["Buffer"] = "buffer";
    ReturnTypeParse["Stream"] = "stream";
    ReturnTypeParse["String"] = "string";
    ReturnTypeParse["Uploadable"] = "uploadable";
})(ReturnTypeParse || (ReturnTypeParse = {}));
;
/**
 * An enum-like object for the possible transcript formats.
 */
export const ReturnFormat = {
    /**
     * JSON format.
     */
    JSON: "JSON",
    /**
     * HTML format.
     */
    HTML: "HTML"
};
/**
 * An enum representing the styles of a Discord button.
 */
export var JsonButtonStyle;
(function (JsonButtonStyle) {
    JsonButtonStyle[JsonButtonStyle["Primary"] = 1] = "Primary";
    JsonButtonStyle[JsonButtonStyle["Secondary"] = 2] = "Secondary";
    JsonButtonStyle[JsonButtonStyle["Success"] = 3] = "Success";
    JsonButtonStyle[JsonButtonStyle["Danger"] = 4] = "Danger";
    JsonButtonStyle[JsonButtonStyle["Link"] = 5] = "Link";
    JsonButtonStyle[JsonButtonStyle["Premium"] = 6] = "Premium";
})(JsonButtonStyle || (JsonButtonStyle = {}));
/**
 * An enum representing all known component types.
 */
export var JsonComponentType;
(function (JsonComponentType) {
    JsonComponentType[JsonComponentType["ActionRow"] = 1] = "ActionRow";
    JsonComponentType[JsonComponentType["Button"] = 2] = "Button";
    JsonComponentType[JsonComponentType["StringSelect"] = 3] = "StringSelect";
    JsonComponentType[JsonComponentType["TextInput"] = 4] = "TextInput";
    JsonComponentType[JsonComponentType["UserSelect"] = 5] = "UserSelect";
    JsonComponentType[JsonComponentType["RoleSelect"] = 6] = "RoleSelect";
    JsonComponentType[JsonComponentType["MentionableSelect"] = 7] = "MentionableSelect";
    JsonComponentType[JsonComponentType["ChannelSelect"] = 8] = "ChannelSelect";
    JsonComponentType[JsonComponentType["Section"] = 9] = "Section";
    JsonComponentType[JsonComponentType["TextDisplay"] = 10] = "TextDisplay";
    JsonComponentType[JsonComponentType["Thumbnail"] = 11] = "Thumbnail";
    JsonComponentType[JsonComponentType["MediaGallery"] = 12] = "MediaGallery";
    JsonComponentType[JsonComponentType["File"] = 13] = "File";
    JsonComponentType[JsonComponentType["Separator"] = 14] = "Separator";
    JsonComponentType[JsonComponentType["ContentInventoryEntry"] = 16] = "ContentInventoryEntry";
    JsonComponentType[JsonComponentType["Container"] = 17] = "Container";
    JsonComponentType[JsonComponentType["Label"] = 18] = "Label";
    JsonComponentType[JsonComponentType["FileUpload"] = 19] = "FileUpload";
})(JsonComponentType || (JsonComponentType = {}));
/**
 * An enum representing the spacing size of a separator component.
 */
export var JsonSeparatorSpacingSize;
(function (JsonSeparatorSpacingSize) {
    JsonSeparatorSpacingSize[JsonSeparatorSpacingSize["Small"] = 1] = "Small";
    JsonSeparatorSpacingSize[JsonSeparatorSpacingSize["Large"] = 2] = "Large";
})(JsonSeparatorSpacingSize || (JsonSeparatorSpacingSize = {}));
