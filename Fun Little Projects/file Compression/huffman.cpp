#include <iostream>
#include <map>
#include <fstream>
#include <queue>
#include <unordered_map>
#include <vector>
#include <cstdint>
#include <chrono>

using namespace std;
using namespace chrono;

class Node
{
public:
    char symbol;
    int frequency;
    Node *left;
    Node *right;

    // for leaf node
    Node(char sym, int freq) : symbol(sym), frequency(freq), left(nullptr), right(nullptr) {}
    // for internal node
    Node(int freq, Node *l, Node *r) : symbol('\0'), frequency(freq), left(l), right(r) {}
};

struct Compare
{
    bool operator()(Node *a, Node *b)
    {
        return a->frequency > b->frequency;
    }
};


void generateDOT(Node *, ostream &out);
void generate_graph(Node *root);
void generate_codes(Node *, string, unordered_map<char, string> &huffman_codes);
string encode_text(const string &text, unordered_map<char, string> &huffman_codes);
void free_tree(Node *root);
void read_from_binary_file(const string &filename, map<char, int> &frequency_table, vector<unsigned char> &byte_data, int &padding_bits);
Node *rebuilt_huffman_tree(const map<char, int> &frequency_table);
string convert_to_bit_string(const vector<unsigned char> &byte_data, int padding_bits);
string decode_text(const string &bit_string, Node *root);
void write_decoded_text(const string &decoded_text, const string &filename);
vector<unsigned char> convert_to_bytes(const string &bit_string, int &padding_bits);
void write_to_binary_file(const string &filename, const map<char, int> &frequency_table, const vector<unsigned char> &byte_data, int padding_bits);

int main()
{
    auto start = high_resolution_clock::now();
    ifstream file("abc.txt");
    if (!file)
    {
        cerr << "Error: Unable to open file!" << endl;
        return 1;
    }

    map<char, int> frequency_table;
    char ch;
    priority_queue<Node *, vector<Node *>, Compare> min_heap;
    unordered_map<char, string> huffman_codes;

    while (file.get(ch))
    {
        frequency_table[ch]++;
    }
    file.close();

    cout << "✅ Frequency table built!" << endl;

    for (const auto &[key, value] : frequency_table)
    {
        // cout << key << " -> " << value << endl;
        min_heap.push(new Node(key, value));
    }

    while (min_heap.size() > 1)
    {
        Node *l = min_heap.top();
        min_heap.pop();
        Node *r = min_heap.top();
        min_heap.pop();

        int freq = l->frequency + r->frequency;
        Node *merge = new Node(freq, l, r);
        min_heap.push(merge);
    }

    Node *root = min_heap.top();
    // cout << "\nHuffman Tree Built! Root Frequency: " << root->frequency << endl;
    cout << "✅ Huffman tree built!" << endl;
    generate_codes(root, "", huffman_codes);
    cout << "✅ Huffman codes generated!" << endl;

    // cout << "Huffman Codes:\n";
    // for (const auto &[key, value] : huffman_codes)
    // {
        // cout << key << " -> " << value << endl;
    // }

    file.open("abc.txt");
    string input_text((istreambuf_iterator<char>(file)), istreambuf_iterator<char>());
    file.close();

    string encoded_text = encode_text(input_text, huffman_codes);
    // cout << "\nEncoded Text: " << encoded_text << endl;

    int padding_bits;
    vector<unsigned char> byte_data = convert_to_bytes(encoded_text, padding_bits);
    write_to_binary_file("encoded.bin", frequency_table, byte_data, padding_bits);
    cout << "✅ Encoding completed!" << endl;


    auto encode_time = high_resolution_clock::now();


    map<char, int> decoded_frequency_table;
    vector<unsigned char> decoded_byte_data;
    int decoded_padding_bits;

    read_from_binary_file("encoded.bin", decoded_frequency_table, decoded_byte_data, decoded_padding_bits);

    Node *decoded_root = rebuilt_huffman_tree(decoded_frequency_table);
    string bit_string = convert_to_bit_string(decoded_byte_data, decoded_padding_bits);
    string decoded_text = decode_text(bit_string, decoded_root);

    // cout << "\nDecoded Text:\n" << decoded_text << endl;

    write_decoded_text(decoded_text, "decoded.txt");
    cout << "✅ Decoding completed!" << endl;

    auto end = high_resolution_clock::now();

    cout << "\nExecution times:\n";
    cout << "🕒 Encoding: " << duration_cast<milliseconds>(encode_time - start).count() << " ms" << endl;
    cout << "🕒 Decoding: " << duration_cast<milliseconds>(end - encode_time).count() << " ms" << endl;
    cout << "🕒 Total execution time: " << duration_cast<milliseconds>(end - start).count() << " ms" << endl;


    free_tree(root);
    free_tree(decoded_root);
    return 0;
}

void generateDOT(Node *root, ostream &out)
{
    if (!root)
        return;

    if (root->left)
    {
        out << "    \"" << root->symbol << "(" << root->frequency << ")\" -> \""
            << root->left->symbol << "(" << root->left->frequency << ")\";\n";
        generateDOT(root->left, out);
    }
    if (root->right)
    {
        out << "    \"" << root->symbol << "(" << root->frequency << ")\" -> \""
            << root->right->symbol << "(" << root->right->frequency << ")\";\n";
        generateDOT(root->right, out);
    }
}

