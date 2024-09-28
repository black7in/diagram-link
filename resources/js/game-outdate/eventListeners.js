export function addEventListeners(myDiagram) {
    const cxCommand = (event, val) => {
        if (val === undefined) val = event.currentTarget.id;
        const diagram = myDiagram;

        switch (val) {
            case 'printname': logNodeName(event, diagram); break;
            case 'attributepublic': addAttribute(event, diagram, 'public'); break;
            case 'attributeprivate': addAttribute(event, diagram, 'private'); break;
            case 'methodpublic': addMethod(event, diagram, 'public'); break;
            // Otros comandos...
        }
        diagram.currentTool.stopTool();
    };

    function logNodeName(event, diagram) {
        const node = diagram.selection.first();
        if (node !== null) console.log(`Nombre de la clase: ${node.data.name}`);
    }

    function addAttribute(event, diagram, visibility) {
        const node = diagram.selection.first();
        if (node) {
            diagram.startTransaction('add property');
            const properties = node.data.properties || [];
            const newProperty = { name: 'newProperty', type: 'String', visibility };
            diagram.model.insertArrayItem(properties, -1, newProperty);
            diagram.commitTransaction('add property');
        }
    }

    function addMethod(event, diagram, visibility) {
        const node = diagram.selection.first();
        if (node) {
            diagram.startTransaction('add method');
            const methods = node.data.methods || [];
            const newMethod = { name: 'newMethod', parameters: [], visibility };
            diagram.model.insertArrayItem(methods, -1, newMethod);
            diagram.commitTransaction('add method');
        }
    }
}
