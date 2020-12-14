#!/bin/bash
# Build js file for specific page or for all

if [ "$#" -eq 0 ] || [ "$1" = 'login' ]; then
#  browserify ./js/pages/admin/login --noparse="$PWD/js/common/materialize.min.js" -p tinyify -o ./public/js/pages/admin/login.js
#faster:
  { cat ./js/common/materialize.min.js; browserify ./js/pages/admin/login -p tinyify; } > ./public/js/pages/admin/login.js
  echo 'Login JS file generated (./public/js/pages/admin/login.js).'
fi

if [ "$#" -eq 0 ] || [ "$1" = 'register' ]; then
  { cat ./js/common/materialize.min.js; browserify ./js/pages/admin/register -p tinyify; } > ./public/js/pages/admin/register.js
  echo 'Register JS file generated (./public/js/pages/admin/register.js).'
fi
