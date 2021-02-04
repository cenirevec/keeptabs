#include <stdio.h>
#include <stdlib.h>
//Moins fréquent
#include <string.h>

#define NB_ARG 1
#define MAX 1024

typedef struct 
{
	unsigned int blocks;
}json_data;


//Optimization
int write_json_data(FILE* file, json_data* data){
	return 0;
}

void read_json_data(FILE* file, json_data* data){
	json_data* loaded_data = malloc(sizeof(json_data));
	
	//Read from file and convert it into a json_data struct

	char line[128];
	//Read and add elements line by line
	for (size_t i = 1; i < 7; i++)
	{
		fgets(line,127,file);
		
		if (i<4 || i == 6)
		{
			/* Do nothing, the 3 first lines are headers */
		}else{
			/*Do nothing*/

			const char s[2] = ":";
			char *parameter;
			char *number;

			/* get the first token */
			number = strtok(line, ":");
			number = strtok(NULL, ",");
			
			number = strtok(number," ");

			parameter = strtok(line, "\"");
			parameter = strtok(NULL, "\"");

			
			if (strcmp(parameter,"nb_blocks") == 0){
				loaded_data->blocks = atoi(number);
			}else{

			}
			
		}
		
	}
	memcpy(data,loaded_data,sizeof(json_data));
}

char* read_file_content(char* filename){
	FILE* file;
	//Check if the file exists
	if((file = fopen(filename,"r")) == NULL){
		printf("Ce fichier ne peux être ouvert\n");
		exit(0);
	}

	//How much blocks too load ?
	json_data data;
	read_json_data(file,&data);
	size_t size = ((MAX * data.blocks) + 1 ) * sizeof(char);
	char * file_content = malloc(size);

	fread(file_content,MAX,data.blocks,file);
	sprintf(file_content,"[%s",file_content);

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


char* version(){
	return "0.0.1";
}