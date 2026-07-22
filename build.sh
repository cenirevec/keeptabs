#!/bin/bash

# WebExtension archive generator
# Cleaning repertory
rm -rf package
mkdir -p ./builds/archives/{dist,src}

mkdir -p ./package/src
cp -r ./ ./package/src
cd ./package/src

# Making 
version=`cat manifest.json | grep -E "\"version\"" | awk '{print $2}' | sed -e 's/[",]//g'`

rm -r perso
rm -r builds

mv ./dist ../dist

mv ./public/media/ico-std.png ./public/media/ico.png
# rm ./manifest3.json
rm ./build.sh


zip -rqu ../../builds/archives/src/keeptabs-$version-src.zip *
cp ../../builds/archives/src/keeptabs-$version-src.zip ../../builds/keeptabs-lastest-src.zip

cd ../dist
mv ./media/ico-std.png ./media/ico.png

# Voila

zip -rqu ../../builds/archives/dist/keeptabs-$version.zip *
cp ../../builds/archives/dist/keeptabs-$version.zip ../../builds/keeptabs-lastest.zip

cd ../../
rm -rf package

