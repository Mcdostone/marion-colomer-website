FROM ruby:alpine as development
WORKDIR /tmp/app
COPY . .
RUN apk --no-cache add make build-base
RUN gem install bundler
RUN make build


FROM alpine:latest
LABEL maintainer="Yann Prono"
RUN apk --no-cache add thttpd
WORKDIR /var/www/http
COPY --from=development /tmp/app/_site/ ./
EXPOSE 80
ENTRYPOINT ["/usr/sbin/thttpd"]
CMD ["-D",  "-l", "/dev/stderr", "-d", "/var/www/http"]
