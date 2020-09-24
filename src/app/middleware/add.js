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

import {appendFileSync} from 'fs';
import {createLogger} from '@natlibfi/melinda-backend-commons';
import {validateRequest, getLines, parseLines} from './common';
import httpStatus from 'http-status';

export default ({tabFile, maxLinesTabFile}) => async (req, res, next) => {
  try {
    const logger = createLogger();

    validateRequest(req);

    const username = req.params.id.toUpperCase();
    const newTags = await generateNewTags(username);
    const newLines = generateNewLines(username, newTags);

    await checkLimit(newTags, newLines);

    if (newLines.length > 0) {
      await writeLines(newLines);
      logger.log('info', `Client ${req.user.id} wrote ${newLines.length} new lines`);
      return res.sendStatus(httpStatus.NO_CONTENT);
    }

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (err) {
    return next(err);
  }

  async function generateNewTags(username) {
    const lines = await getLines(tabFile, username);
    const existingTags = parseLines(username, lines);

    return req.body.
      map(v => v.toUpperCase())
      .reduce((a, v) => a.includes(v) ? a : a.concat(v), [])
      .filter(tag => existingTags.includes(tag) === false);
  }

  function generateNewLines(username, tags) {
    return tags.
      reduce(toArray, []).
      map(toString);

    // Need nested arrays for concat not to flatten
    function toArray(acc, tag) {
      const [lastElement] = acc.slice(-1);

      if (lastElement) {
        if (lastElement.length === 5) {
          return acc.concat([[tag]]);
        }

        const start = acc.slice(0, -1);
        const end = [lastElement.concat(tag)];

        return start.concat(end);
      }

      return [[tag]];
    }

    function toString(list) {
      return [username].concat(list).
        map(str => str.padEnd(10, ' ')).
        join(' ');
    }
  }

  async function checkLimit(newLines) {
    const currentLinesCount = (await getLines(tabFile)).length;

    if (newLines.length + currentLinesCount > maxLinesTabFile) { // eslint-disable-line functional/no-conditional-statement
      throw new Error(`Maximum line count ${maxLinesTabFile} in tab own file reached or will be reached (${newLines.length} lines would've been added)`); // eslint-disable-line functional/no-conditional-statement
    }
  }

  function writeLines(lines) {
    const str = lines.join('\n').trimRight();
    appendFileSync(tabFile, str);
  }
};
