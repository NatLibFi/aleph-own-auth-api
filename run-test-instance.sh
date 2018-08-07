#!/bin/sh
docker run \
  --disable-content-trust \
  --rm \
  --env-file=$PWD/env \
  -v "$PWD/apache-example.conf":/usr/local/apache2/conf.d/aleph-own-auth-api.conf:ro \
  -v "$PWD":/usr/local/apache2/htdocs/aleph-own-auth-api:ro \
  -p 8080:80 \
  aleph-own-auth-api
