import re

def read_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    return content

def read_text_file_line_by_line(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            print(line.strip())  # .strip() removes the newline character at the end of each line

def clean_text_data(text):
    # Use regular expressions to remove standalone page numbers
    # and lines not starting with specific numeric sequences, specific titles, or blank lines
    cleaned_text = []
    lines = text.split('\n')

    # Patterns
    page_number_pattern = re.compile(r'^\s*(\d+)\s*$')  # Standalone page numbers
    valid_content_pattern = re.compile(r'^\s*(\d+(\.\d+)*\s+.*)')  # Sequence numbers like 1.1 or 1
    specific_titles_pattern = re.compile(r'^(The Tree of The TracT aTus|TracT aTus Logico-PhiL osoPhicus)$',
                                         re.IGNORECASE | re.MULTILINE)
    blank_line_pattern = re.compile(r'^\s*$')  # Blank lines
    page_before_sequence_pattern = re.compile(
        r'(\d{1,3})(\d{1}\.\d+)')  # To capture and separate page numbers before sequences

    last_finish=True
    for line in lines:
        if page_number_pattern.match(line) or blank_line_pattern.match(line) or specific_titles_pattern.match(line):
            continue  # Skip standalone page numbers and blank lines and specific titles

        # Process lines to remove page numbers before sequence numbers
        line = page_before_sequence_pattern.sub(lambda m: m.group(2), line)

        if valid_content_pattern.match(line):
            cleaned_text.append(line)
            last_finish=False
        elif last_finish==False:
            cleaned_text.append(line)

    return '\n'.join(cleaned_text)


def save_text_to_file(text, file_path):
    """Saves the given text to a specified file path."""
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(text)
    print(f"Text has been saved to {file_path}")

file_path = 'English-Tractatus logico-philosophicus.txt'
#read file
content = read_text_file(file_path)
#clean the text
cleaned_text = clean_text_data(content)
save_text_to_file(cleaned_text, "cleaned_data.txt")

