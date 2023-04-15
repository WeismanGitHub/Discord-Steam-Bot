import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../../errors';
import { config } from '../../../../config'
import jwt from 'jsonwebtoken'

function userAuth(req: Request, res: Response, next: NextFunction): void {
	if (!req.cookies.userID) {
		throw new UnauthorizedError("Please login.")
	}

	interface JwtPayload extends jwt.JwtPayload {
		userID?: string;
	}
	
	const idJWT: string | JwtPayload = jwt.verify(req.cookies.userID, config.jwtSecret!)

	if (!idJWT || typeof idJWT === 'string' || !idJWT.userID) {
		throw new UnauthorizedError("Please login.")
	}

	req.userID = idJWT.userID

	next()
}

export default userAuth