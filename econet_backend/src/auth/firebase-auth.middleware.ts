import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req['user'] = null;
            return next();
        }

        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req['user'] = {
                uid: decodedToken.uid,
                role: decodedToken.role,
            };
        } catch (error) {
            req['user'] = null;
        }

        return next();
    }
}
