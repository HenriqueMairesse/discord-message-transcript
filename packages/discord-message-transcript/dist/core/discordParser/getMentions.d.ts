import { Message } from "discord.js";
import { MapMentions } from "../../types/private/maps.js";
export declare function getMentions(message: Message, mentions: MapMentions): Promise<void>;
