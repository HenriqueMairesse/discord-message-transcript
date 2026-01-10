import { JsonData } from "../../types/types";
export declare class Html {
    data: JsonData;
    constructor(data: JsonData);
    private headerBuilder;
    toHTML(): string;
    private svgBuilder;
}
