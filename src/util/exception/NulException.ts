
const enum NulExceptionConstants {
    NETWORK_ERROR = -1,
    OK = 0,
    INVALID_TOKEN = 1,
    INTERNAL_SERVER_ERROR = 500,

}

class NulException extends Error {
    readonly code: NulExceptionConstants;

    constructor(code: NulExceptionConstants, message: string) {
        super(message);
        this.code = code;
    }
}

export { NulExceptionConstants, NulException };