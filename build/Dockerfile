# Build Webapp
FROM node:lts-alpine as webapp
WORKDIR /web
COPY ./webapp .
RUN yarn && yarn build

# Build Server
FROM golang:alpine as server
WORKDIR /go/src/app
COPY ./server .
RUN go env -w GO111MODULE=on && go env -w GOPROXY=https://goproxy.io,direct && go install -v ./... && RUN go get -d -v ./...

FROM alpine:latest
WORKDIR /app
RUN apk update && apk --no-cache add ca-certificates && rm -rf /var/cache/apk/*
COPY --from=webapp /web/build ./public
COPY --from=server /go/bin/server .
COPY configs ./configs/

EXPOSE 8080

CMD ["/app/server"]