//Detriot
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
  printf("Detriot Script Running...\n------------------\n");

  FILE *fp;
  char buffer[50];


  system("which node > Detriot/FILESAVE.snoop");
  fp  = fopen ("Detriot/FILESAVE.snoop", "r");

  fgets(buffer, 50, fp);

  if(strcmp(buffer, "") == 0){
    system("rm Detriot/FILESAVE.snoop");
    system("echo NodeJS is not installed, installing, please give password below.This may also take some time");
    system("su");
    system("curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash");
    system("nvm ls");
    system("nvm install 14.17.0");
    system("nvm use 14.17.0");
    printf("Process Ended");    

  } else {
    system("rm Detriot/FILESAVE.snoop");
    printf("NodeJS is already installed, Continue with the installation process\n");
  }


  fclose(fp);


  return 0;
}