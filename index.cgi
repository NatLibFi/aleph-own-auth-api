#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
*
* The following is the entire license notice for the Python code in this file.
*
* HTTP API to fetch Aleph user's OWN authorization
*
* Copyright (C) 2018 University Of Helsinki (The National Library Of Finland)
*
* aleph-own-auth-api is free software: you can redistribute it and/or modify
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
* The above is the entire license notice
* for the Python code in this file.
*
'''
import cgi
import os
import sys
import json
from module import *

try:
    if 'HTTP_AUTHORIZATION' in os.environ and len(os.environ['HTTP_AUTHORIZATION']) > 1:
        username, password = get_credentials(os.environ['HTTP_AUTHORIZATION'])

        if not validate_user(username, password):
            print 'Status: 403'
            print
        else:
            data = parse(os.environ['TAB_FILE'])
            data = transform(data)

            lows = data[username.upper()] if username.upper() in data else ()

            print 'Content-Type: application/json'
            print
            print json.dumps(lows)
    else:
        print 'Status: 401'
        print
except Exception as err:
    print >> sys.stderr, err
