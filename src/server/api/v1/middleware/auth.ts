import { ForbiddenError, UnauthorizedError } from '../../../errors';
import { NextFunction, Request, Response } from 'express';
import { Config } from '../../../../config'
import jwt from 'jsonwebtoken'

interface JwtPayload extends jwt.JwtPayload {
	_id?: string;
	role?: 'banned' | 'user' | 'admin' | 'owner'
}

function userAuth(req: Request, res: Response, next: NextFunction): void {
	if (!req.cookies.user) {
		throw new UnauthorizedError("Please login.")
	}
	
	const userJWT: string | JwtPayload = jwt.verify(req.cookies.user, Config.jwtSecret!)

	if (!userJWT || typeof userJWT === 'string' || !userJWT._id || !userJWT.role) {
		throw new UnauthorizedError("Please login.")
	}

	req.user = {
		_id: userJWT._id,
		role: userJWT.role
	}

	next()
}

async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!req.cookies.user) {
		throw new UnauthorizedError("Please login.")
	}
	
	const userJWT: string | JwtPayload = jwt.verify(req.cookies.user, Config.jwtSecret!)

	if (!userJWT || typeof userJWT === 'string' || !userJWT._id || !userJWT.role) {
		throw new UnauthorizedError("Please login.")
	}

	if (!['owner', 'admin'].includes(userJWT.role)) {
		throw new ForbiddenError('You are not an admin or owner.')
	}

	req.user = {
		_id: userJWT._id,
		role: userJWT.role
	}

	next()
}

async function ownerAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!req.cookies.user) {
		throw new UnauthorizedError("Please login.")
	}
	
	const userJWT: string | JwtPayload = jwt.verify(req.cookies.user, Config.jwtSecret!)

	if (!userJWT || typeof userJWT === 'string' || !userJWT._id || !userJWT.role) {
		throw new UnauthorizedError("Please login.")
	}

	if (!['owner', 'admin'].includes(userJWT.role)) {
		throw new ForbiddenError('You are not an admin or owner.')
	}

	req.user = {
		_id: userJWT._id,
		role: userJWT.role
	}
	
	if (userJWT.role !== 'owner') {
		throw new ForbiddenError('You are not an owner.')
	}
	
	next()
}

export {
    userAuth,
    adminAuth,
    ownerAuth,
}