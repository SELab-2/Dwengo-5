# Use of Docker

## Important commands

### Automatic tests

The command below is used to run the automatic tests with our Github runner.
If you want to check if your tests succeed it is advised to use the same command.

The command ensures that the container stops after executing the tests and returns the same exit code as the tests.
To check whether or not your tests succeeded you can execute `echo $?` afterwards and observe the exit code.

```
docker compose -f automatic-tests-docker-compose.yml up --abort-on-container-exit --exit-code-from backend --build
```

**There aren't any frontend tests yet, so these can not be executed**


### Frontend development


The command below executes several docker containers: the database, the API, the frontend and an Nginx instance.

It supports hot-reloading for the frontend, which means that any changes to files are immediately reflected in the frontend.

Thanks to Nginx, both the API and the frontend can be reached through [http://localhost](http://localhost). 
They are also reachable through separate URLs, [http://localhost:2197](http://localhost:2197) and [http://localhost:5173](http://localhost:5173) for the API and frontend respectively.
Nginx routes your requests based on content negotiation, all requests for `Application/json` are sent to the API. So the necessary headers are required for the API.

```
docker compose -f docker-compose.yml up
```

### Starting

```sh
docker compose -f <filename> up --build
```

This command builds and starts all docker containers in the specified file.
The flag `-f` can be removed to use the standard `docker-compose.yml` file.

### Closing

By pressing `CTRL + C` the Docker containers are automatically stopped.
To remove them, you can use the command below.

```sh
docker compose down -v
```

### Debugging

To list all active containers you can use:

```sh
docker ps
```

It is possible to execute commands inside a container.
To open a shell inside one of the containers, you can use the command below.


docker exec -it <containername> sh
```

## Changes

By removing the `--build` option Docker can reuse images that it generates and the usage of memory is less than beforehand.
