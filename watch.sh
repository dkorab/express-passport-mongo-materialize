#!/bin/bash
# Watch js file for changes

if [ "$1" = 'login' ]; then
  watchify ./js/pages/admin/login -o ./public/js/pages/admin/login.js --debug --verbose
fi

if [ "$1" = 'register' ]; then
  watchify ./js/pages/admin/register -o ./public/js/pages/admin/register.js --debug --verbose
fi

if [ "$1" = 'index' ]; then
  watchify ./js/pages/admin/index -o ./public/js/pages/admin/index.js --debug --verbose
fi