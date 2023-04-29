# Hospitality

Building an open platform hospital management system for the University of Iowa!

# Developer Environment

## Node

This project uses npm for package management, we recommend installing nvm for managing nodejs and npm versions. More details on how to install and setup nvm can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating)


### NextJS
We recommend using the default NextJS development tools for running your site locally. A live site can be deployed with the following:
```bash
npm run dev
```

### Testing
Tests are run with Playwright (end-to-end) and JUnit (unit tests). Before running tests you'll need to install the required playwright browser dependencies:
```bash
npx playwright install --with-deps 
# Note: with-deps will cause an error on some Linux environments. This flag can be omitted but will prevent you from running Webkit tests.
# Webkit is not officially supported by playwright for most modern linux distributions at this time.
```

## Docker

For convenience we have provided a docker-compose.yml for setting up and configuring a MySQL server you can use with Prisma if you prefer a containerized solution.

**To Setup:**

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Create a copy of the file labeled _.env.example_ and rename it to _.env_
3. Fill in the necessary information for the _.env_ file (for MySQL you'll need to set MYSQL_DATABASE, and MYSQL_ROOT_PASSWORD)
4. Run `npm run docker:build` to build the containers (you only have to do this once).
5. Run `npm run docker:up` to start the containers.

You can now use the `MySQL` credentials stored in the _.env_ file to connect the `MySQL` server using your favorite database management tool..

To stop the running containers, run `npm run docker:down` or press `CTRL-C`.

To remove volumes from docker-compose: `docker-compose down -v`

To run command inside a docker container: `docker exec -it {CONTAINER_NAME} sh -c "{COMMAND}"`

**Setting up Prisma with MySQL:**

Ensure the DATABASE_URL variable is set in your environment. This is what Prisma will use to connect to your MySQL server.

Once connected, run the following commands to initialize the MySQL DB:
```bash
npx prisma db push
```
*Note:* Running this command will also generate the prisma type definition file. If the project displays various type errors related to the database models it may be necessary to run this or `npx prisma db push`

You can also seed your database with some sample data provided:
```bash
npx prisma db seed
```

## Sonar (deprecated)
*Sonar is an outdated method for maintaining quality code standards. It was implemented into this repository due to class requirements but is not recommend for an actual modern developer environment. We recommend following eslint and prettier rules defined in this project rather than depending on Sonar.*

Sonar scans the repository to check for potential bugs, formatting issues, coverage, and much more. The sonar utility can be run using `npm run scan` which is just an alias for the `sonar-scanner` command. Sonar requires manual configuration to setup at this time.

**To Setup:**

1. Install the scanner cli from [here](https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/)
2. Add the bin directory from within the sonarscanner download to your local path.
3. Create a copy of the file labeled _sonar-project.example_ and rename it to _sonar-project.properties_
4. Add your login key to the sonar.login property

**Note:** The _sonar-project.properties_ example file is a just a template, you can change this to use any sonarQube/projectKey you'd like. If using the University of Iowa's provided URL you'll need to be using a [VPN](https://its.uiowa.edu/vpn) or on the schools network in order to use sonar-scanner.
