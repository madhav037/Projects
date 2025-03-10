#include <stdio.h>
#include <stdlib.h>

int main(){
    char charArray[14][2] = {"ab", "cd", "ef","gh", "ij","kl", "mn","op", "qr","st", "uv", "wx", "yz", "\n"};

    FILE *file  = fopen("abc.txt","w");
    if (file == NULL){
        printf("Error opening the file");
    }

    for (int i = 0; i < 5000; i++){
        int randomNumber = rand() % 14;
        fprintf(file, charArray[randomNumber]);
    }

    fclose(file);

}

