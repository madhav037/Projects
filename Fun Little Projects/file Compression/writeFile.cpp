#include <iostream>
#include <fstream>
#include <cstdlib>
#include <climits>
int main()
{
    char charArray[78] = {
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', ' ', '\n'
    };

    std::ofstream file("abc.txt");
    if (!file)
    {
        std::cerr << "Error opening the file" << std::endl;
        return 1;
    }

    for (int i = 0; i < 150000; i++)
    {
        int randomNumber = std::rand() % 78;
        file << charArray[randomNumber];
    }

    file.close();
    return 0;
}
