import { ForbiddenError, UnauthorizedError } from '../../../errors';
import { NextFunction, Request, Response } from 'express';
import { Config } from '../../../../config'
import jwt from 'jsonwebtoken'

function userAuth(req: Request, res: Response, next: NextFunction): void {
	if (!req.cookies.user) {
		throw new UnauthorizedError("Please login.")
	}

	interface JwtPayload extends jwt.JwtPayload {
		userID?: string;
		type?: 'banned' | 'user' | 'admin' | 'owner'
	}
	
	const userJWT: string | JwtPayload = jwt.verify(req.cookies.user, Config.jwtSecret!)

	if (!userJWT || typeof userJWT === 'string' || !userJWT.userID || !userJWT.type) {
		throw new UnauthorizedError("Please login.")
	}

	req.user = {
		_id: userJWT.userID,
		type: userJWT.type
	}

	next()
}

async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!req.cookies.user) {
		throw new UnauthorizedError("Please login.")
	}

	interface JwtPayload extends jwt.JwtPayload {
		_id?: string;
		type?: 'banned' | 'user' | 'admin' | 'owner'
	}
	
	const userJWT: string | JwtPayload = jwt.verify(req.cookies.user, Config.jwtSecret!)

	if (!userJWT || typeof userJWT === 'string' || !userJWT.userID || !userJWT.type) {
		throw new UnauthorizedError("Please login.")
	}

	if (!['owner', 'admin'].includes(userJWT.type)) {
		throw new ForbiddenError('You are not an admin or owner.')
	}

	req.user = {
		_id: userJWT.userID,
		type: userJWT.type
	}

	next()
}

async function ownerAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!req.cookies.user) {
		throw new UnauthorizedError("Please login.")
	}

	interface JwtPayload extends jwt.JwtPayload {
		_id?: string;
		type?: 'banned' | 'user' | 'admin' | 'owner'
	}
	
	const userJWT: string | JwtPayload = jwt.verify(req.cookies.user, Config.jwtSecret!)

	if (!userJWT || typeof userJWT === 'string' || !userJWT.userID || !userJWT.type) {
		throw new UnauthorizedError("Please login.")
	}

	if (!['owner', 'admin'].includes(userJWT.type)) {
		throw new ForbiddenError('You are not an admin or owner.')
	}

	req.user = {
		_id: userJWT.userID,
		type: userJWT.type
	}
	
	if (userJWT.type !== 'owner') {
		throw new ForbiddenError('You are not an owner.')
	}
	
	next()
}

export {
    userAuth,
    adminAuth,
    ownerAuth,
}