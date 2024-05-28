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
        const nodes = [];

        for (const line of lines) {
            const level = line.search(/\S/); // Calculate the indentation level
            const [sequence, ...dataParts] = line.trim().split(/\s+/);
            const data = dataParts.join(' ');
            const node = new TreeNode(sequence, data);

            if (level === 0) {
                nodes.push(node);
            } else {
                let parent = nodes[nodes.length - 1];
                for (let i = 0; i < level / 2; i++) {
                    parent = parent.children[parent.children.length - 1];
                }
                parent.addChild(node);
            }
        }

        return nodes[0];
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
    const treeElement = document.getElementById('tree');
    treeElement.appendChild(root.toHTML());
}

loadTree();
