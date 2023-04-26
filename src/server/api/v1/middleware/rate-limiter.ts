import { NextFunction, Request, Response } from 'express';
// import { Config } from '../../../../config'

function rateLimiter(req: Request, res: Response, next: NextFunction): void {
	next()
}

export {
    rateLimiter
}