class TreeNode {
    constructor(sequence, data) {
        this.sequence = sequence;
        this.data = data;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    static fromText(text) {
        const lines = text.trim().split('\n');
        const root = new TreeNode("0", "Tractatus logico philosophicus");
        const nodeStack = [root];
        let prevIndentation = 0;

        lines.forEach(line => {
            const indentation = line.search(/\S/);
            const [sequence, ...dataParts] = line.trim().split(/\s+/);
            const data = dataParts.join(' ');
            const node = new TreeNode(sequence, data);

            if (indentation > prevIndentation) {
                nodeStack[nodeStack.length - 1].addChild(node);
            } else {
                while (indentation <= nodeStack[nodeStack.length - 1].indentation) {
                    nodeStack.pop();
                }
                nodeStack[nodeStack.length - 1].addChild(node);
            }

            node.indentation = indentation;
            nodeStack.push(node);
            prevIndentation = indentation;
        });

        return root;
    }

    toHTML() {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
        nodeElement.textContent = this.sequence;
        nodeElement.ondblclick = function () {
            nodeElement.classList.toggle('expanded');
        };
        nodeElement.onclick = function () {
            document.getElementById('content').textContent = this.data;
        }.bind(this);

        if (this.children.length > 0) {
            const ul = document.createElement('ul');
            this.children.forEach(child => {
                const li = document.createElement('li');
                li.appendChild(child.toHTML());
                ul.appendChild(li);
            });
            nodeElement.appendChild(ul);
        }

        return nodeElement;
    }
}

async function loadTree() {
    const response = await fetch('The tree.txt');
    const text = await response.text();
    const root = TreeNode.fromText(text);
    console.log('Root node:', root); // Debugging: log the root node
    const treeElement = document.getElementById('tree');
    treeElement.appendChild(root.toHTML());
}

loadTree();
