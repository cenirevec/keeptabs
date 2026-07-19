#!/bin/bash

# WebExtension archive generator

cp -r ./ ./package/src
cd ./package/src

# Making 
version=`cat manifest.json | egrep "\"version\"" | awk '{print $2}' | sed -e 's/[",]//g'`

rm -r perso
rm -r builds

mv ./dist ../dist

mv ./public/media/ico-std.png ./public/media/ico.png
rm ./manifest3.json
rm ./build.sh


zip -r ../../builds/keeptabs-$version-src.zip *

cd ../dist

# Voila

zip -r ../../builds/keeptabs-$version.zip *

# rm -r package

