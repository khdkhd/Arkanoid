#! /usr/bin/env bash

source "$PWD/tools/scripts/env"

export NODE_ENV=development

"$GULP" watch
