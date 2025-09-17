
#include <iostream>
#include <vector>
#include <string>
#include <cctype>
#include <map>
using namespace std;

// Helper: convert to lowercase
string toLower(const string &s) {
    string res = s;
    for (char &c : res) c = tolower(c);
    return res;
}

// Helper: extract last word of a line
string getLastWord(const string &line) {
    string word = "";
    for (int i = line.size() - 1; i >= 0; i--) {
        if (isalpha(line[i])) word = line[i] + word;
        else if (!word.empty()) break;
    }
    return toLower(word);
}

// Helper: get rhyme key (last N letters)
string getRhymeKey(const string &word, int N=3) {
    if ((int)word.size() <= N) return word;
    return word.substr(word.size() - N);
}

int main() {
    cout << "Enter poem (end with empty line):\n";
    vector<string> lines;
    string line;

    while (true) {
        getline(cin, line);
        if (line.empty()) break;
        lines.push_back(line);
    }

    map<string, char> rhymeMap; // rhyme key -> letter
    string scheme = "";
    char nextLetter = 'A';

    for (auto &l : lines) {
        string lastWord = getLastWord(l);
        string rhymeKey = getRhymeKey(lastWord);

        if (rhymeMap.find(rhymeKey) == rhymeMap.end()) {
            rhymeMap[rhymeKey] = nextLetter++;
        }
        scheme += rhymeMap[rhymeKey];
    }

    cout << "\nRhyme scheme: " << scheme << "\n";
    return 0;
}
