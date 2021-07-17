FROM node:16-alpine as development
WORKDIR /tmp/app
COPY . .
RUN apk --no-cache add make python3 build-base
RUN make build

FROM alpine:latest
LABEL maintainer="Yann Prono"
RUN apk --no-cache add thttpd
WORKDIR /var/www/http
COPY --from=development /tmp/app/_site/ ./
EXPOSE 80
ENTRYPOINT ["/usr/sbin/thttpd"]
CMD ["-l", "/dev/stderr", "-d", "/var/www/http", "-D"]
