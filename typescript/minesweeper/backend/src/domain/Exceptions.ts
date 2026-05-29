export class OperationNotSupportedException extends Error {
    constructor(message?: string) {
        super(message || "This operation is not supported.");
        this.name = "OperationNotSupportedException";
    }
}