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

import {Error as ApiError} from '@natlibfi/melinda-commons';
import HttpStatus from 'http-status';
import {createReadStream} from 'fs';
import {createInterface as createReadlineInterface} from 'readline';

export function validateRequest(req) {
  // Make sure that the username is Aleph compliant. Otherwise it cannot be valid
  if ((/^\w+$/u).test(req.params.id) === false || req.params.id.length > 10) { // eslint-disable-line functional/no-conditional-statement
    throw new ApiError(HttpStatus.NOT_FOUND);
  }

  if (req.method === 'POST') {
    if (Array.isArray(req.body) === false) { // eslint-disable-line functional/no-conditional-statement
      throw new ApiError(HttpStatus.BAD_REQUEST);
    }

    // Tags are also limited to 10 chars
    if (req.body.some(tag => tag.length > 10)) { // eslint-disable-line functional/no-conditional-statement
      throw new ApiError(HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}

export function getLines(file, username) {
  return new Promise(resolve => {
    const lines = [];
    const readline = createReadlineInterface({input: createReadStream(file)});
    const handleLine = generateHandleLine();

    readline.
      on('line', handleLine).
      on('close', () => resolve(lines));

    function generateHandleLine() {
      if (username) {
        const pattern = new RegExp(`^${username} `, 'u');

        return line => {
          if ((/^!/u).test(line) || pattern.test(line) === false) {
            return;
          }

          lines.push(line); // eslint-disable-line functional/immutable-data
        };
      }

      return line => lines.push(line); // eslint-disable-line functional/immutable-data
    }
  });
}

export function parseLines(username, lines) {
  const tags = lines.map(toTags).flat();

  // Remove duplicate values
  return tags.reduce((acc, v) => acc.includes(v) ? acc : acc.concat(v), []);

  function toTags(line) {
    return line.
      replace(new RegExp(`^${username}`, 'u'), '').
      trim().
      split(/\s+/u);
  }
}
