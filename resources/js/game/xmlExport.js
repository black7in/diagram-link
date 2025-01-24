// funcion para generar un id unico
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

const idIndex = generateId();

const diagramName = 'Class Diagram';

// funcion para exportar el xml
export function exportXML(json) {
    const xmlHeader = `<?xml version="1.0" encoding="windows-1252" standalone="no" ?>\n<XMI xmi.version="1.1" xmlns:UML="omg.org/UML1.3" timestamp="${new Date().toISOString()}">\n
      <XMI.header>\n<XMI.documentation>\n<XMI.exporter>Enterprise Architect</XMI.exporter>\n<XMI.exporterVersion>2.5</XMI.exporterVersion>\n<XMI.exporterID>0001</XMI.exporterID>\n</XMI.documentation>\n</XMI.header>
    `;

    const xmlFooter = `\n</XMI.content>\n<XMI.difference/>\n<XMI.extensions xmi.extender="Enterprise Architect 2.5"/>\n</XMI>`;


    const modelSection = `
    <XMI.content>
        <UML:Model name="EA Model" xmi.id="MX_EAID_${idIndex}">
            <UML:Namespace.ownedElement>
                <UML:Class name="EARootClass" xmi.id="EAID_${idIndex}" isRoot="true" isLeaf="false" isAbstract="false"/>
                <UML:Package name="${diagramName}" xmi.id="EAPK_${idIndex}" isRoot="false" isLeaf="false" isAbstract="false" visibility="public">
                    <UML:ModelElement.taggedValue>
                        <UML:TaggedValue tag="parent" value="EAPK_${idIndex}"/>
                        <UML:TaggedValue tag="created" value="${new Date().toISOString()}"/>
                        <UML:TaggedValue tag="modified" value="${new Date().toISOString()}"/>
                        <UML:TaggedValue tag="iscontrolled" value="FALSE"/>
                        <UML:TaggedValue tag="version" value="1.0"/>
                        <UML:TaggedValue tag="author" value="Desconocido"/>
                        <UML:TaggedValue tag="complexity" value="1"/>
                        <UML:TaggedValue tag="status" value="Proposed"/>
                    </UML:ModelElement.taggedValue>
                    <UML:Namespace.ownedElement>
                        ${generateClassesXML(json.nodeDataArray)}
                    </UML:Namespace.ownedElement>
                </UML:Package>
                <UML:DataType xmi.id="eaxmiid0" name="string" visibility="private" isRoot="false" isLeaf="false" isAbstract="false"/>
            </UML:Namespace.ownedElement>
        </UML:Model>
        ${generateDiagramXMLSection(json.nodeDataArray)}
  `;

    const completeXML = xmlHeader + modelSection + xmlFooter;

    // Crear un Blob con el XMI y el tipo MIME adecuado
    const blob = new Blob([completeXML], { type: 'application/xml' });

    // Crear una URL para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagrama.xml'; // Nombre del archivo XMI
    link.click(); // Simula un clic en el enlace para iniciar la descarga

    // Limpia el enlace temporal
    window.URL.revokeObjectURL(url);
}


// Función para generar las clases
function generateAttributesXML(attributes) {
    return attributes
        .map(
            (attr) => `
          <UML:Attribute name="${attr.name}" visibility="${attr.visibility}" type="${attr.type}">
              <UML:ModelElement.taggedValue>
				<UML:TaggedValue tag="type" value="Integer"/>
				<UML:TaggedValue tag="containment" value="Not Specified"/>
				<UML:TaggedValue tag="ordered" value="0"/>
				<UML:TaggedValue tag="static" value="0"/>
				<UML:TaggedValue tag="collection" value="false"/>
				<UML:TaggedValue tag="position" value="0"/>
				<UML:TaggedValue tag="lowerBound" value="1"/>
				<UML:TaggedValue tag="upperBound" value="1"/>
				<UML:TaggedValue tag="duplicates" value="0"/>
				<UML:TaggedValue tag="ea_guid" value="{B5B51FB1-97FC-4010-B84C-81D8D47E1F68}"/>
				<UML:TaggedValue tag="ea_localid" value="20"/>
				<UML:TaggedValue tag="styleex" value="volatile=0;"/>              </UML:ModelElement.taggedValue>
          </UML:Attribute>
        `
        )
        .join("\n");
}

function generateMethodsXML(methods) {
    return methods
        .map(
            (method) => `
          <UML:Operation name="${method.name}" visibility="${method.visibility}" returnType="${method.type}">
              <UML:ModelElement.taggedValue>
                  <UML:TaggedValue tag="isSpecification" value="false"/>
                  <UML:TaggedValue tag="ea_stype" value="Operation"/>
                  <UML:TaggedValue tag="ea_ntype" value="0"/>
                  <UML:TaggedValue tag="version" value="1.0"/>
                  <UML:TaggedValue tag="date_created" value="${new Date().toISOString()}"/>
                  <UML:TaggedValue tag="date_modified" value="${new Date().toISOString()}"/>
              </UML:ModelElement.taggedValue>
          </UML:Operation>
        `
        )
        .join("\n");
}

