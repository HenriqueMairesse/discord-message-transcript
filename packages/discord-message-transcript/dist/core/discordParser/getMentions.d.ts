import { Message } from "discord.js";
import { MapMentions } from "@/types";
export declare function getMentions(message: Message, mentions: MapMentions): Promise<void>;
