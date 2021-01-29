
#include <stdio.h>
#include <malloc.h>
#include <stdlib.h>
#include <string.h>
#include "../include/cipher.h"

char encryptLetter(char str, int key)
{
  key=key%95;
  char s = str;
  int id;

 if(str>=32 && str<=126)
    id=str-32;
  else
    return s;
  
  id=(id+key)%95;

  s=id+32;

  //For test purposes
  //  printf("treat %c -> %c\n", str, s);
    
  return s;
}

char decryptLetter(char str, int key)
{
  key=key%95;
  char s = str;
  int id;
  if(str>=32 && str<=126)
    id=str-32;
  else
    return s;
 
  id=id-key;
  if(id<0)
    id=95+id;
  
  s=id+32;

  // printf("treat %c -> %c\n", str, s);
  return s;
}


char *encrypt(char *key_ch, char* txt) {
    int key = atoi(key_ch);
    char out_char;
    char in_char;
    int i=0;
    while ((in_char = txt[i])!='\0')
      {

	//JE suis entrain de lire un character, je dois le traiter
	if ((out_char = encryptLetter(in_char, key)) != 0)
	  {
	    txt[i]=out_char;
	  }
	i++;
      }
    return txt;
}

char * decrypt(char * key_ch, char *txt) {
    int key = atoi(key_ch);
    char out_char;
    char in_char;
    int i = 0;
    while ((in_char = txt[i])!='\0')
      {

	//JE suis entrain de lire un character, je dois le traiter
	if ((out_char = decryptLetter(in_char, key)) != 0)
	  {
	    txt[i]=out_char;
	  }
	i++;
      }
    return txt;
}


