import { ButtonStyle, ComponentType, SeparatorSpacingSize } from "discord.js";
import { JsonButtonStyle, JsonComponentType, JsonSeparatorSpacingSize, ReturnTypeBase } from "discord-message-transcript-base";
import { ReturnType } from "../types/types.js";
export declare function mapButtonStyle(style: ButtonStyle): JsonButtonStyle;
export declare function mapSeparatorSpacing(spacing: SeparatorSpacingSize): JsonSeparatorSpacingSize;
export declare function mapComponentType(componentType: ComponentType): JsonComponentType;
export declare function mapSelectorType(selectorType: ComponentType.UserSelect | ComponentType.RoleSelect | ComponentType.MentionableSelect | ComponentType.ChannelSelect): JsonComponentType.UserSelect | JsonComponentType.RoleSelect | JsonComponentType.MentionableSelect | JsonComponentType.ChannelSelect;
export declare function returnTypeMapper(type: ReturnType): ReturnTypeBase;
