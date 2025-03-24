#include <iostream>
#include <map>
#include <fstream>
#include <queue>
#include <unordered_map>
#include <vector>
#include <cstdint>
#include <chrono>
#include <cstring>
#include <functional>

using namespace std;
using namespace chrono;

class Node {
public:
    char symbol;
    int frequency;
    Node *left;
    Node *right;

    // Leaf node constructor
    Node(char sym, int freq) : symbol(sym), frequency(freq), left(nullptr), right(nullptr) {}

    // Internal node constructor
    Node(int freq, Node *l, Node *r) : symbol('\0'), frequency(freq), left(l), right(r) {}
};

struct Compare {
    bool operator()(Node *a, Node *b) {
        return a->frequency > b->frequency;
    }
};

void generateDOT(Node *, ostream &);
void generate_graph(Node *root);
void generate_codes(Node *, string, unordered_map<char, string> &);
void free_tree(Node *root);
Node *rebuilt_huffman_tree(const map<char, int> &frequency_table);

//----------------------------------------------
// STREAMING ENCODING
//----------------------------------------------

// Reads the input file in chunks, encodes using the Huffman codes,
// and writes bytes directly into the output file stream.
void stream_encode_text(const string &input_filename, const unordered_map<char, string> &huffman_codes,
                        fstream &outFile, int &padding_bits) {
    const size_t BUFFER_SIZE = 64 * 1024; // 64KB buffer
    char buffer[BUFFER_SIZE];
    ifstream inFile(input_filename, ios::binary);
    if (!inFile) {
        cerr << "Error: Unable to open input file for encoding!" << endl;
        exit(1);
    }
    
    unsigned char accumulator = 0;
    int bitCount = 0;
    while (inFile.read(buffer, BUFFER_SIZE) || inFile.gcount() > 0) {
        size_t bytesRead = inFile.gcount();
        for (size_t i = 0; i < bytesRead; i++) {
            char ch = buffer[i];
            const string &code = huffman_codes.at(ch);
            for (char bit : code) {
                accumulator = (accumulator << 1) | (bit == '1' ? 1 : 0);
                bitCount++;
                if (bitCount == 8) {
                    outFile.put(accumulator);
                    accumulator = 0;
                    bitCount = 0;
                }
            }
        }
    }
    if (bitCount > 0) {
        accumulator <<= (8 - bitCount); // pad with zeros on the right
        outFile.put(accumulator);
        padding_bits = 8 - bitCount;
    } else {
        padding_bits = 0;
    }
    inFile.close();
}

//----------------------------------------------
// STREAMING DECODING
//----------------------------------------------

// Reads the header (padding and frequency table) from the encoded file,
// rebuilds the Huffman tree, then decodes the compressed data chunk-by-chunk,
// writing the output to decoded_filename.
void stream_decode_text(const string &encoded_filename, const string &decoded_filename) {
    ifstream inFile(encoded_filename, ios::binary);
    ofstream outFile(decoded_filename);
    if (!inFile) {
        cerr << "Error: Could not open encoded file for decoding!" << endl;
        exit(1);
    }
    if (!outFile) {
        cerr << "Error: Could not open output file for writing decoded text!" << endl;
        exit(1);
    }
    
    // Read header: padding bits, table size and frequency table
    int padding_bits = inFile.get();
    uint16_t table_size;
    inFile.read(reinterpret_cast<char*>(&table_size), sizeof(table_size));
    map<char, int> frequency_table;
    for (int i = 0; i < table_size; i++) {
        char ch = inFile.get();
        int freq;
        inFile.read(reinterpret_cast<char*>(&freq), sizeof(freq));
        frequency_table[ch] = freq;
    }
    
    // Rebuild Huffman tree from frequency table
    Node *root = rebuilt_huffman_tree(frequency_table);
    
    // Get current position (end of header) and file size
    streampos header_end = inFile.tellg();
    inFile.seekg(0, ios::end);
    streampos file_end = inFile.tellg();
    size_t encoded_data_bytes = file_end - header_end;
    inFile.seekg(header_end, ios::beg);
    
    Node *current = root;
    size_t processed_bytes = 0;
    const size_t BUFFER_SIZE = 64 * 1024;
    char buffer[BUFFER_SIZE];
    
    while (inFile.read(buffer, BUFFER_SIZE) || inFile.gcount() > 0) {
        size_t bytesRead = inFile.gcount();
        for (size_t i = 0; i < bytesRead; i++) {
            processed_bytes++;
            unsigned char byte = buffer[i];
            // For the last byte, only process (8 - padding_bits) bits.
            int bits_to_process = 8;
            if (processed_bytes == encoded_data_bytes) {
                bits_to_process = 8 - padding_bits;
            }
            for (int j = 7; j >= 8 - bits_to_process; j--) {
                int bit = (byte >> j) & 1;
                current = (bit == 0) ? current->left : current->right;
                if (!current->left && !current->right) {
                    outFile.put(current->symbol);
                    current = root;
                }
            }
        }
    }
    
    inFile.close();
    outFile.close();
    free_tree(root);
}

//----------------------------------------------
// OTHER HELPER FUNCTIONS
//----------------------------------------------

