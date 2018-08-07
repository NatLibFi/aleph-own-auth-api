# HTTP API to fetch Aleph user's OWN authorization
HTTP API implemented Python for fetching [Aleph](https://knowledge.exlibrisgroup.com/Aleph) user's OWN authorization from tab_own file. Returns a JSON array of OWN-permissions that the user is authorized to.

**Depends on [aleph-conf-parser](https://github.com/NatLibFi/aleph-conf-parser)**

## Usage
1. See [apache-example.conf](apache-example.conf) for installation in Apache. Rewrite and CGI modulse must be enabled.
1. Install [aleph-conf-parser](https://github.com/NatLibFi/aleph-conf-parser) (The module name is aleph_conf_parser so the directory must be renamed)
### Environment variables
- **ALEPH\_URL**: URL of Aleph's Apache HTTP server
- **ALEPH\_USER\_LIBRARY**: User library to which users are authenticated against
- **TAB\_FILE**: Path to the tab_own file
### Example
```sh
curl -u $USERNAME:$PASSWORD https://some-aleph-instance/aleph-own-auth-api
```
## Development
1. Build the Docker image: `docker build . -t aleph-own-auth-api`
1. Setup environment variables in `env` file
1. Run `run-test-instance.sh`
## License and copyright

Copyright (c) **2018 University Of Helsinki (The National Library Of Finland)**

This project's source code is licensed under the terms of **GNU Affero General Public License Version 3** or any later version.
