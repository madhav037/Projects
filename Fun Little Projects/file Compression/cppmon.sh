#!/bin/bash

FILENAME="$1"

if [[ -z "$FILENAME" ]]; then
    echo -e "\e[33mUsage: ./cppmon.sh <filename.cpp>\e[0m"
    exit 1
fi

OUTPUT="${FILENAME%.cpp}.out"
LOGFILE="errors.log"

cleanup() {
    if [[ -f "$OUTPUT" ]]; then
        rm -f "$OUTPUT"
        echo -e "\e[36m🧹 Cleaned up: Removed $OUTPUT\e[0m"
    fi
    exit 0
}

# Handle Ctrl+C
trap cleanup SIGINT

echo -e "\e[36m🔍 Watching $FILENAME for changes... Press Ctrl+C to stop.\e[0m"
LAST_MOD_TIME=$(stat -c %Y "$FILENAME")

while true; do
    sleep 0.5
    NEW_MOD_TIME=$(stat -c %Y "$FILENAME")
    
    if [[ "$NEW_MOD_TIME" -ne "$LAST_MOD_TIME" ]]; then
        clear
        echo -e "\e[34m🛠️  Compiling $FILENAME...\e[0m"
        g++ -std=c++23 "$FILENAME" -o "$OUTPUT" 2> "$LOGFILE"
        
        if [[ $? -eq 0 ]]; then
            echo -e "\e[32m✅ Compilation successful! Running...\e[0m"
            ./"$OUTPUT"
        else
            echo -e "\e[31m❌ Compilation failed! Check $LOGFILE for errors.\e[0m"
            cat "$LOGFILE"
        fi

        LAST_MOD_TIME=$NEW_MOD_TIME
    fi
done