function generateClassesXML(nodeDataArray) {
    return nodeDataArray
        .map(
            (cls) => `
          <UML:Class name="${cls.name}" xmi.id="EAID_${cls.key}" visibility="public" namespace="EAPK_${cls.key}" isRoot="false" isLeaf="false" isAbstract="false" isActive="false">
              <UML:ModelElement.taggedValue>
                  <UML:TaggedValue tag="isSpecification" value="false"/>
                  <UML:TaggedValue tag="ea_stype" value="Class"/>
                  <UML:TaggedValue tag="ea_ntype" value="0"/>
                  <UML:TaggedValue tag="version" value="1.0"/>
                  <UML:TaggedValue tag="package" value="EAPK_${idIndex}"/>
                  <UML:TaggedValue tag="date_created" value="${new Date().toISOString()}"/>
                  <UML:TaggedValue tag="date_modified" value="${new Date().toISOString()}"/>
                  <UML:TaggedValue tag="gentype" value="Java"/>
                  <UML:TaggedValue tag="tagged" value="0"/>
                  <UML:TaggedValue tag="package_name" value="${diagramName}"/>
                  <UML:TaggedValue tag="phase" value="1.0"/>
                  <UML:TaggedValue tag="author" value="Desconocido"/>
                  <UML:TaggedValue tag="complexity" value="1"/>
                  <UML:TaggedValue tag="product_name" value="Java"/>
                  <UML:TaggedValue tag="status" value="Proposed"/>
                  <UML:TaggedValue tag="tpos" value="0"/>
                  <UML:TaggedValue tag="ea_localid" value="331"/>
                  <UML:TaggedValue tag="ea_eleType" value="element"/>
                  <UML:TaggedValue tag="style" value="BackColor=-1;BorderColor=-1;BorderWidth=-1;FontColor=-1;VSwimLanes=1;HSwimLanes=1;BorderStyle=0;"/>
              </UML:ModelElement.taggedValue>
              <UML:Classifier.feature>
                  ${generateAttributesXML(cls.properties)}
                  ${generateMethodsXML(cls.methods)}
              </UML:Classifier.feature>
          </UML:Class>
        `
        )
        .join("\n");
}


function generateDiagramElementsXML(nodeDataArray) {
    return nodeDataArray
        .map(
            (node, index) => {
                const [left, top] = node.location.split(' ').map(Number);
                const right = left + 100; // Ajusta según el tamaño de tu nodo
                const bottom = top + 50; // Ajusta según el tamaño de tu nodo
                return `
                <UML:DiagramElement geometry="Left=${left};Top=${top};Right=${right};Bottom=${bottom};" subject="EAID_${node.key}" seqno="${index + 1}" style="ImageID=0;DUID=EF849392;"/>
                `;
            }
        )
        .join("\n");
}

function generateDiagramXMLSection(nodeDataArray) {
    return `
        <UML:Diagram name="${diagramName}" xmi.id="${idIndex}" diagramType="ClassDiagram" owner="EAPK_${idIndex}" toolName="Enterprise Architect 2.5">
            <UML:ModelElement.taggedValue>
                <UML:TaggedValue tag="version" value="1.0"/>
                <UML:TaggedValue tag="author" value="Desconocido"/>
                <UML:TaggedValue tag="created_date" value="${new Date().toISOString()}"/>
                <UML:TaggedValue tag="modified_date" value="${new Date().toISOString()}"/>
                <UML:TaggedValue tag="package" value="EAPK_${idIndex}"/>
                <UML:TaggedValue tag="type" value="Logical"/>
                <UML:TaggedValue tag="swimlanes" value="locked=false;orientation=0;width=0;inbar=false;names=false;color=-1;bold=false;fcol=0;tcol=-1;ofCol=-1;ufCol=-1;hl=0;ufh=0;hh=0;cls=0;bw=0;hli=0;bro=0;SwimlaneFont=lfh:-13,lfw:0,lfi:0,lfu:0,lfs:0,lfface:Calibri,lfe:0,lfo:0,lfchar:1,lfop:0,lfcp:0,lfq:0,lfpf=0,lfWidth=0;"/>
                <UML:TaggedValue tag="matrixitems" value="locked=false;matrixactive=false;swimlanesactive=true;kanbanactive=false;width=1;clrLine=0;"/>
                <UML:TaggedValue tag="ea_localid" value="10"/>
                <UML:TaggedValue tag="EAStyle" value="ShowPrivate=1;ShowProtected=1;ShowPublic=1;HideRelationships=0;Locked=0;Border=1;HighlightForeign=1;PackageContents=1;SequenceNotes=0;ScalePrintImage=0;PPgs.cx=1;PPgs.cy=1;DocSize.cx=826;DocSize.cy=1169;ShowDetails=0;Orientation=P;Zoom=100;ShowTags=0;OpParams=1;VisibleAttributeDetail=0;ShowOpRetType=1;ShowIcons=1;CollabNums=0;HideProps=0;ShowReqs=0;ShowCons=0;PaperSize=9;HideParents=0;UseAlias=0;HideAtts=0;HideOps=0;HideStereo=0;HideElemStereo=0;ShowTests=0;ShowMaint=0;ConnectorNotation=UML 2.1;ExplicitNavigability=0;ShowShape=1;AllDockable=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;m_bElementClassifier=1;SPT=1;ShowNotes=0;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;"/>
                <UML:TaggedValue tag="styleex" value="SaveTag=B843BB67;ExcludeRTF=0;DocAll=0;HideQuals=0;AttPkg=1;ShowTests=0;ShowMaint=0;SuppressFOC=1;MatrixActive=0;SwimlanesActive=1;KanbanActive=0;MatrixLineWidth=1;MatrixLineClr=0;MatrixLocked=0;TConnectorNotation=UML 2.1;TExplicitNavigability=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;m_bElementClassifier=1;SPT=1;MDGDgm=;STBLDgm=;ShowNotes=0;VisibleAttributeDetail=0;ShowOpRetType=1;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;SuppressedCompartments=;Theme=:119;"/>
            </UML:ModelElement.taggedValue>
            <UML:Diagram.element>
                ${generateDiagramElementsXML(nodeDataArray)}
            </UML:Diagram.element>
        </UML:Diagram>
    `;
}