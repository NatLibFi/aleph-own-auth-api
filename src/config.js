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

import {randomBytes} from 'crypto';
import {readEnvironmentVariable} from '@natlibfi/melinda-backend-commons';
import {parseBoolean} from '@natlibfi/melinda-commons';

export const httpPort = readEnvironmentVariable('HTTP_PORT', {defaultValue: '8080'});
export const enableAuth = readEnvironmentVariable('ENABLE_AUTH', {defaultValue: true, format: parseBoolean});
export const enableProxy = readEnvironmentVariable('ENABLE_PROXY', {defaultValue: false, format: parseBoolean});
export const jwtKey = readEnvironmentVariable('JWT_KEY', {defaultValue: randomBytes(32).toString('hex')});
export const maxLinesTabFile = readEnvironmentVariable('MAX_LINES_TAB_FILE', {defaultValue: 5000, format: v => Number(v)});

export const tabFile = readEnvironmentVariable('TAB_FILE');
