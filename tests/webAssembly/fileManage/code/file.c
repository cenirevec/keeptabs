#include <stdio.h>
#include <stdlib.h>
//Moins fréquent
#include <string.h>
#include <emscripten/emscripten.h>

#define NB_ARG 1


int main(int argc, char **argv){
	//Vérifier la validité des arguments
	if(argc < NB_ARG){
		printf("E: Trop peu d'arguments\nUsage %s: <argument1>\n",argv[0]);
		exit(1);
	}else{
		//Lecture des arguments
		/*code*/
	}
}


char* EMSCRIPTEN_KEEPALIVE version(){
	return "0.0.1";
}

char* read_file_content(char* filename){
	FILE* file = fopen(filename,"r");

	fclose(file);
}