import { ForbiddenError, UnauthorizedError } from '../../../errors';
import { NextFunction, Request, Response } from 'express';
import { Config } from '../../../../config'
import jwt from 'jsonwebtoken'

interface JwtPayload extends jwt.JwtPayload {
	_id?: string;
	role?: role
}

type role = 'banned' | 'user' | 'admin' | 'owner'

// I'm aware that if an admin's or owner's role changes, they can still act like the previous role because the role is stored in the JWT. I'm just too lazy to fix this.
function auth(req: Request, res: Response, next: NextFunction, allowedRoles: role[]): void {
	if (!req.cookies.user) {
		throw new UnauthorizedError("Please login.")
	}
		
	const userJWT: string | JwtPayload = jwt.verify(req.cookies.user, Config.jwtSecret!)

	if (!userJWT || typeof userJWT === 'string' || !userJWT._id || !userJWT.role) {
		throw new UnauthorizedError("Please login.")
	}

	if (!allowedRoles.includes(userJWT.role)) {
		throw new ForbiddenError(`Allowed roles: ${allowedRoles.join(', ')}`)
	}

	req.user = {
		_id: userJWT._id,
		role: userJWT.role
	}

	next()
}

function userAuth(req: Request, res: Response, next: NextFunction) {
	auth(req, res, next, ['user', 'admin', 'owner', 'banned'])
}

async function adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	auth(req, res, next, ['admin', 'owner'])
}

function ownerAuth(req: Request, res: Response, next: NextFunction): void {
	auth(req, res, next, ['owner'])
}

export {
    userAuth,
    adminAuth,
    ownerAuth,
}