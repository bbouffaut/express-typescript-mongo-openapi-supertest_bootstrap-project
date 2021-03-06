#!/bin/bash
#
# Usage: run from project directory: ./scripts/open_swagger_ui.sh
# Description: run docker with openapi.yml & open browser with swagger ui
# Prerequirements: docker
#

. $(dirname "$0")/common.sh

# run swagger-ui container with the yaml, if not running yet
name='swagger-ui'
command -v docker >/dev/null 2>&1 || { echo >&2 "'docker' is not install installed. Aborting."; exit 1; }

if [[ $(docker ps -f "name=$name" --format '{{.Names}}') != $name ]]; then 
    echo "Create swagger-ui Docker Container"
    docker run --rm -d -p 8045:8080 --name "$name" -e SWAGGER_JSON=/config/openapi.yml -v $(pwd)/openapi-definitions:/config swaggerapi/swagger-ui
    wait_container_to_be_running "$name" & sleep 2
else
    echo "Restart existing Docker Container swagger-ui"
    docker restart "$name"
fi    

# open swagger-ui in browser
firefox --new-tab  http://localhost:8045