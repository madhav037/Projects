#include<stdio.h>

int count(int n);

void main() {
    printf("HEllo\n");
    printf("%d",count(123456789));
}

int count (int n) {
    if (n <= 1) {
        return 1;
    }else  {
        n = n/10;
        return count(n) + 1;
    }
}