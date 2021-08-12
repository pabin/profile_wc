  const nodes = [
    [312, 32, 99],
    [32, 38, 45],
    [39, 32, 135],
    [33, 39, 133],
    [34, 33, 45],
    [310, 33, 83],
    [36, 310, 113],
    [35, 34, 70],
    [315, 312, 78],
    [317, 36, 460],
    [320, 317, 117],
    [323, 34, 413],
    [325, 323, 2258],
    [38, 0, 0]
  ];

const getStartNodes = (nodes) => {
  const startNodes = [];
  nodes.forEach((node1) => {
    let nodeIsPresent = false;
    nodes.forEach((node2) => {
      if (node1[0] === node2[1]) nodeIsPresent = true;
    });

    if (!nodeIsPresent) startNodes.push(node1[0]);
  });

  return startNodes;
};

const getEndNode = (nodes) => {
  let endNode;
  nodes.forEach(nd => {
    if (nd[1] === 0 && nd[2] === 0) {
      endNode = nd;
    }
    const myNode = nodes.filter(n => nd[1] === n[0]);
    if (myNode.length === 0) endNode = nd;
  })
  return endNode;
}

const getSeperatedNodesWithLength = (nodes, startNodes, endNode) => {
  const separatedNodes = [];
  startNodes.forEach((sNode, index) => {
    let pathLength = 0;
    let pathNodes = [];

    let nodePathExist = true;
    let foundNodePath = [];
    foundNodePath = nodes.filter((n) => n[0] === sNode);

    if (!foundNodePath.length) nodePathExist = false;
    while (nodePathExist) {
      let pathToCheck = [...foundNodePath[0]];
      pathLength += pathToCheck[2];
      pathNodes.push(pathToCheck);

      foundNodePath = nodes.filter((n) => n[0] === pathToCheck[1]);
      if(!foundNodePath.length) nodePathExist = false;
    }
    separatedNodes.push({ id: index + 1 , pathLength, nodes: pathNodes });
  });

  return separatedNodes;
};

function isArrayInArray(arr, item){
  var item_as_string = JSON.stringify(item);

  var contains = arr.some(function(ele){
    return JSON.stringify(ele) === item_as_string;
  });
  return contains;
}

const getLongestPath = (seperatedNodes) => {
  let greatestLength = 0;
  seperatedNodes.forEach((n) => {
    if (greatestLength < n.pathLength) greatestLength = n.pathLength;
  })
  let longestPath = seperatedNodes.filter(sn => sn.pathLength === greatestLength)

  return longestPath[0];
}

const getNewSeperatedNodes = (seperatedNodes) => {
  const longestPath = getLongestPath(seperatedNodes);
  let newSeperatedNodes = [];

  let otherNodes = seperatedNodes.filter(sn => sn.id !== longestPath.id);
  otherNodes.forEach(sn => {
    let pathLength = 0
    const uniqueNodes = sn.nodes.filter(snn => !isArrayInArray(longestPath.nodes, snn))
    uniqueNodes.forEach(un => pathLength += un[2])
    newSeperatedNodes.push({ pathLength, id: sn.id, nodes: uniqueNodes})
  })
  return { longest: longestPath, other: newSeperatedNodes };
}

const groupNodesByCommonEndPoint = (seperatedNodes) => {
  let groupedNodes = []
  seperatedNodes.forEach(sn => {
    const lastNode1 = sn.nodes[sn.nodes.length - 1][1];
    const addedNodes = groupedNodes.filter(gpn => gpn.id === lastNode1);

    if (addedNodes.length < 1) {
      groupedNodes.push({id: lastNode1, nodes: sn.nodes })
    }
    if (addedNodes.length === 1) {
      let newNodes = sn.nodes.filter(n => !isArrayInArray(addedNodes[0].nodes, n))
      addedNodes[0].nodes.push(...newNodes);
    }
  })

  return groupedNodes;
}

const main = () => {
  const theFinalNodes = [];
  const checkUntilFinished = (nodes) => {

    const startNodes = getStartNodes(nodes);
    const endNode = getEndNode(nodes);

    const seperatedNodes = getSeperatedNodesWithLength(nodes, startNodes, endNode);

    const newSeperatedNodes = getNewSeperatedNodes(seperatedNodes);
    theFinalNodes.push(newSeperatedNodes.longest);

    if (newSeperatedNodes.other.length > 0) {
      const finalNodes = groupNodesByCommonEndPoint(newSeperatedNodes.other);

      finalNodes.forEach(finalNode => {
        checkUntilFinished(finalNode.nodes)
      })
    }
  }

  checkUntilFinished(nodes)

  console.log("theFinalNodes", JSON.stringify(theFinalNodes));
  return theFinalNodes;

}

main();