class ApiError extends Error{
    constructor(status , message = "Something went wrong"){
        super(message);
        this.statusCode = this.statusCode;
        this.success = false;
        this.errors = this.errors;

        Error.captureStackTrace(this, this.constructor);

    }
}

export default ApiError;

