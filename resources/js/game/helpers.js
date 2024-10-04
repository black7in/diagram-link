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