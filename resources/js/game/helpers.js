// show visibility or access as a single character at the beginning of each property or method
export function convertVisibility(v) {
    switch (v) {
        case 'public':
            return '+';
        case 'private':
            return '-';
        case 'protected':
            return '#';
        case 'package':
            return '~';
        default:
            return v;
    }
}

export function jsonToUmlXml(jsonData) {
    // Parsear el JSON
    const data = JSON.parse(jsonData);

    // Crear la estructura base del XML
    const xmlDoc = document.implementation.createDocument("http://schema.omg.org/spec/XMI/2.1", "xmi:XMI", null);
    const xmiRoot = xmlDoc.documentElement;
    xmiRoot.setAttribute("xmi:version", "2.1");
    xmiRoot.setAttribute("xmlns:uml", "http://schema.omg.org/spec/UML/2.1");

    // Crear la declaración de la versión y la codificación de XML
    const xmlDecl = xmlDoc.createProcessingInstruction('xml', 'version="1.0" encoding="windows-1252"');

    // Agregar la declaración al principio del documento
    xmlDoc.insertBefore(xmlDecl, xmlDoc.firstChild);

    // Crear la sección de documentación
    const documentation = xmlDoc.createElement("xmi:Documentation");
    documentation.setAttribute("exporter", "Enterprise Architect");
    documentation.setAttribute("exporterVersion", "6.5");
    documentation.setAttribute("exporterID", "1703");
    xmiRoot.appendChild(documentation);

    // Crear el modelo UML
    const model = xmlDoc.createElement("uml:Model");
    model.setAttribute("xmi:type", "uml:Model");
    model.setAttribute("name", "EA_Model");
    model.setAttribute("visibility", "public");
    xmiRoot.appendChild(model);

    // Crear el paquete principal
    const packageElement = xmlDoc.createElement("packagedElement");
    packageElement.setAttribute("xmi:type", "uml:Package");
    packageElement.setAttribute("xmi:id", "EAPK_8A3A597B_DB0A_80ED_93A1_E64BE695BC9C");
    packageElement.setAttribute("name", "Starter Class Diagram");
    packageElement.setAttribute("visibility", "public");
    model.appendChild(packageElement);

    // Iterar sobre las clases en el JSON y añadirlas al XML
    data.nodeDataArray.forEach((node, index) => {
        const classElement = xmlDoc.createElement("packagedElement");
        classElement.setAttribute("xmi:type", "uml:Class");
        classElement.setAttribute("xmi:id", `EAID_${index}`);
        classElement.setAttribute("name", node.name);
        classElement.setAttribute("visibility", "public");
        packageElement.appendChild(classElement);
    });


    // Crear la sección de diagramas (extensión)
    const extension = xmlDoc.createElement("xmi:Extension");
    extension.setAttribute("extender", "Enterprise Architect");
    extension.setAttribute("extenderID", "6.5");
    xmiRoot.appendChild(extension);

    const diagrams = xmlDoc.createElement("diagrams");
    extension.appendChild(diagrams);

    const diagram = xmlDoc.createElement("diagram");
    diagram.setAttribute("xmi:id", "EAID_853285F9_0EC0_338D_8289_3F0ACF7429D5");
    diagrams.appendChild(diagram);

    const modelElement = xmlDoc.createElement("model");
    modelElement.setAttribute("package", "EAPK_8A3A597B_DB0A_80ED_93A1_E64BE695BC9C");
    modelElement.setAttribute("localID", "2");
    modelElement.setAttribute("owner", "EAPK_8A3A597B_DB0A_80ED_93A1_E64BE695BC9C");
    diagram.appendChild(modelElement);

    const properties = xmlDoc.createElement("properties");
    properties.setAttribute("name", "Starter Class Diagram");
    properties.setAttribute("type", "Logical");
    diagram.appendChild(properties);

    const project = xmlDoc.createElement("project");
    project.setAttribute("author", "HP");
    project.setAttribute("version", "1.0");
    project.setAttribute("created", new Date().toISOString());
    project.setAttribute("modified", new Date().toISOString());
    diagram.appendChild(project);

    // Serializar el XML a string
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);

    // Retornar el XML como string
    return xmlString;
}


