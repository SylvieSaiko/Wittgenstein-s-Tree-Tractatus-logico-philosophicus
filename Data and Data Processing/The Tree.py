import re
class TreeNode:
    def __init__(self, sequence, data):
        self.sequence=sequence
        self.data = data
        self.children = []

    def add_child(self, child):
        self.children.append(child)

    def children_num(self):
        return len(self.children)

    def print_tree(self, level=0):
        print('  ' * level + self.sequence+"  "+self.data)
        for child in self.children:
            child.print_tree(level + 1)

    def write_tree(self, file, level=0):
        file.write('  ' * level + self.sequence+"  "+self.data+"\n")
        for child in self.children:
            child.write_tree(file, level + 1)

    def add_child_advanced(self, node):
        add=False
        if str_match(self.sequence, node.sequence):
            add=True
            for i in self.children:
                if str_match(i.sequence, node.sequence):
                    i.add_child_advanced(node)
                    add=False
                    break
        if add==True:
            self.add_child(node)

def read_text_file(file_path):
    #read the file
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    return content

def build_tree(root, child):
    #builds the tree by adding child to the root
    root.add_child(child)

def str_match(str1, str2):
    for i in range(len(str1)):
        if str1[i]==str2[i]:
            continue
        else:
            return False
    return True

contents=read_text_file("cleaned_data.txt")
valid_content_pattern = re.compile(r'(?m)^(\d+(\.\d+)*)\s+(.*)')
matches = list(re.finditer(valid_content_pattern, contents))
Nodes=[TreeNode("0", "Tractatus logico philosophicus")]
datas=[]
sequences=[]
#build up TreeNode objects that can be potentially linked together
for i in range(len(matches)):
    start = matches[i].end()
    # Determine the end by the next match's start or text length if it's the last match
    end = matches[i+1].start() if i+1 < len(matches) else len(contents)
    sequence = matches[i].group(1).strip()  # Capture only the sequence number
    sequences.append(str(sequence))
    line_text = matches[i].group(3).strip()  # Capture the initial line's text
    data=line_text + " "+ contents[start:end].strip()
    Node=TreeNode(sequence, data)
    Nodes.append(Node)
root=Nodes[0]
pointer=root

for i in range(1,len(sequences)):
    if i<8:
        root.add_child(Nodes[i])
        continue
    for j in range(0,7):
        root.children[j].add_child_advanced(Nodes[i])

#Write the tree
with open("The tree.txt", 'w', encoding='utf-8') as file:
    root.write_tree(file)
