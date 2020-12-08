#!/bin/bash
# Build js file for specific page or for all

if [ "$#" -eq 0 ] || [ "$1" = 'login' ]; then
  browserify ./js/pages/admin/login -p tinyify -o ./public/js/pages/admin/login.js
  echo 'Login JS file generated (./public/js/pages/admin/register.js).'
fi

if [ "$#" -eq 0 ] || [ "$1" = 'register' ]; then
  browserify ./js/pages/admin/register -p tinyify -o ./public/js/pages/admin/register.js
  echo 'Register JS file generated (./public/js/pages/admin/register.js).'
fi
