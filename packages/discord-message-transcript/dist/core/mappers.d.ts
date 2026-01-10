import { ButtonStyle, ComponentType, SeparatorSpacingSize } from "discord.js";
import { JsonButtonStyle, JsonComponentType, JsonSeparatorSpacingSize } from "../types/types";
export declare function mapButtonStyle(style: ButtonStyle): JsonButtonStyle;
export declare function mapSeparatorSpacing(spacing: SeparatorSpacingSize): JsonSeparatorSpacingSize;
export declare function mapComponentType(componentType: ComponentType): JsonComponentType;
export declare function mapSelectorType(selectorType: ComponentType.UserSelect | ComponentType.RoleSelect | ComponentType.MentionableSelect | ComponentType.ChannelSelect): JsonComponentType.UserSelect | JsonComponentType.RoleSelect | JsonComponentType.MentionableSelect | JsonComponentType.ChannelSelect;
