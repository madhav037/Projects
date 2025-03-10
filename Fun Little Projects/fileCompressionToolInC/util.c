#include<stdio.h>
#include<stdlib.h>

#define HASHSET_SIZE 10

struct Node {
    char key;
    char value;
    struct Node* next;
};

struct Node* hashset[HASHSET_SIZE];

struct Node* createNode(char key, char value){
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->key = key;
    newNode->value = value;
    newNode->next = NULL;

    return newNode;
}

int hashFunction(char* key){
    int sum = 0;
    for (int i = 0; key[i] != '\0'; i++){
        sum += key[i];
    }
    return sum % HASHSET_SIZE;
}

void insertNode(char key, char value){
    int index = hashFunction(key);
    struct Node* newNode = createNode(key, value);

    if ()
}

