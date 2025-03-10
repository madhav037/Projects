#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>

struct Vector createVector();
void mergeSort(int arr[], int left, int right);             //merge sort code from online not implemented by me
void merge(int arr[], int left, int middle, int right);

struct Vector {
    int size;
    int *arr;
    int current_index;
    void (*push_back)(struct Vector *this, int data);
    void (*display)(struct Vector *this);
    int (*pop)(struct Vector *this);
    int (*shift)(struct Vector *this);
    void (*unshift)(struct Vector *this, int data);
    struct Vector (*concat)(struct Vector *this, struct Vector *v);
    void (*splice)(struct Vector *this, int startIndex, int totalElementsToBeAdded, ...);
    struct Vector (*slice)(struct Vector *this, int startIndex, int totalElementsToBeRemoved);
    void (*sort)(struct Vector *this);
    void (*reverse)(struct Vector *this);
};

void push_back(struct Vector *this, int data) {
    if (this->current_index == this->size - 1) {
        this->size *= 2;
        this->arr = (int *)realloc(this->arr, this->size * sizeof(int));
    }
    if (this->current_index < 0) {
        this->current_index = 0;
    }
    this->arr[this->current_index] = data;
    this->current_index++;
    return;
}

void display(struct Vector *this) {
    for (int i = 0; i < this->current_index; i++) {
        printf("%d ", this->arr[i]);
    }
    printf("\n");
    return;
}

int pop(struct Vector *this) {
    if (this->current_index == 0) {
        fprintf(stderr,"Underflow value returned -1\n");
        return -1;
    }
    this->current_index--;
    return this->arr[this->current_index];
}

int shift(struct Vector *this) {
    if (this->current_index == 0) {
        fprintf(stderr,"Underflow value returned -1\n");
        return -1;
    }
    int temp = this->arr[0];
    for (int i = 0; i < this->current_index; i++) {
        this->arr[i] = this->arr[i + 1];
    }
    this->current_index--;
    return temp;
}

void unshift(struct Vector *this, int data) {
    if (this->current_index == this->size - 1) {
        this->size *= 2;
        this->arr = (int *)realloc(this->arr, this->size * sizeof(int));
    }
    if (this->current_index < 0) {
        this->current_index = 0;
    }
    for (int i = this->current_index; i > 0; i--) {
        this->arr[i] = this->arr[i - 1];
    }
    this->arr[0] = data;
    this->current_index++;
    return;
}

void splice(struct Vector *this, int startIndex, int totalElementsToBeAdded, ...) {
    if (this->current_index == 0) {
        fprintf(stderr,"Underflow value returned -1\n");
        return;
    }
    va_list args;
    va_start(args, totalElementsToBeAdded);

    if (totalElementsToBeAdded+this->current_index > this->size) {
        this->size = totalElementsToBeAdded + this->size;
        this->arr = (int *)realloc(this->arr, this->size * sizeof(int));
    }
    
    for (int i = this->current_index; i >= startIndex; i--) {
        this->arr[i+totalElementsToBeAdded] = this->arr[i];
    }

    for (int i = 0; i < totalElementsToBeAdded; i++) {
        this->arr[startIndex+i] = va_arg(args, int);
    }
    this->current_index += totalElementsToBeAdded;
    va_end(args);
    return;
}

struct Vector slice(struct Vector *this, int startIndex, int totalElementsToBeRemoved) {
    struct Vector arr = createVector();
    
    if (this->current_index == 0) {
        fprintf(stderr, "Empty!");
        return arr;
    }

    int totalElementsToBeRemovedTemp = totalElementsToBeRemoved;
    while (totalElementsToBeRemovedTemp--){
        for (int i = startIndex; i < this->current_index; i++) {
            if (arr.current_index < totalElementsToBeRemoved) {
                arr.push_back(&arr,this->arr[i]);
            }
            this->arr[i] = this->arr[i+1];
        }   
    }
    this->current_index -= totalElementsToBeRemoved; 
    return arr;
}

void sort(struct Vector *this) {
    mergeSort(this->arr, 0, this->current_index-1);
}

void merge(int arr[], int left, int middle, int right) {
    int i, j, k;
    int n1 = middle - left + 1;
    int n2 = right - middle;

    // Create temporary arrays
    int *L = (int *)malloc(n1 * sizeof(int));
    int *R = (int *)malloc(n2 * sizeof(int));

    // Copy data to temporary arrays L[] and R[]
    for (i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[middle + 1 + j];

    // Merge the temporary arrays back into arr[left..right]
    i = 0;
    j = 0;
    k = left;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    // Copy the remaining elements of L[], if there are any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // Copy the remaining elements of R[], if there are any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        // Same as (left+right)/2, but avoids overflow for large left and right
        int middle = left + (right - left) / 2;

        // Sort first and second halves
        mergeSort(arr, left, middle);
        mergeSort(arr, middle + 1, right);

        // Merge the sorted halves
        merge(arr, left, middle, right);
    }
}


void reverse(struct Vector *this) {
    int temp;
    for (int i = 0; i < this->current_index / 2; i++) {
        temp = this->arr[i];
        this->arr[i] = this->arr[this->current_index - i - 1];
        this->arr[this->current_index - i - 1] = temp;
    }
    return;
}

struct Vector concat(struct Vector *this, struct Vector *v) {
    struct Vector arr = createVector();
    arr.size = this->size + v->size;
    arr.arr = (int *)malloc(arr.size * sizeof(int));
    
    for (int i = 0; i < this->current_index; i++) {
        arr.push_back(&arr, this->arr[i]);
    }
    for (int i = 0; i < v->current_index; i++) {
        arr.push_back(&arr, v->arr[i]);
    }
    arr.current_index = this->current_index + v->current_index;
    
    return arr;
}

struct Vector createVector() {
    struct Vector v;
    v.size = 1;
    v.arr = (int *)malloc(v.size * sizeof(int));
    v.current_index = 0;
    v.push_back = push_back;
    v.display = display;
    v.pop = pop;
    v.shift = shift;
    v.unshift = unshift;
    v.concat = concat;
    v.splice = splice;
    v.slice = slice;
    v.sort = sort;
    v.reverse = reverse;

    return v;
};

int main() {
    struct Vector v = createVector();
    struct Vector v1 = createVector();

    v.push_back(&v, 1);
    v.push_back(&v, 2);
    v.push_back(&v, 3);
    v.pop(&v);
    v.pop(&v);
    v.pop(&v);
    v.pop(&v);
    v.push_back(&v, 4);
    v.push_back(&v, 5);
    v.push_back(&v, 6);
    v.push_back(&v, 7);
    v.push_back(&v, 8);
    v.shift(&v);
    v.unshift(&v, 9);
    v.arr[0] = 10;
    // v.display(&v);


    v1.push_back(&v1, 11);
    v1.push_back(&v1, 12);
    v1.push_back(&v1, 13);
    v1.push_back(&v1, 14);
    struct Vector v2 = v.concat(&v, &v1);

    // v.display(&v);
    v.splice(&v, 1, 2, 15, 16);
    v.push_back(&v,17);
    v.display(&v);

    struct Vector v3 = v.slice(&v,2,2);
    v.display(&v);
    v3.display(&v3);

    v.sort(&v);
    v.display(&v);

    v.reverse(&v);
    v.display(&v);
    // v2.display(&v2);

    free(v.arr);
    free(v1.arr);
    free(v2.arr);

    return 0;
}
