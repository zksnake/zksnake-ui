#!/bin/bash

# Exit if any subcommand fails
set -e

mkdir -p out

mkdir -p public/zk

cd circuits

zokrates compile --debug -i snake.zok

zokrates setup

zokrates export-verifier-scrypt -o ../contracts/verifier.scrypt

# mv output files to public folder
cp out abi.json verification.key proving.key ../public/zk/


cd ..

npx scryptlib ./contracts/snake.scrypt

cp ./out/snake_desc.json ./public/snake_debug_desc.json


