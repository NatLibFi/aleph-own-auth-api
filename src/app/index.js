/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* HTTP API to manage Aleph users' OWN authorizations
*
* Copyright (C) 2018-2020 University Of Helsinki (The National Library Of Finland)
*
* This file is part of aleph-own-auth-api
*
* aleph-own-auth-api program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version        .
*
* aleph-own-auth-api is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/

import express from 'express';
import passport from 'passport';
import helmetFactory from 'helmet';
import {Strategy as JwtStrategy, ExtractJwt as jwtExtractors} from 'passport-jwt';
import HttpStatus from 'http-status';
import {createLogger, createExpressLogger} from '@natlibfi/melinda-backend-commons';
import createMiddleware from './middleware';

export default ({httpPort, enableAuth, enableProxy, jwtKey, ...middlewareParams}, exitCallback) => {
  const logger = createLogger();
  const app = initExpress();

  return app.listen(httpPort, () => logger.log('info', 'Started Aleph OWN auth API'));

  function initExpress() {
    const app = express();
    const authMiddleware = initPassportStrategy();

    app.enable('trust proxy', enableProxy);

    app.use(createExpressLogger({
      msg: (req, res) => {
        if (req.user && req.user.id) {
          return `${req.ip} ${req.user.id} HTTP ${req.method} ${req.url} - ${res.statusCode} ${res.responseTime}ms`;
        }

        return `${req.ip} HTTP ${req.method} ${req.url} - ${res.statusCode} ${res.responseTime}ms`;
      }
    }));

    app.use(passport.initialize());
    app.use(helmetFactory());

    if (enableAuth) {
      app.use(authMiddleware, createMiddleware(middlewareParams));
      app.use(handleError);
      return app;
    }

    app.use(createMiddleware(middlewareParams));
    app.use(handleError);

    return app;

    function initPassportStrategy() {
      const strategy = new JwtStrategy({
        algorithms: ['HS256'],
        secretOrKey: jwtKey,
        ignoreExpiration: true,
        jwtFromRequest: jwtExtractors.fromAuthHeaderAsBearerToken()
      }, cb);

      passport.use(strategy);

      return passport.authenticate('jwt', {session: false});

      function cb(payload, done) {
        return done(undefined, payload);
      }
    }
  }

  function handleError(err, _, res, next) {
    /* istanbul ignore if: Not sure when this is encountered but attempting to send headers again will crash Express */
    if (res.headersSent) {
      return next(err);
    }

    if ('status' in err) {
      res.sendStatus(err.status);
      return next();
    }

    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    exitCallback(err.stack);
  }
};
