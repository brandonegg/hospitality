# Hospitality

TODO: A brief description of the project

# Developer Environment

## Node
This project uses npm for package management, we recommend installing nvm for managing nodejs and npm versions. More details on how to install and setup nvm can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating)

## Sonar
Sonar scans the repository to check for potential bugs, formatting issues, coverage, and much more. The sonar utility can be run using `npm run scan` which is just an alias for the `sonar-scanner` command. Sonar requires manual configuration to setup at this time.

**To Setup:**
1. Install the scanner cli from [here](https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/)
2. Add the bin directory from within the sonarscanner download to your local path.
3. Create a copy of the file labeled *sonar-project.example* and rename it to *sonar-project.properties*
4. Add your login key to the sonar.login property

**Note:** The *sonar-project.properties* example file is a just a template, you can change this to use any sonarQube/projectKey you'd like. If using the University of Iowa's provided URL you'll need to be using a [VPN](https://its.uiowa.edu/vpn) or on the schools network in order to use sonar-scanner.