import { TooManyRequestsError } from '../../../errors';
import { Config } from '../../../../config';
import rateLimit from 'express-rate-limit';
import fetchMetadata from 'fetch-metadata';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression'
require('express-async-errors')
import helmet from 'helmet'
import cors from 'cors'

import { adminAuth, ownerAuth, userAuth } from '../middleware/auth';
import ticketRouter from './ticket';
import adminRouter from './admin';
import ownerRouter from './owner';
import authRouter from './auth';
import userRouter from './user';

const v1Router: Router = Router();

const limiter = rateLimit({
    windowMs: Config.limiterWindowMs,
	max: Config.limiterMax,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res, next, options) => { throw new TooManyRequestsError(Config.limiterMessage) }
})

v1Router.use(helmet({
	contentSecurityPolicy: {
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			"img-src": ["'self'"],
			'media-src': ["'self'"],
			"default-src": ["'self'"]
		},
	}
}))

v1Router.use(fetchMetadata({
	allowedFetchSites: ['same-origin', 'same-site', 'none'],
	disallowedNavigationRequests: ['frame', 'iframe'],
	errorStatusCode: 403,
	allowedPaths: [],
	onError: (req, res, next, options) => {
		res.statusCode = options.errorStatusCode
		res.end()
	}
}))

v1Router.use(limiter)
v1Router.use(compression())
v1Router.use(cors({ origin: [`http://localhost:${Config.appPort}`] }))
v1Router.use(express.urlencoded({ extended: true }))
v1Router.use(express.json())
v1Router.use(cookieParser())

v1Router.use('/admin', adminAuth, adminRouter)
v1Router.use('/owner', ownerAuth, ownerRouter)
v1Router.use('/user', userAuth, userRouter)
v1Router.use('/tickets', ticketRouter)
v1Router.use('/auth', authRouter)

export { v1Router }