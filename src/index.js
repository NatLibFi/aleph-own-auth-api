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

/* eslint-disable no-console, no-process-exit */

import startApp from './app';
import * as config from './config';

run();

async function run() {
  registerInterruptionHandlers();

  const server = await startApp(config, handleUnexpectedAppError);

  function handleUnexpectedAppError(message) {
    handleTermination({code: 1, message});
  }

  function registerInterruptionHandlers() {
    process.on('SIGTERM', handleSignal);
    process.on('SIGINT', handleSignal);

    process.on('uncaughtException', ({stack}) => {
      handleTermination({code: 1, message: stack});
    });

    process.on('unhandledRejection', ({stack}) => {
      handleTermination({code: 1, message: stack});
    });

    function handleSignal(signal) {
      handleTermination({code: 1, message: `Received ${signal}`});
    }
  }

  function handleTermination({code = 0, message}) {
    if (message) { // eslint-disable-line functional/no-conditional-statement
      console.error(message);
      server.close();
      process.exit(code);
    }

    server.close();
    process.exit(code);
  }
}
