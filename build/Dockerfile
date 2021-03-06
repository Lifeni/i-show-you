# Build Web
FROM node:lts-alpine as web
WORKDIR /web
COPY ./web .
RUN yarn && yarn build

# Build Server
FROM golang:alpine as server
WORKDIR /go/src/app
COPY ./server .
RUN go install -v ./... && go get -d -v ./...

FROM alpine:latest
WORKDIR /app
COPY --from=web /web/build ./public
COPY --from=server /go/bin/server .
COPY ./configs/main.yml ./configs/
RUN apk update && apk --no-cache add ca-certificates && rm -rf /var/cache/apk/*

EXPOSE 8080

CMD ["/app/server"]