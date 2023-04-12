import CustomError from './custom-error'

class BadGatewayError extends CustomError {
    constructor(message?: string) {
        super(message || 'Bad Gateway', 502);
    }
}

export default BadGatewayError
