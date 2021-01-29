#include <stdio.h>
#include <stdlib.h>
//Moins fréquent
#include <string.h>

#define NB_ARG 1
#define MAX 12

typedef struct 
{
	unsigned int blocks;
}json_data;


char* version(){
	return "0.0.1";
}

//Optimization
int write_json_data(FILE* file, json_data* data){

}

int read_json_data(FILE* file, json_data* data){
	json_data* loaded_data = malloc(sizeof(json_data));
	
	//Read from file and convert it into a json_data struct

	char line[128];
	//Read and add elements line by line
	for (size_t i = 1; i < 6; i++)
	{
		fgets(line,127,file);
		
		if (i<4)
		{
			/* Do nothing, the 3 first lines are headers */
		}else{
			/*Do nothing*/
			printf("[%ld] %s",i, line);
			char parameter[128]
		}
		
	}
	
	loaded_data->blocks = 1;
	printf("--->\n");
	
	memcpy(data,loaded_data,sizeof(json_data));
}

char* read_file_content(char* filename){
	FILE* file = fopen(filename,"r");
	
	//How much blocks too load ?
	json_data data;
	read_json_data(file,&data);

	char * file_content = malloc(MAX * data.blocks * sizeof(char));

	fread(file_content,MAX,data.blocks,file);
/*
	while (1)
	{
		file_content = realloc(file_content,number_of_lines*MAX*sizeof(char));
	}*/
	

	


	fclose(file);
    return file_content;
}



int main(int argc, char **argv){
	//Vérifier la validité des arguments
	if(argc < NB_ARG){
		printf("E: Trop peu d'arguments\nUsage %s: <argument1>\n",argv[0]);
		exit(1);
	}else{
		//Lecture des arguments
		/*code*/
      // char content[100] = read_file_content("../example.json");

	   printf("%s",read_file_content("../example.json"));
	}
}