void generate_graph(Node *root)
{

    // Save DOT file
    ofstream dotFile("huffman_tree.dot");
    dotFile << "digraph HuffmanTree {\n";
    generateDOT(root, dotFile);
    dotFile << "}\n";
    dotFile.close();

    cout << "📌 DOT file generated: huffman_tree.dot\n";
    cout << "🔗 Run 'dot -Tpng huffman_tree.dot -o huffman_tree.png' to generate an image.\n";
}

void generate_codes(Node *root, string code, unordered_map<char, string> &huffman_codes)
{
    if (!root)
        return;

    if (!root->left && !root->right)
    {
        huffman_codes[root->symbol] = code;
    }

    generate_codes(root->left, code + '0', huffman_codes);
    generate_codes(root->right, code + '1', huffman_codes);
}

string encode_text(const string &text, unordered_map<char, string> &huffman_codes)
{
    string encoded_text;
    for (char ch : text)
    {
        encoded_text += huffman_codes[ch];
    }
    return encoded_text;
}

void free_tree(Node *root)
{
    if (!root)
        return;
    free_tree(root->left);
    free_tree(root->right);
    delete root;
}

vector<unsigned char> convert_to_bytes(const string &bit_string, int &padding_bits)
{
    vector<unsigned char> byte_array;
    int bit_length = bit_string.size();

    // Calculate padding needed
    padding_bits = (8 - (bit_length % 8)) % 8; // Ensure padding is within range [0-7]

    string padded_bit_string = bit_string + string(padding_bits, '0'); // Append zero-padding

    // Convert every 8 bits into a byte
    for (size_t i = 0; i < padded_bit_string.size(); i += 8)
    {
        unsigned char byte = 0;
        for (int j = 0; j < 8; j++)
        {
            if (padded_bit_string[i + j] == '1')
            {
                byte |= (1 << (7 - j)); // Set bits from left to right
            }
        }
        byte_array.push_back(byte);
    }

    return byte_array;
}

// Function to write encoded data to a binary file
void write_to_binary_file(const string &filename, const map<char, int> &frequency_table,
                          const vector<unsigned char> &byte_data, int padding_bits)
{
    ofstream outFile(filename, ios::binary);
    if (!outFile)
    {
        cerr << "Error: Could not open file for writing!" << endl;
        return;
    }

    // Write padding information (1 byte)
    outFile.put(static_cast<unsigned char>(padding_bits));

    // Write the size of the frequency table (for reference during decompression)
    uint16_t table_size = frequency_table.size();
    outFile.write(reinterpret_cast<const char *>(&table_size), sizeof(table_size));

    // Write the frequency table (char and its frequency as an int)
    for (const auto &[ch, freq] : frequency_table)
    {
        outFile.put(ch);
        outFile.write(reinterpret_cast<const char *>(&freq), sizeof(freq));
    }

    // Write the actual compressed data (byte sequence)
    outFile.write(reinterpret_cast<const char *>(byte_data.data()), byte_data.size());

    outFile.close();
    cout << "✅ Encoded data with frequency table successfully written to " << filename << endl;
}

void read_from_binary_file(const string &filename, map<char, int> &frequency_table, vector<unsigned char> &byte_data, int &padding_bits)
{
    ifstream inFile(filename, ios::binary);
    if (!inFile)
    {
        cerr << "ERROR : could not open file form reading!" << endl;
        return;
    }

    padding_bits = inFile.get();

    uint16_t table_size;
    inFile.read(reinterpret_cast<char *>(&table_size), sizeof(table_size));

    for (int i = 0; i < table_size; i++)
    {
        char ch = inFile.get();
        int freq;
        inFile.read(reinterpret_cast<char *>(&freq), sizeof(freq));
        frequency_table[ch] = freq;
    }

    byte_data.assign((istreambuf_iterator<char>(inFile)), istreambuf_iterator<char>());

    inFile.close();
}

Node *rebuilt_huffman_tree(const map<char, int> &frequency_table)
{
    priority_queue<Node *, vector<Node *>, Compare> min_heap;

    for (const auto &[ch, freq] : frequency_table)
    {
        min_heap.push(new Node(ch, freq));
    }

    while (min_heap.size() > 1)
    {
        Node *l = min_heap.top();
        min_heap.pop();
        Node *r = min_heap.top();
        min_heap.pop();
        int freq = l->frequency + r->frequency;
        Node *merge = new Node(freq, l, r);
        min_heap.push(merge);
    }

    return min_heap.top();
}

string convert_to_bit_string(const vector<unsigned char> &byte_data, int padding_bits)
{
    string bit_string;
    for (size_t i = 0; i < byte_data.size(); i++)
    {
        unsigned char byte = byte_data[i];

        for (int j = 7; j >= 0; j--)
        {
            bit_string += (byte & (1 << j)) ? '1' : '0';
        }
    }

    return bit_string.substr(0, bit_string.size() - padding_bits);
}

string decode_text(const string &bit_string, Node *root)
{
    string decode_string;
    Node *current = root;

    for (char bit : bit_string)
    {
        if (bit == '0')
        {
            current = current->left;
        }
        else
        {
            current = current->right;
        }

        if (!current->left && !current->right)
        {
            decode_string += current->symbol;
            current = root;
        }
    }
    return decode_string;
}

void write_decoded_text(const string &decoded_text, const string &filename)
{
    ofstream outFile(filename);
    if (!outFile)
    {
        cerr << "Error: Could not open file for writing!" << endl;
        return;
    }

    outFile << decoded_text;
    outFile.close();

    cout << "✅ Decoded text successfully written to " << filename << endl;
}