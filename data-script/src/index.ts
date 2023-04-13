
import * as fs from 'fs';
import * as path from 'path';

type NestedObjectType = {
  [key: string]: string | NestedObjectType | undefined;
}


// function readDirRecursive(dir: string) {
//   const basePath = "/Users/hbarve1/codes/";

//   const graph: {
//     nodes: { filePath: string }[];
//     edges: { from: string; to: string }[];
//   } = {
//     nodes: [],
//     edges: [],
//   };
//   let obj: NestedObjectType = {};

//   let files = fs.readdirSync(dir);
//   // filter 'node_modules' and '.git' directories
//   files = files.filter((file) =>
//       file !== 'node_modules' &&
//       file !== '.git' &&
//       file !== '.DS_Store' &&
//       file !== 'dist' &&
//       file !== 'build' &&
//       file !== 'coverage' &&
//       file !== 'data' &&
//       file !== 'data-script' &&
//       file !== ".vscode"
//   );
//   // console.log(files);

//   for (let file of files) {
//     const filePath = path.join(dir, file);
//     const stat = fs.statSync(filePath);
//     const dirName = filePath.replace(basePath, '');
//     const arr = dirName.split('/');
//     // if (!obj[dir]) {
//     //   obj[dir] = {};
//     // }

//     let prev = null
//     for (let i = 0; i < arr.length; i++) {
//       const dir = arr[i];
//       if (i === 0) {
//         if (!obj[dir]) {
//           obj[dir] = {};
//         }
//         prev = obj[dir];
//       }

//     }

//     if (stat.isDirectory()) {
//       console.log(filePath
//         .replace(basePath, '')
//         .split('/'));
//       // graph.nodes.push({
//       //   filePath: filePath.replace(basePath, ''),
//       // });
//       readDirRecursive(filePath);
//     } else {
//       // console.log(filePath);
//       // Do something with the file
//     }
//   }

//   return obj;
//   return graph;
// }

// // Call the function with the directory path you want to read
// const res = readDirRecursive(path.join(__dirname, '../..'));

// console.dir(res, { depth: null });

// const fs = require('fs');
// const path = require('path');
const { Graph } = require('graphlib');

function readDirRecursive(dir: any, graph: any) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const nodeId = path.basename(filePath);

    if (stat.isDirectory()) {
      const subgraph = new Graph();
      graph.setNode(nodeId, subgraph);
      graph.setEdge(path.basename(dir), nodeId);
      readDirRecursive(filePath, subgraph);
    } else {
      graph.setNode(nodeId);
      graph.setEdge(path.basename(dir), nodeId);
    }
  });
}

const basePathToRead = path.join(__dirname, '../..')
// Call the function with the directory path you want to read
const graph = new Graph();
graph.setNode(path.basename(basePathToRead));
readDirRecursive(basePathToRead, graph);

console.log(graph.nodes());
console.log(graph.edges());

async function writeDataToFile(path: string, data: any) {
  try {
    const jsonString = JSON.stringify(data);
    await fs.promises.writeFile(path, jsonString);
    console.log('Data written to file');
  } catch (error) {
    console.error(error);
    // Handle the error as needed
  }
}

writeDataToFile(
  path.join(__dirname, '../out/graph.json'),
  {
  nodes: graph.nodes(),
  edges: graph.edges(),
});
