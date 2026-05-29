# Constants

COLOR_BLUE=\033[0;34m
COLOR_NONE=\033[0m

H2_JAR=h2-2.1.214.jar
H2_JAR_URL=https://repo1.maven.org/maven2/com/h2database/h2/2.1.214/h2-2.1.214.jar

RUN_H2_SCRIPT=java -cp $(H2_JAR) org.h2.tools.RunScript

DATABASE_URL="jdbc:h2:file:./database/pokemon;IGNORECASE=TRUE"
DB_CREATE_SCRIPT="./create-database.sql"

# Targets

help:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "$(COLOR_BLUE)%s|$(COLOR_NONE)%s\n", $$1, $$2}' \
		| column -t -s '|'

.PHONY: clean
clean: ## Remove all built artefacts
	@echo 'Removing database files'
	@rm -rf database
	@echo 'Removing driver'
	@rm -f $(H2_JAR)

$(H2_JAR):
	@echo 'Downloading driver'
	@curl -s $(H2_JAR_URL) -o $(H2_JAR)

download-driver: $(H2_JAR)

.PHONY: create-database
create-database: download-driver ## Create the database
	@echo 'Removing database files'
	@rm -f database/*.db
	@echo "Executing ${DB_CREATE_SCRIPT}"
	@${RUN_H2_SCRIPT} -url ${DATABASE_URL} -user root -script "${DB_CREATE_SCRIPT}"
	@echo "Script complete"
