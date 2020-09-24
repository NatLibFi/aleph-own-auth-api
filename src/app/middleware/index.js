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
* License, or (at your option) any later version.
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

import {Router as createRouter} from 'express';
import contentTypeFactory from '@natlibfi/express-validate-content-type';
import {json as jsonFactory} from 'body-parser';
import readFactory from './read';
import addFactory from './add';

export default params => {
  const router = createRouter();
  const readMiddleware = readFactory(params);
  const addMiddleware = addFactory(params);
  const contentTypeMiddleware = contentTypeFactory({type: 'application/json'});
  const jsonMiddleware = jsonFactory();

  router.get('/:id', readMiddleware);
  router.post('/:id', contentTypeMiddleware, jsonMiddleware, addMiddleware);

  return router;
};
