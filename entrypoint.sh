#!/bin/sh

while :
do
  pnpm start || true

  echo "Waiting..."

  # wait 10 minutes
  sleep 600
done