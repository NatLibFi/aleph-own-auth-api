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

import aleph_conf_parser

def parse(tab_file):
    filename = tab_file
    data = aleph_conf_parser.read_file(filename)
    config_values = aleph_conf_parser.drop_comments(data)
    block_headers = aleph_conf_parser.read_length(data)
    data_blocks = aleph_conf_parser.calculate_blocks(block_headers[1])

    return aleph_conf_parser.parse_all(data_blocks, config_values)

def transform(data):
    data_transformed = _stringsToDict(data)
    data_transformed = reduce(_listToDict, data_transformed, {})
    return reduce(_setsToLists, data_transformed.keys(), data_transformed)

def _stringsToDict(data):
    convertOwn = lambda l: map(lambda v: v.strip(), filter(lambda v: v, l))
    return map(lambda v: { 'user': v[0].strip(), 'own': convertOwn(v[1:]) }, data)

def _listToDict(acc, value):
    if value['user'] in acc:
        acc[value['user']].update(value['own'])
    else:
        acc[value['user']] = set(value['own'])

    return acc

def _setsToLists(acc, value):
    acc[value] = list(acc[value])
    return acc