void generateDOT(Node *root, ostream &out) {
    if (!root)
        return;
    if (root->left) {
        out << "    \"" << root->symbol << "(" << root->frequency << ")\" -> \""
            << root->left->symbol << "(" << root->left->frequency << ")\";\n";
        generateDOT(root->left, out);
    }
    if (root->right) {
        out << "    \"" << root->symbol << "(" << root->frequency << ")\" -> \""
            << root->right->symbol << "(" << root->right->frequency << ")\";\n";
        generateDOT(root->right, out);
    }
}

void generate_graph(Node *root) {
    ofstream dotFile("huffman_tree.dot");
    dotFile << "digraph HuffmanTree {\n";
    generateDOT(root, dotFile);
    dotFile << "}\n";
    dotFile.close();
    cout << "📌 DOT file generated: huffman_tree.dot\n";
    cout << "🔗 Run 'dot -Tpng huffman_tree.dot -o huffman_tree.png' to generate an image.\n";
}

void generate_codes(Node *root, string code, unordered_map<char, string> &huffman_codes) {
    if (!root)
        return;
    if (!root->left && !root->right) {
        huffman_codes[root->symbol] = code;
    }
    generate_codes(root->left, code + '0', huffman_codes);
    generate_codes(root->right, code + '1', huffman_codes);
}

void free_tree(Node *root) {
    if (!root)
        return;
    free_tree(root->left);
    free_tree(root->right);
    delete root;
}

Node *rebuilt_huffman_tree(const map<char, int> &frequency_table) {
    priority_queue<Node *, vector<Node *>, Compare> min_heap;
    for (const auto &[ch, freq] : frequency_table) {
        min_heap.push(new Node(ch, freq));
    }
    while (min_heap.size() > 1) {
        Node *l = min_heap.top(); min_heap.pop();
        Node *r = min_heap.top(); min_heap.pop();
        int freq = l->frequency + r->frequency;
        Node *merge = new Node(freq, l, r);
        min_heap.push(merge);
    }
    return min_heap.top();
}

//----------------------------------------------
// MAIN FUNCTION
//----------------------------------------------

int main() {
    auto start = high_resolution_clock::now();
    const string inputFilename = "abc.txt";
    const string encodedFilename = "encoded.bin";
    const string decodedFilename = "decoded.txt";
    
    // First pass: Build frequency table using buffered reading.
    map<char, int> frequency_table;
    const size_t BUFFER_SIZE = 64 * 1024;
    char buffer[BUFFER_SIZE];
    ifstream file(inputFilename, ios::binary);
    if (!file) {
        cerr << "Error: Unable to open file " << inputFilename << "!" << endl;
        return 1;
    }
    while (file.read(buffer, BUFFER_SIZE) || file.gcount() > 0) {
        size_t bytesRead = file.gcount();
        for (size_t i = 0; i < bytesRead; i++) {
            frequency_table[buffer[i]]++;
        }
    }
    file.close();
    cout << "✅ Frequency table built!" << endl;
    
    // Build Huffman tree using a min-heap.
    priority_queue<Node *, vector<Node *>, Compare> min_heap;
    for (const auto &[key, value] : frequency_table) {
        min_heap.push(new Node(key, value));
    }
    while (min_heap.size() > 1) {
        Node *l = min_heap.top(); min_heap.pop();
        Node *r = min_heap.top(); min_heap.pop();
        int freq = l->frequency + r->frequency;
        Node *merge = new Node(freq, l, r);
        min_heap.push(merge);
    }
    Node *root = min_heap.top();
    cout << "✅ Huffman tree built!" << endl;
    
    // Generate Huffman codes.
    unordered_map<char, string> huffman_codes;
    generate_codes(root, "", huffman_codes);
    cout << "✅ Huffman codes generated!" << endl;
    
    // Open output file stream for writing binary file.
    // Using fstream for random access.
    fstream outFile(encodedFilename, ios::binary | ios::in | ios::out | ios::trunc);
    if (!outFile) {
        cerr << "Error: Could not open output file " << encodedFilename << " for writing!" << endl;
        return 1;
    }
    
    // Write header: dummy padding byte, table size, and frequency table.
    outFile.put(0);
    uint16_t table_size = frequency_table.size();
    outFile.write(reinterpret_cast<const char *>(&table_size), sizeof(table_size));
    for (const auto &[ch, freq] : frequency_table) {
        outFile.put(ch);
        outFile.write(reinterpret_cast<const char *>(&freq), sizeof(freq));
    }
    int header_size = static_cast<int>(outFile.tellp());
    
    int padding_bits = 0;
    stream_encode_text(inputFilename, huffman_codes, outFile, padding_bits);
    
    // Update header with actual padding bits.
    outFile.seekp(0, ios::beg);
    outFile.put(static_cast<unsigned char>(padding_bits));
    outFile.close();
    cout << "✅ Encoding completed!" << endl;
    auto encode_time = high_resolution_clock::now();
    
    // Free the encoding tree.
    free_tree(root);
    
    // STREAMING DECODING: Process the encoded file and write the decoded text.
    stream_decode_text(encodedFilename, decodedFilename);
    cout << "✅ Decoding completed!" << endl;
    
    auto end = high_resolution_clock::now();
    cout << "\nExecution times:" << endl;
    cout << "🕒 Encoding: " << duration_cast<milliseconds>(encode_time - start).count() << " ms" << endl;
    cout << "🕒 Decoding: " << duration_cast<milliseconds>(end - encode_time).count() << " ms" << endl;
    cout << "🕒 Total execution time: " << duration_cast<milliseconds>(end - start).count() << " ms" << endl;
    
    return 0;
}