export function descargarArchivoXMI(jsonData) {
    const json = jsonData;

    console.log(json);

    // Crear la estructura básica del XMI
    let xmi = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmi += '<xmi:XMI xmlns:xmi="http://schema.omg.org/spec/XMI/2.1" xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.1">\n';
    xmi += '    <xmi:Documentation exporter="Enterprise Architect" exporterVersion="6.5" exporterID="1703"/>\n';
    xmi += '    <uml:Model xmi:type="uml:Model" name="EA_Model" visibility="public">\n';
    xmi += '        <packagedElement xmi:type="uml:Package" xmi:id="EAPK_938B7243_54A0_D851_80EC_CEEBC16C26A5" name="Diagrama de Clases" visibility="public">\n';
    // Convertir nodos GoJS a clases UML
    json.nodeDataArray.forEach(node => {
        // Añadir la clase
        xmi += `            <packagedElement xmi:type="uml:Class" xmi:id="${node.key}" name="${node.name}" visibility="public">\n`;
        
        // Añadir propiedades
        if (node.properties && Array.isArray(node.properties) && node.properties.length > 0) {
            node.properties.forEach(property => {
                const visibility = property.visibility || "public"; // Default visibility
                const type = property.type || "String"; // Default type
                xmi += `      <ownedAttribute xmi:id="${node.key}_${property.name}" name="${property.name}" visibility="${visibility}">\n`;
                xmi += `        <type xmi:type="uml:PrimitiveType" href="http://www.omg.org/spec/UML/20090901/PrimitiveTypes.xml#${type}"/>\n`;
                xmi += '      </ownedAttribute>\n';
            });
        }

        // Añadir métodos
        if (node.methods && Array.isArray(node.methods) && node.methods.length > 0) {
            node.methods.forEach(method => {
                const visibility = method.visibility || "private"; // Default visibility
                const returnType = method.type || "void"; // Default return type

                xmi += `      <ownedOperation xmi:id="${node.key}_${method.name}" name="${method.name}" visibility="${visibility}">\n`;

                // Añadir parámetros
                if (method.parameters && Array.isArray(method.parameters) && method.parameters.length > 0) {
                    method.parameters.forEach(param => {
                        xmi += `        <ownedParameter xmi:id="${node.key}_${method.name}_${param.name}" name="${param.name}" direction="in">\n`;
                        xmi += `          <type xmi:type="uml:PrimitiveType" href="http://www.omg.org/spec/UML/20090901/PrimitiveTypes.xml#${param.type || 'String'}"/>\n`;
                        xmi += '        </ownedParameter>\n';
                    });
                }

                // Añadir tipo de retorno
                xmi += `        <ownedParameter xmi:id="${node.key}_${method.name}_return" direction="return" name="return">\n`;
                xmi += `          <type xmi:type="uml:PrimitiveType" href="http://www.omg.org/spec/UML/20090901/PrimitiveTypes.xml#${returnType}"/>\n`;
                xmi += '        </ownedParameter>\n';
                xmi += '      </ownedOperation>\n';
            });
        }

        xmi += '            </packagedElement>\n';
    });

    const crearEnlaceXMI = (link, fromNode, toNode) => {
        let enlaceXMI = '';

        switch (link.category) {
            case 'Association':
            case 'Aggregation':
            case 'Composition': {
                let aggregationType = '';
                if (link.category === 'Aggregation') {
                    aggregationType = 'shared'; // Agregación
                } else if (link.category === 'Composition') {
                    aggregationType = 'composite'; // Composición
                }

                // Asociación estándar, composición o agregación
                enlaceXMI = `    <packagedElement xmi:type="uml:Association" xmi:id="${link.key}" name="${link.centerLabel || 'Association_' + link.key}">\n`;
                enlaceXMI += `      <memberEnd xmi:idref="${link.key}_from"/>\n`;
                enlaceXMI += `      <memberEnd xmi:idref="${link.key}_to"/>\n`;

                // Definir el extremo del fromNode  sin agregación o composición
                enlaceXMI += `      <ownedEnd xmi:id="${link.key}_from" type="${fromNode.key}" visibility="public" navigable="true" >\n`;
                enlaceXMI += `        <role name="${link.startLabel || ''}"/>\n`;
                enlaceXMI += `        <type xmi:type="uml:Class" href="#${fromNode.key}"/>\n`;
                enlaceXMI += '      </ownedEnd>\n';

                // Definir el extremo del toNode con agregación o composición
                enlaceXMI += `      <ownedEnd xmi:id="${link.key}_to" type="${toNode.key}" visibility="public" navigable="true" ${aggregationType ? `aggregation="${aggregationType}"` : ''}>\n`;
                enlaceXMI += `        <role name="${link.endLabel || ''}"/>\n`;
                enlaceXMI += `        <type xmi:type="uml:Class" href="#${toNode.key}"/>\n`;
                enlaceXMI += '      </ownedEnd>\n';

                enlaceXMI += '    </packagedElement>\n';
                break;
            }

            case 'Generalization': {
                fromNode.key
                // Relación de herencia (Generalization) anidada dentro de la clase "specific" (toNode)
                enlaceXMI = `    <packagedElement xmi:type="uml:Class" xmi:id="${fromNode.key}" name="${fromNode.key}">\n`;
                enlaceXMI += `      <generalization xmi:id="${link.key}" general="${toNode.key}"/>\n`;
                enlaceXMI += '    </packagedElement>\n';
                break;
            }

            case 'Realization': {
                // Relación de realización (una clase realiza una interfaz)
                enlaceXMI = `    <packagedElement xmi:type="uml:Realization" xmi:id="${link.key}" client="${fromNode.key}" supplier="${toNode.key}"/>\n`;
                break;
            }

            case 'Dependency': {
                // Relación de dependencia
                enlaceXMI = `    <packagedElement xmi:type="uml:Dependency" xmi:id="${link.key}" client="${fromNode.key}" supplier="${toNode.key}"/>\n`;
                break;
            }



            case 'AssociationClass': {
                // Relación de clase de asociación
                enlaceXMI = `    <packagedElement xmi:type="uml:AssociationClass" xmi:id="${link.key}" name="${link.namee || 'AssociationClass_' + link.key}">\n`;

                // Definir los extremos (memberEnd y ownedEnd)
                enlaceXMI += `      <memberEnd xmi:idref="${link.key}_from"/>\n`;
                enlaceXMI += `      <memberEnd xmi:idref="${link.key}_to"/>\n`;

                enlaceXMI += `      <ownedEnd xmi:id="${link.key}_from" type="${fromNode.key}" visibility="public" navigable="true">\n`;
                enlaceXMI += `        <role name="${link.startLabel || ''}"/>\n`;
                enlaceXMI += `        <type xmi:type="uml:Class" href="#${fromNode.key}"/>\n`;
                enlaceXMI += '      </ownedEnd>\n';

                enlaceXMI += `      <ownedEnd xmi:id="${link.key}_to" type="${toNode.key}" visibility="public" navigable="true">\n`;
                enlaceXMI += `        <role name="${link.endLabel || ''}"/>\n`;
                enlaceXMI += `        <type xmi:type="uml:Class" href="#${toNode.key}"/>\n`;
                enlaceXMI += '      </ownedEnd>\n';

                //enlaceXMI += `        <centerLabel name="${link.centerLabel || ' '}"/>\n`;

                // Añadir propiedades para la AssociationClass
                if (link.properties && Array.isArray(link.properties) && link.properties.length > 0) {
                    link.properties.forEach(property => {
                        const visibility = property.visibility || "public"; // Default visibility
                        const type = property.type || "String"; // Default type
                        enlaceXMI += `      <ownedAttribute xmi:id="${link.key}_${property.name}" name="${property.name}" visibility="${visibility}">\n`;
                        enlaceXMI += `        <type xmi:type="uml:PrimitiveType" href="http://www.omg.org/spec/UML/20090901/PrimitiveTypes.xml#${type}"/>\n`;
                        enlaceXMI += '      </ownedAttribute>\n';
                    });
                }

                // Añadir métodos para la AssociationClass
                if (link.methods && Array.isArray(link.methods) && link.methods.length > 0) {
                    link.methods.forEach(method => {
                        const visibility = method.visibility || "private"; // Default visibility
                        const returnType = method.type || "void"; // Default return type

                        enlaceXMI += `      <ownedOperation xmi:id="${link.key}_${method.name}" name="${method.name}" visibility="${visibility}">\n`;

                        // Añadir parámetros
                        if (method.parameters && Array.isArray(method.parameters) && method.parameters.length > 0) {
                            method.parameters.forEach(param => {
                                enlaceXMI += `        <ownedParameter xmi:id="${link.key}_${method.name}_${param.name}" name="${param.name}" direction="in">\n`;
                                enlaceXMI += `          <type xmi:type="uml:PrimitiveType" href="http://www.omg.org/spec/UML/20090901/PrimitiveTypes.xml#${param.type || 'String'}"/>\n`;
                                enlaceXMI += '        </ownedParameter>\n';
                            });
                        }

                        // Añadir tipo de retorno
                        enlaceXMI += `        <ownedParameter xmi:id="${link.key}_${method.name}_return" direction="return" name="return">\n`;
                        enlaceXMI += `          <type xmi:type="uml:PrimitiveType" href="http://www.omg.org/spec/UML/20090901/PrimitiveTypes.xml#${returnType}"/>\n`;
                        enlaceXMI += '        </ownedParameter>\n';
                        enlaceXMI += '      </ownedOperation>\n';
                    });
                }

                enlaceXMI += '    </packagedElement>\n';
                break;
            }

            default: {
                console.warn(`Tipo de enlace desconocido: ${link.category}`);
                break;
            }
        }

        return enlaceXMI;
    };


    // Añadir enlaces (asociaciones)
    /*if (json.linkDataArray && Array.isArray(json.linkDataArray)) {
        json.linkDataArray.forEach(link => {
            const fromNode = json.nodeDataArray.find(node => node.key === link.from);
            const toNode = json.nodeDataArray.find(node => node.key === link.to);

            if (fromNode && toNode) {
                xmi += crearEnlaceXMI(link, fromNode, toNode);
            } else {
                console.warn(`Enlace ${link.key} tiene nodos inválidos: from=${link.from}, to=${link.to}`);
            }
        });
    }*/

    xmi += '        </packagedElement>\n';
    xmi += '    </uml:Model>\n';
    xmi += '</xmi:XMI>';

    // Crear un Blob con el XMI y el tipo MIME adecuado
    const blob = new Blob([xmi], { type: 'application/xml' });

    // Crear una URL para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagrama.xmi'; // Nombre del archivo XMI
    link.click(); // Simula un clic en el enlace para iniciar la descarga

    // Limpia el enlace temporal
    window.URL.revokeObjectURL(url);
}

