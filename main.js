let aux = 0;
const svgWidth = 1200;
const svgHeight = 700;
const nodeRadius = 20;

const xMin = nodeRadius;
const xMax = svgWidth - nodeRadius;
const yMin = nodeRadius;
const yMax = svgHeight - nodeRadius;  
  
const graph = {
    nodes: [{ id: "A" },
        { id: "B" },
        { id: "C" },
        { id: "D" },
        { id: "E" }],
    links: [{ source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "C", target: "D" },
        { source: "D", target: "E" }]
};

const svg = d3.select("svg");

let simulation = d3.forceSimulation(graph.nodes)
    .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(600, 350));

    let links = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");

    let nodes = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging));

    nodes.append("circle")
    .attr("r", 20);

    nodes.append("text")
    .text(d => d.id)
    .attr("text-anchor", "middle")
    .attr("dy", 5);





function createGraph(){

    const nodeCount = parseInt(document.getElementById("nodeCount").value);
    const connectionType = document.getElementById("connectionType").value;

    console.log(nodeCount)
    console.log(connectionType)
    svg.selectAll("*").remove();

    graph.nodes = d3.range(nodeCount).map(i => ({ id: "N" + i })); // Usar cadenas únicas como identificadores

    graph.links = [];
    if (connectionType === "random") {
        // Conexiones aleatorias entre nodos
        for (let i = 0; i < nodeCount; i++) {
            const sourceIndex = i;
            let targetIndex;
            do {
                targetIndex = Math.floor(Math.random() * nodeCount);
            } while (targetIndex === sourceIndex);
            graph.links.push({ source: "N" + sourceIndex, target: "N" + targetIndex });
        }
    } else if (connectionType === "fullyConnected") {
        // Todos los nodos conectados entre sí
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                graph.links.push({ source: "N" + i, target: "N" + j });
            }
        }
    }

    // Dibujar el grafo
    drawGraph();
    var div = document.getElementById("configPanel");
    div.style.display = "none";
    var div = document.getElementById("configPanel2");
    div.style.display = "";
    updateNodeOptions()

}

function updateNodeOptions() {
    const nodeOptions = graph.nodes.map(node => node.id);
    d3.select("#sourceNode").selectAll("option").remove();
    d3.select("#targetNode").selectAll("option").remove();

    d3.select("#sourceNode").selectAll("option")
        .data(nodeOptions)
        .enter().append("option")
        .text(d => d);

    d3.select("#targetNode").selectAll("option")
        .data(nodeOptions)
        .enter().append("option")
        .text(d => d);
}

function addManualConnection() {
    const sourceNode = document.getElementById("sourceNode").value;
    const targetNode = document.getElementById("targetNode").value;

    // Verificar si la conexión ya existe
    const existingConnection = graph.links.find(link =>
        (link.source === sourceNode && link.target === targetNode) ||
        (link.source === targetNode && link.target === sourceNode));

    if (!existingConnection && sourceNode !== targetNode) {
        graph.links.push({ source: ""+sourceNode, target: ""+targetNode });

        console.log(links)
        // Redibujar el grafo con la nueva conexión
        drawGraph();
    } else {
        alert("La conexión ya existe o no se puede conectar un nodo consigo mismo.");
    }
}



function drawGraph() {

    svg.selectAll("*").remove();

    simulation = d3.forceSimulation(graph.nodes)
    .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-70))
    .force("center", d3.forceCenter(600, 350));

    links = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");

    nodes = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging));

nodes.append("circle")
    .attr("r", 20);

nodes.append("text")
    .text(d => d.id)
    .attr("text-anchor", "middle")
    .attr("dy", 5);

    simulation.on("tick", () => {

        graph.nodes.forEach(node => {
        // Limitar la posición x dentro de los límites
        node.x = Math.max(xMin, Math.min(xMax, node.x));
        // Limitar la posición y dentro de los límites
        node.y = Math.max(yMin, Math.min(yMax, node.y));
    });

    links
        .attr("x1", d => d.source.x)
        //console.log(d.source.x)
        .attr("y1", d => d.source.y)
        //console.log(d.source.y)
        .attr("x2", d => d.target.x)
        //console.log(d.target.x)
        .attr("y2", d => d.target.y);
        //console.log(d.target.y)

    nodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

}

function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragging(event, d) {
    d.fx = Math.max(nodeRadius, Math.min(svgWidth - nodeRadius, event.x)); // Limitar dentro del ancho del SVG
    d.fy = Math.max(nodeRadius, Math.min(svgHeight - nodeRadius, event.y)); // Limitar dentro de la altura del SVG
}

function markEdges() {
    if(aux==0){
        links.classed("marked", true);
        aux++;
    }else{
        links.classed("marked", false);
        aux--;
    }
}

function markVertices(){
    if(aux==0){
        nodes.classed("marked-node", true);
        aux++;
    }else{
        nodes.classed("marked-node", false);
        aux--;
    }

}

function editEdges(){
    var div = document.getElementById("configPanel2");
    div.style.display = "";
}


simulation.on("tick", () => {

    graph.nodes.forEach(node => {
// Limitar la posición x dentro de los límites
node.x = Math.max(xMin, Math.min(xMax, node.x));
// Limitar la posición y dentro de los límites
node.y = Math.max(yMin, Math.min(yMax, node.y));
});
    links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

function removepanel(){
    var div = document.getElementById("configPanel2");
    div.style.display = "none";
}
function removepanel2(){
    var div = document.getElementById("configPanel");
    div.style.display = "none";
}

function stopSimulation(){

    simulation.stop();

    links
        .attr("x1", d => d.source.x)
        //console.log(d.source.x)
        .attr("y1", d => d.source.y)
        //console.log(d.source.y)
        .attr("x2", d => d.target.x)
        //console.log(d.target.x)
        .attr("y2", d => d.target.y);
        //console.log(d.target.y)

        nodes
        .attr("transform", d => `translate(${d.x},${d.y})`);
}

function goSimulation(){

    graph.nodes.forEach(node => {
        node.fx = null;
        node.fy = null;
    });

    simulation.alpha(0.3)
    simulation.restart()



}

function createNode(){
    var div = document.getElementById("configPanel");
    div.style.display = "";
}

function generateAdjacencyMatrix() {
    const n = graph.nodes.length;
    const adjacencyMatrix = Array.from(Array(n), () => Array(n).fill(0));

    console.table(links)
    graph.links.forEach(link => {
    const sourceIndex = nodes.indexOf(links.source);
    const targetIndex = nodes.indexOf(links.target);
    adjacencyMatrix[sourceIndex][targetIndex] = 1;
    adjacencyMatrix[targetIndex][sourceIndex] = 1; // Si es un grafo no dirigido
    });

    console.log("Matriz");
    console.table(adjacencyMatrix)
}

function borrarGrafo (){

    svg.selectAll("*").remove()
    

}
