

        function CaminosHamiltonianos() {

            let grapho = graph;

            console.table(grapho)
            
            const paths = [];

                function backtrack(path) {
                const lastNode = path[path.length - 1];

                console.log("PRUEBA")
                console.log(lastNode)
                console.log(path)
                console.log(path.length)
            
                console.log(path.length === grapho.nodes.length)
                console.log(path[0]+"=="+ lastNode)
                console.log(path[0] === lastNode)

                // Si el camino es hamiltoniano y regresa al primer nodo
                if (path.length === grapho.nodes.length) {
                paths.push([...path]);
                return;
                }

                // Iterar sobre todos los nodos
                for (const node of grapho.nodes) {
                // Verificar si el nodo no está en el camino actual
                    if (!path.includes(node.id)) {
                // Verificar si hay una conexión entre el último nodo del camino y este nodo
                    const isConnected = grapho.links.some(link =>
                    (link.source.id === lastNode && link.target.id === node.id) ||
                    (link.source.id === node.id && link.target.id === lastNode)

                    );

                    console.log(isConnected)
                    if (isConnected) {
                    path.push(node.id);
                    backtrack(path);
                    path.pop();
                }
            }
        }
    }

    // Comenzar el backtracking desde cada nodo como punto de inicio
    for (const node of grapho.nodes) {
        backtrack([node.id]);
    }

    var container = document.getElementById('PanelCaminosHamiltonianos');
    container.innerHTML = "";
    container.display=""
    

    paths.forEach((path, index) => {
        const pathText = `Camino ${index + 1}: ${path.join(' -> ')}`;
        const pathElement = document.createElement('a');
        pathElement.href = "#";
        pathElement.textContent = pathText;
        pathElement.onclick = (e) => {
                    e.preventDefault();
                    highlightPath(path);
                };
        container.appendChild(pathElement);
        container.appendChild(document.createElement('br'));
    });

    container.style.display=""


    console.log(paths)
    return paths;

}

function CaminosEularianos() {

let container = document.getElementById('PanelCaminosHamiltonianos');
container.innerHTML = ''; // Limpiar contenido previo
container.display="";

if (!hasEulerianPath(graph)) {
    container.textContent = 'No hay camino euleriano en este grafo.';
    return;
}

const eulerianPath = getEulerianPath(graph);
const pathText = `Camino Euleriano: ${eulerianPath.join(' -> ')}`;
const pathElement = document.createElement('a');
pathElement.href = '#';
pathElement.textContent = pathText;
pathElement.onclick = (e) => {
    e.preventDefault();
    highlightPath(eulerianPath);
};

container.style.display=""

container.appendChild(pathElement);
}

// Verificar si un grafo tiene un camino euleriano
function hasEulerianPath({ nodes, links }) {
const degree = new Map(nodes.map(node => [node.id, 0]));

links.forEach(({ source, target }) => {
    degree.set(source.id, degree.get(source.id) + 1);
    degree.set(target.id, degree.get(target.id) + 1);
});

let oddCount = 0;
for (let d of degree.values()) {
    if (d % 2 !== 0) {
        oddCount++;
    }
}

return oddCount === 0 || oddCount === 2;
}

// Obtener un camino euleriano usando el algoritmo de Fleury
function getEulerianPath({ nodes, links }) {
const adjList = new Map(nodes.map(node => [node.id, []]));

links.forEach(({ source, target }) => {
    adjList.get(source.id).push(target.id);
    adjList.get(target.id).push(source.id);
});

const isBridge = (u, v) => {
    const visited = new Set();
    const dfs = (node) => {
        visited.add(node);
        adjList.get(node).forEach(neighbor => {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        });
    };

    dfs(v);
    return !visited.has(u);
};

const findStartNode = () => {
    for (let [node, neighbors] of adjList.entries()) {
        if (neighbors.length % 2 !== 0) {
            return node;
        }
    }
    return nodes[0].id;
};

const startNode = findStartNode();
const stack = [startNode];
const path = [];

while (stack.length > 0) {
    const node = stack[stack.length - 1];
    const neighbors = adjList.get(node);

    if (neighbors.length === 0) {
        path.push(stack.pop());
    } else {
        const nextNode = neighbors.pop();
        if (adjList.get(nextNode).includes(node) && !isBridge(node, nextNode)) {
            stack.push(nextNode);
            adjList.get(nextNode).splice(adjList.get(nextNode).indexOf(node), 1);
        } else {
            neighbors.unshift(nextNode);
        }
    }
}

return path;
}

function highlightPath(path) {
            // Desmarcar todos los enlaces
            svg.selectAll(".link").classed("highlighted", false);

            // Marcar los enlaces del camino
            for (let i = 0; i < path.length - 1; i++) {
                svg.selectAll(".link")
                    .filter(d => (d.source.id === path[i] && d.target.id === path[i + 1]) ||
                                 (d.source.id === path[i + 1] && d.target.id === path[i]))
                    .classed("highlighted", true);
    }
}


