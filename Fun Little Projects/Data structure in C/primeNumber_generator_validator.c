#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

int isNumberPrime(int);
void printPrimeNumbers(int, int);
void primeGenerator(int, int);

void main()
{
    int mode, n, start, end;
    while (1)
    {
        printf("Enter \n1. Prime validations \n2. Print prime number between range \n3. Generate with algorithm \n4. To quit\n");
        scanf("%d", &mode);
        if (mode == 4)
        {
            break;
        }
        switch (mode)
        {
        case 1:
            scanf("%d", &n);
            isNumberPrime(n);
            break;

        case 2:
            printf("enter the range (start end)\n");
            scanf("%d", &start);
            scanf("%d", &end);
            printPrimeNumbers(start, end);
            break;

        case 3:
            printf("enter the range (start end)\n");
            scanf("%d", &start);
            scanf("%d", &end);
            primeGenerator(start, end);
            break;

        default:
            break;
        }
    }
}

int isNumberPrime(int n)
{
    if (n <= 1)
    {
        printf("Not prime\n");
        return 0;
    }

    for (int i = 2; i <= sqrt(n); i++)
    {
        if (n % i == 0)
        {
            printf("Not prime\n");
            return 0;
        }
    }
    printf("Prime\n");
    return 1;
}

void printPrimeNumbers(int start, int end)
{
    int flag = 0;
    if (start <= 1){ 
        start = 2;
    }

    clock_t start_time = clock();

    for (int i = start; i < end; i++)
    {
        flag = 0;
        for (int j = 2; j <= sqrt(i); j++)
        {
            if (i % j == 0)
            {
                flag = 1;
                break;
            }
        }
        if (flag == 0)
        {
            printf("%d ", i);
        }
    }

    clock_t end_time = clock();
    double time_taken = (double)(end_time - start_time) / CLOCKS_PER_SEC;
    printf("\nTime taken to generate prime numbers: %.5f seconds\n", time_taken);
}

void primeGenerator(int start, int end) {
    if (end < 2) {
        printf("No primes in this range.\n");
        return;
    }

    if (start < 2) {
        start = 2;
    }
    int *arr = (int *)malloc((end + 1) * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\n");
        return;
    }

    clock_t start_time = clock();

    for (int i = 0; i <= end; i++) {
        arr[i] = 0;
    }

    // Sieve of Eratosthenes
    for (int i = 2; i * i <= end; i++) {
        if (arr[i] == 0) {
            for (int j = i * i; j <= end; j += i) {
                arr[j] = 1;
            }
        }
    }

    printf("Prime numbers up to %d:\n", end);
    for (int i = start; i <= end; i++) {
        if (arr[i] == 0) {
            printf("%d ", i);
        }
    }
    printf("\n");

    clock_t end_time = clock();
    double time_taken = (double)(end_time - start_time) / CLOCKS_PER_SEC;
    printf("\nTime taken to generate prime numbers: %.5f seconds\n", time_taken);

    free(arr);
}
