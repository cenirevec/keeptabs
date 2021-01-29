emcc $1.c -s WASM=1 -o $1.html -s LINKABLE=1 -s EXPORT_ALL=1
rm $1.html


#Write the lines necessary to execute