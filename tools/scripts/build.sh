#! /usr/bin/env bash

source "$PWD/tools/scripts/env"

export NODE_ENV=${NODE_ENV:-production}

"$GULP" build
