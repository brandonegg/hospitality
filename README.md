# Hospitality

TODO: A brief description of the project

# Developer Environment

## Node

This project uses npm for package management, we recommend installing nvm for managing nodejs and npm versions. More details on how to install and setup nvm can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating)

## Docker

Docker is used to containerized our application so that you don't have to run multiple commands or install different requirements to get the application up and running. `Docker Compose` is used to run multiple images at the same time so that you don't need different terminal windows to run the `mySQL` server and the `NextJS` application.

**To Setup:**

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Create a copy of the file labeled _.env.example_ and rename it to _.env_
3. Fill in the necessary information for the _.env_ file
4. Run `npm run docker:build` to build the containers (you only have to do this once).
5. Run `npm run docker:up` to start the containers.

You can now use the `MySQL` credentials stored in the _.env_ file to connect the `MySQL` server using your favorite database management tool..

To stop the running containers, run `npm run docker:down` or press `CTRL-C`.

To remove remove volumes from docker-compose: docker-compose down -v

To run command inside a docker container: docker exec -it {CONTAINER_NAME} sh -c "{COMMAND}"

**Setting up MySQL database in Docker container:**

1. Add new connection
2. Enter connection name, e.g. Docker MySQL
3. Change the default port from 3306 to 3300
4. Enter the username (default to **root**) and password (from the .env you entered) for the database connection

Once connected, run the following commands to run migrations on your database:

```
docker exec -it nextjs sh -c "npx prisma migrate dev"
```

## Sonar

Sonar scans the repository to check for potential bugs, formatting issues, coverage, and much more. The sonar utility can be run using `npm run scan` which is just an alias for the `sonar-scanner` command. Sonar requires manual configuration to setup at this time.

**To Setup:**

1. Install the scanner cli from [here](https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/)
2. Add the bin directory from within the sonarscanner download to your local path.
3. Create a copy of the file labeled _sonar-project.example_ and rename it to _sonar-project.properties_
4. Add your login key to the sonar.login property

**Note:** The _sonar-project.properties_ example file is a just a template, you can change this to use any sonarQube/projectKey you'd like. If using the University of Iowa's provided URL you'll need to be using a [VPN](https://its.uiowa.edu/vpn) or on the schools network in order to use sonar-scanner.
