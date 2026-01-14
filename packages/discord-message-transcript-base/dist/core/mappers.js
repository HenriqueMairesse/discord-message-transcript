import { ReturnType, ReturnTypeBase } from "../types/types.js";
import { CustomError } from "./error.js";
export function returnTypeMapper(type) {
    switch (type) {
        case ReturnType.Buffer:
            return ReturnTypeBase.Buffer;
        case ReturnType.Stream:
            return ReturnTypeBase.Stream;
        case ReturnType.String:
            return ReturnTypeBase.String;
        case ReturnType.Uploadable:
            return ReturnTypeBase.Uploadable;
        default:
            throw new CustomError(`Can't convert ReturnType.Attachment to ReturnTypeBase!`);
    }
}
