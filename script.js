class TreeNode {
    constructor(sequence, data) {
      this.sequence = sequence;
      this.data = data;
      this.children = [];
    }
  
    addChild(child) {
      this.children.push(child);
    }
  
    getChildrenCount() {
      return this.children.length;
    }
  
   printTree(level = 0) {
     // Access the output element
     const outputElement = document.getElementById('treeOutput');
  
     // Create the string to be displayed
     const content = ' '.repeat(level) + this.sequence + "  " + this.data + '\n';
  
     // Append the string to the output element
     outputElement.textContent += content;
  
     // Recursively call printTree on all children
     for (const child of this.children) {
       child.printTree(level + 1);
     }
   }
    writeTreeToTxt(file, level = 0) {
      file.write(' '.repeat(level) + this.sequence + "  " + this.data + "\n");
      for (const child of this.children) {
        child.writeTreeToTxt(file, level + 1);
      }
    }
  
    addChildAdvanced(node) {
      let add = false;
      if (this.strMatch(this.sequence, node.sequence)) {
        add = true;
        for (const child of this.children) {
          if (this.strMatch(child.sequence, node.sequence)) {
            child.addChildAdvanced(node);
            add = false;
            break;
          }
        }
      }
      if (add) {
        this.addChild(node);
      }
    }
  
    strMatch(str1, str2) {
      for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
          return false;
        }
      }
      return true;
    }
  }
  
  function readTextFile(filePath) {
    // read the file
    const fs = require('fs');
    return fs.readFileSync(filePath, 'utf-8');
  }
  
  function buildTree(contents, matches) {
    // builds the tree by adding child to the root
    const Nodes = [new TreeNode("0", "Tractatus logico philosophicus")];
    const sequences = [];
    // build up TreeNode objects that can be potentially linked together
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i][0].length;
      // Determine the end by the next match's start or text length if it's the last match
      const end = i + 1 < matches.length ? matches[i + 1].index : contents.length;
      const sequence = matches[i][1].trim(); // Capture only the sequence number
      sequences.push(sequence);
      const lineText = matches[i][3].trim(); // Capture the initial line's text
      const data = lineText + " " + contents.slice(start, end).trim();
      const Node = new TreeNode(sequence, data);
      Nodes.push(Node);
    }
    const root = Nodes[0];
  
    for (let i = 1; i < sequences.length; i++) {
      if (i < 8) {
        root.addChild(Nodes[i]);
        continue;
      }
      for (let j = 0; j < 7; j++) {
        root.children[j].addChildAdvanced(Nodes[i]);
      }
    }
    return root;
  }
  const content = e.target.result;
  const validContentPattern = /^(?:(\d+(\.\d+)*)\s+(.*))/gm
  const matches = contents.matchAll(validContentPattern);
  const root = buildTree(contents, Array.from(matches));
  
  // Write the tree
  //const fs = require('fs');
  //const file = fs.createWriteStream("The tree 2.txt", { encoding: 'utf-8' });
  
  
const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    // Append the svg object to the body of the page
const svg = d3.select("#chart")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Sample data
const data = root;

// X axis
const x = d3.scaleLinear()
.domain([0, d3.max(data, d => d.value)])
.range([ 0, width]);
svg.append("g")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Y axis
const y = d3.scaleBand()
.range([ 0, height ])
.domain(data.map(d => d.country))
.padding(.1);
svg.append("g")
.call(d3.axisLeft(y));

// Bars
svg.selectAll("myRect")
.data(data)
.enter()
.append("rect")
.attr("x", x(0) )
.attr("y", d => y(d.country))
.attr("width", d => x(d.value))
.attr("height", y.bandwidth())
.attr("fill", "#69b3a2");