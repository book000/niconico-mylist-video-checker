#!/bin/sh

while :
do
  node index.js || true

  echo "Waiting..."

  # wait 10 minutes
  sleep 600
done