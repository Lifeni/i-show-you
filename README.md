<p align="center">
  <img width="150px" alt="Logo" src="logo.svg" />
</p>

<h1 align="center">I Show You</h1>
<p align="center">A self-hosted web application for data presentation and sharing</p>
<p align="center">English | <a href="README.zh-CN.md">中文</a></p>

## Introduction

- [x] 💻 Modern UI, based on IBM's Carbon design system.
- [x] 🚀 Self-hosted, use docker-compose to build your own application.
- [ ] 📱 Mobile friendly, responsive UI interface and PWA support.
- [ ] 🌐 Internationalization support, support Chinese, English and Emoji.
- [ ] // TODO

## Quick Start

It is recommended to use Docker Compose for deployment.

1. Download the `docker-compose.yml` file in the repo to your own machine. It is best to choose a separate folder, because the application configuration file will be stored in the `folder/configs/main.yml`.

2. Create a new `main.yml` file and place it in the `folder/configs/main.yml` with the following content.

    ```yml
    server:
      jwt-secret:
        file: golang
        admin: password
    
    admin:
      password: 1234
    ```

    For detailed configuration, please see [Configuration | I Show You](https://lifeni.github.io/i-show-you/config/) .

3. Execute the following command in the folder to start the container.

    ```shell
    docker-compose up -d
    ```

    The `-d` command stands for background execution, and you can view real-time output if you remove it.

> Note: The application exposes port 8080 by default. If there is a port conflict or you want to use your own MongoDB, you can modify the yml file yourself.

## Documentation

The documentation is being written. (Currently only available in Chinese)

See https://lifeni.github.io/i-show-you .

## Demo

The application is currently under development, and the data may be cleared at any time.

See https://i-show-you.dev.lifeni.life .

## Development Setup

// TODO

### Prerequisites

- Frontend: Node 14+, Yarn
- Backend: Go 1.15+, MongoDB

### Setting Up

#### Frontend

Enter the folder and install dependencies:

```shell script
cd webapp && yarn
```

Start the development server:

```shell script
yarn start
```

#### Docs

Enter the folder and install dependencies:

```shell script
cd docs && yarn
```

Start the development server:

```shell script
yarn docs:dev
```

## License

MIT License
