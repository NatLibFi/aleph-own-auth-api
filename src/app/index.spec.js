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

import generateTests from '@natlibfi/fixugen-http-server';
import fsMock from 'mock-fs';
import startApp from '.';

generateTests({
  callback,
  mocha: {
    afterEach: () => fsMock.restore()
  },
  path: [__dirname, '..', '..', 'test-fixtures', 'app']
});

function callback({appParams = {}, tabFileContents}) {
  if (tabFileContents) {
    fsMock({
      '/foo': tabFileContents
    });

    return startApp(generateAppParams(), () => {}); // eslint-disable-line no-empty-function
  }

  return startApp(generateAppParams(), () => {}); // eslint-disable-line no-empty-function

  function generateAppParams() {
    return {
      ...appParams,
      tabFile: '/foo',
      jwtKey: '8201ff50eaa0f55943f008e54d69cf2b9f627b12b370a4d0437713018afaef27',
      enableAuth: true
    };
  }
}
