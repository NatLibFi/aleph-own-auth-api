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
import re
import sys
import json
from base64 import b64decode
from module import *

PARAMETERS = ['username']
API_KEYS = re.split(',', os.getenv('API_KEYS'))

def main():
    try:
        authenticate()
        params = parse_params()

        for param in PARAMETERS:
            if param not in params:
                error(400, 'Parameter {} is missing'.format(param))

        tags = get_tags(params['username'])

        print 'Content-Type: application/json'
        print
        print json.dumps(tags)
    except Exception as err:
        print >> sys.stderr, err
        error(500)

def authenticate():
    if 'HTTP_AUTHORIZATION' in os.environ and os.getenv('HTTP_AUTHORIZATION'):
        encoded = re.sub('^Basic ', '', os.getenv('HTTP_AUTHORIZATION'))
        api_key = re.split(':', b64decode(encoded))[0]

        if (api_key not in API_KEYS):
            error(401)
    else:
        error(401)

def parse_params():
  params = {}

  if os.getenv('QUERY_STRING'):
    str = os.getenv('QUERY_STRING').split('?')[0]

    for param in str.split('&'):
      [key, value] = param.split('=')
      params[key] = value

  return params

def get_tags(username):
    data = parse(os.environ['TAB_FILE'])
    data = transform(data)
    lows = data[username.upper()] if username.upper() in data else ()
    return lows

def error(code, message=''):
  print 'Status: {}'.format(str(code))

  if message:
    print 'Content-Type: text/plain'
    print
    print message
  else:
    print

  sys.exit()

if __name__ == '__main__':
    main()
