FROM httpd:alpine
ENTRYPOINT ["/entrypoint.sh"]
CMD ["httpd-foreground"]

COPY entrypoint.sh /

RUN apk add -U --no-cache python2 \
  && rm -rf /tmp/* /var/tmp/*
