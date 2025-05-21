# Dwengo-5

Deployed at https://sel2-5.ugent.be/

# Installation Instructions

## Running the Entire Application

**Prerequisites:** Docker must already be installed on the system where you intend to run the application.

**Execution:** You can start the application using the following command:

```
docker compose -f docker-compose.yml up --build
```

This command starts everything and fills the database with sample data.

Access everything via [localhost](http://localhost) using an nginx container. If you already have an application running on this port, it's recommended to either disable it or modify [docker-compose.yml](./docker-compose.yml):

```yml
nginx:
    image: nginx:latest
    container_name: nginx
    ports:
        - "X:80" # modify this line, X is the port number you wish to use
    volumes:
        - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
        - backend
        - frontend
```

## Running Tests

Tests are executed using a script:

```sh
cd ./src/backend
./runAllTests.sh
```

> [!IMPORTANT]
> Ensure you are in the correct directory as relative file paths are used, which could lead to errors otherwise.

You can then select a test to execute, and the appropriate tests will run within a docker container.

## Architecture

We use a PostgreSQL database connected to an Express.js backend with ORM software Prisma. This backend is utilized by a Svelte frontend. API documentation can be found in the repository's wiki.

---

![image](doc/deployment.png)
![image](doc/databaseUML.png)
