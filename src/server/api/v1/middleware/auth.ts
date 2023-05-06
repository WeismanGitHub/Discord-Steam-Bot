import { ForbiddenError, UnauthorizedError } from '../../../errors';
import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../../../db/models';
import { Config } from '../../../../config'
import jwt from 'jsonwebtoken'

function userAuth(req: Request, res: Response, next: NextFunction): void {
	if (!req.cookies.userID) {
		throw new UnauthorizedError("Please login.")
	}

	interface JwtPayload extends jwt.JwtPayload {
		userID?: string;
	}
	
	const idJWT: string | JwtPayload = jwt.verify(req.cookies.userID, Config.jwtSecret!)

	if (!idJWT || typeof idJWT === 'string' || !idJWT.userID) {
		throw new UnauthorizedError("Please login.")
	}

	req.userID = idJWT.userID

	next()
}

async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!req.cookies.userID) {
		throw new UnauthorizedError("Please login.")
	}

	interface JwtPayload extends jwt.JwtPayload {
		userID?: string;
	}
	
	const idJWT: string | JwtPayload = jwt.verify(req.cookies.userID, Config.jwtSecret!)

	if (!idJWT || typeof idJWT === 'string' || !idJWT.userID) {
		throw new UnauthorizedError("Please login.")
	}

	const user = await UserModel.findById(idJWT.userID).lean()

	if (!user || !['owner', 'admin'].includes(user.type)) {
		throw new ForbiddenError('You are not an admin or owner.')
	}

	req.user = user
	req.userID = user._id

	next()
}

async function ownerAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!req.cookies.userID) {
		throw new UnauthorizedError("Please login.")
	}

	interface JwtPayload extends jwt.JwtPayload {
		userID?: string;
	}
	
	const idJWT: string | JwtPayload = jwt.verify(req.cookies.userID, Config.jwtSecret!)

	if (!idJWT || typeof idJWT === 'string' || !idJWT.userID) {
		throw new UnauthorizedError("Please login.")
	}

	const user = await UserModel.findById(idJWT.userID).lean()

	if (!user || user.type !== 'owner') {
		throw new ForbiddenError('You are not an owner.')
	}

	req.user = user
	req.userID = user._id
	
	next()
}

export {
    userAuth,
    adminAuth,
    ownerAuth,
}