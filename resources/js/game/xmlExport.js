// Función para generar XML desde un JSON de clases

function generateID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
    }
    return `${s4()}${s4()}_${s4()}_${s4()}_${s4()}_${s4()}${s4()}${s4()}`;
}

function formatDate(date) {
    const pad = (num) => (num < 10 ? '0' + num : num);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Función para convertir el formato JSON a un formato de clase
function convertToClassFormat(json) {
    // Crear un mapa para almacenar las relaciones de clave antigua a nueva
    const keyMap = {};

    // Primero, transformamos los nodos
    json.nodeDataArray.forEach((node) => {
        const newKey = generateID(); // Generar un ID único para cada clase
        keyMap[node.key] = newKey;  // Mapeamos el key antiguo al nuevo key

        // Actualizamos el nodo con el nuevo key
        node.key = newKey;
        node.attributes = (node.properties && Array.isArray(node.properties)) ? node.properties.map((prop) => ({
            name: prop.name,
            type: prop.type || "Unknown", // Añadir tipo si lo hay
            visibility: prop.visibility || "public", // Añadir visibilidad si lo hay
        })) : [];
        node.methods = (node.methods || []).map((method) => ({
            name: method.name,
            returnType: method.returnType || "void",
        }));
    });

    // Ahora actualizamos los enlaces con los nuevos keys
    json.linkDataArray.forEach((link) => {
        link.from = keyMap[link.from]; // Reemplazamos el 'from' con el nuevo key
        link.to = keyMap[link.to]; // Reemplazamos el 'to' con el nuevo key
    });

    // Devolvemos el JSON actualizado
    return json;
}

function translateCoordinates(location) {
    // Extraer las coordenadas x y y
    let coords = location.split(" ");
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    // revisar x y y si alguno es negativo convertir a positivo
    if (x < 0) {
        x = x * -1;
    }
    if (y < 0) {
        y = y * -1;
    }
    x += 100;
    y += 100
    // Devolver las nuevas coordenadas en el primer plano
    return {
        x,
        y
    };
}

function diagramClassElementXML(classItem) {
    // iterar
    const ancho = 100;
    const alto = 100;
    let diagramClassElementXML = ``;
    classItem.forEach((classItem) => {
        let coords = translateCoordinates(classItem.location);
        let left = coords.x;
        let top = coords.y;
        let right = coords.x + ancho;
        let bottom = coords.y + alto;
        diagramClassElementXML += `\t\t\t\t<UML:DiagramElement geometry="Left=${left};Top=${top};Right=${right};Bottom=${bottom};" subject="EAID_${classItem.key}" seqno="1" style="ImageID=0;DUID=E90A46B2;"/>\n`;
    });
    return diagramClassElementXML;
}

function attributesXML(attributes) {
    let attributesXML = ``;
    if (!attributes) {
        console.log("No attributes available.");
        return;  // Detener la ejecución si 'attributes' no está definido
    }
    attributes.forEach((attr) => {
        attributesXML += `\t\t\t\t\t\t\t\t<UML:Attribute name="${attr.name}" changeable="none" visibility="${attr.visibility}" ownerScope="instance" targetScope="instance">
\t\t\t\t\t\t\t\t\t<UML:Attribute.initialValue>
\t\t\t\t\t\t\t\t\t</UML:Attribute.initialValue>
\t\t\t\t\t\t\t\t\t<UML:StructuralFeature.type>
\t\t\t\t\t\t\t\t\t\t<UML:Classifier xmi.idref="eaxmiid0"/>
\t\t\t\t\t\t\t\t\t</UML:StructuralFeature.type>
\t\t\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="type" value="int"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="derived" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="containment" value="Not Specified"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="length" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ordered" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="precision" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="scale" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="static" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="collection" value="false"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="position" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="lowerBound" value="1"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="upperBound" value="1"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="duplicates" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_guid" value="{${generateID()}}"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_localid" value="1"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="styleex" value="volatile=0;"/>
\t\t\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t</UML:Attribute>
`;
    });
    return attributesXML;
}

function methodsXML(methods) {
    let methodsXML = ``;
    if (!methods) {
        console.log("No methods available.");
        return;  // Detener la ejecución si 'methods' no está definido
    }
    methods.forEach((method) => {

        let idOp = generateID();

        methodsXML += `\t\t\t\t\t\t\t\t<UML:Operation name="${method.name}" visibility="public" ownerScope="instance" isQuery="false" concurrency="sequential">
\t\t\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="type" value="void"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="const" value="false"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="synchronised" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="concurrency" value="Sequential"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="position" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="returnarray" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="pure" value="0"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_guid" value="{AAB4C8B4-${idOp}}"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_localid" value="3"/>
\t\t\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t<UML:BehavioralFeature.parameter>
\t\t\t\t\t\t\t\t\t\t<UML:Parameter kind="return" visibility="public">
\t\t\t\t\t\t\t\t\t\t\t<UML:Parameter.type>
\t\t\t\t\t\t\t\t\t\t\t	<UML:Classifier xmi.idref="eaxmiid1"/>
\t\t\t\t\t\t\t\t\t\t\t</UML:Parameter.type>
\t\t\t\t\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="pos" value="0"/>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="type" value="void"/>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="const" value="0"/>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_guid" value="{RETURNID-${idOp}}"/>
\t\t\t\t\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t\t<UML:Parameter.defaultValue>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:Expression/>
\t\t\t\t\t\t\t\t\t\t\t</UML:Parameter.defaultValue>
\t\t\t\t\t\t\t\t\t\t</UML:Parameter>
\t\t\t\t\t\t\t\t\t\t<UML:Parameter name="Parameter A" kind="in" visibility="public">
\t\t\t\t\t\t\t\t\t\t\t<UML:Parameter.type>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:Classifier xmi.idref="eaxmiid2"/>
\t\t\t\t\t\t\t\t\t\t\t</UML:Parameter.type>
\t\t\t\t\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="pos" value="0"/>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="type" value="int"/>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="const" value="0"/>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_guid" value="{B95065FD-${generateID()}}"/>
\t\t\t\t\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t\t<UML:Parameter.defaultValue>
\t\t\t\t\t\t\t\t\t\t\t\t<UML:Expression/>
\t\t\t\t\t\t\t\t\t\t\t</UML:Parameter.defaultValue>
\t\t\t\t\t\t\t\t\t\t</UML:Parameter>
\t\t\t\t\t\t\t\t\t</UML:BehavioralFeature.parameter>
\t\t\t\t\t\t\t\t</UML:Operation>
`;
    });

    return methodsXML;
}

export function generateXML(json) {

    var xmiID = generateID();
    var diagramxmiID = generateID();

    const clases = convertToClassFormat(json);
    console.log(clases);

    var ownedElementXML = ``;

    clases.nodeDataArray.forEach((classItem) => {
        console.log(`Clase: ${classItem.name}`);
        console.log(`Key: ${classItem.key}`);

        ownedElementXML += `\t\t\t\t\t\t<UML:Class name="${classItem.name}" xmi.id="EAID_${classItem.key}" visibility="public" namespace="EAPK_${xmiID}" isRoot="false" isLeaf="false" isAbstract="false" isActive="false">
\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="isSpecification" value="false"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_stype" value="Class"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_ntype" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="version" value="1.0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="package" value="EAPK_${xmiID}"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="date_created" value="${formatDate(new Date())}"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="date_modified" value="${formatDate(new Date())}"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="gentype" value="&lt;none&gt;"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="tagged" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="package_name" value="Class Diagram with Attributes"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="phase" value="1.0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="author" value="HP"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="complexity" value="1"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="status" value="Proposed"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="tpos" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_localid" value="2"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_eleType" value="element"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="style" value="BackColor=-1;BorderColor=-1;BorderWidth=-1;FontColor=-1;VSwimLanes=1;HSwimLanes=1;BorderStyle=0;"/>
\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t<UML:Classifier.feature>
${attributesXML(classItem.attributes)}
${methodsXML(classItem.methods)}
\t\t\t\t\t\t\t</UML:Classifier.feature>
\t\t\t\t\t\t</UML:Class>
`});

clases.linkDataArray.forEach((link) => {
    ownedElementXML += `\t\t\t\t\t\t<UML:Association name="${link.relationship}" xmi.id="EAID_${generateID()}" visibility="public" isRoot="false" isLeaf="false" isAbstract="false">
\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="style" value="3"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_type" value="Association"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="direction" value="Unspecified"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="linemode" value="3"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="linecolor" value="-1"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="linewidth" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="seqno" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="headStyle" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="lineStyle" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_localid" value="4"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_sourceName" value=""/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_targetName" value=""/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_sourceType" value="Class"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_targetType" value="Class"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_sourceID" value="51"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_targetID" value="52"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="virtualInheritance" value="0"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="lb" value="0..*"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="lt" value="+role a"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="mt" value="Association A"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="rb" value="0..*"/>
\t\t\t\t\t\t\t\t<UML:TaggedValue tag="rt" value="+role b"/>
\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t<UML:Association.connection>
\t\t\t\t\t\t\t\t<UML:AssociationEnd visibility="public" multiplicity="0..*" name="role a" aggregation="none" isOrdered="false" targetScope="instance" changeable="none" isNavigable="true" type="EAID_${link.from}">
\t\t\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="containment" value="Unspecified"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="sourcestyle" value="Union=0;Derived=0;AllowDuplicates=0;Owned=0;Navigable=Unspecified;"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_end" value="source"/>
\t\t\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t</UML:AssociationEnd>
\t\t\t\t\t\t\t\t<UML:AssociationEnd visibility="public" multiplicity="0..*" name="role a" aggregation="none" isOrdered="false" targetScope="instance" changeable="none" isNavigable="true" type="EAID_${link.to}">
\t\t\t\t\t\t\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="containment" value="Unspecified"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="sourcestyle" value="Union=0;Derived=0;AllowDuplicates=0;Owned=0;Navigable=Unspecified;"/>
\t\t\t\t\t\t\t\t\t\t<UML:TaggedValue tag="ea_end" value="target"/>
\t\t\t\t\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t\t\t\t</UML:AssociationEnd>
\t\t\t\t\t\t\t</UML:Association.connection>
\t\t\t\t\t\t</UML:Association>
`;
});

    const packageXML = `<UML:ModelElement.taggedValue>
\t\t\t\t\t\t<UML:TaggedValue tag="parent" value="EAPK_947ABD50_600B_4d36_BFDB_579E9B6F4357"/>
\t\t\t\t\t\t<UML:TaggedValue tag="ea_package_id" value="2"/>
\t\t\t\t\t\t<UML:TaggedValue tag="created" value="${formatDate(new Date())}"/>
\t\t\t\t\t\t<UML:TaggedValue tag="modified" value="${formatDate(new Date())}"/>
\t\t\t\t\t\t<UML:TaggedValue tag="iscontrolled" value="0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="lastloaddate" value="${formatDate(new Date())}"/>
\t\t\t\t\t\t<UML:TaggedValue tag="lastsavedate" value="${formatDate(new Date())}"/>
\t\t\t\t\t\t<UML:TaggedValue tag="version" value="1.0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="isprotected" value="0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="usedtd" value="0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="logxml" value="0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="tpos" value="4"/>
\t\t\t\t\t\t<UML:TaggedValue tag="batchsave" value="0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="batchload" value="0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="phase" value="1.0"/>
\t\t\t\t\t\t<UML:TaggedValue tag="status" value="Proposed"/>
\t\t\t\t\t\t<UML:TaggedValue tag="author" value="HP"/>
\t\t\t\t\t\t<UML:TaggedValue tag="complexity" value="1"/>
\t\t\t\t\t\t<UML:TaggedValue tag="ea_stype" value="Public"/>
\t\t\t\t\t\t<UML:TaggedValue tag="tpos" value="4"/>
\t\t\t\t\t\t<UML:TaggedValue tag="gentype" value="&lt;none&gt;"/>
\t\t\t\t\t</UML:ModelElement.taggedValue>
\t\t\t\t\t<UML:Namespace.ownedElement>
${ownedElementXML}
\t\t\t\t\t</UML:Namespace.ownedElement>`;



    const modelXML = `<UML:Namespace.ownedElement>
\t\t\t\t<UML:Class name="EARootClass" xmi.id="EAID_11111111_5487_4080_A7F4_41526CB0AA00" isRoot="true" isLeaf="false" isAbstract="false"/>
\t\t\t\t<UML:Package name="Class Diagram with Attributes" xmi.id="EAPK_${xmiID}" isRoot="false" isLeaf="false" isAbstract="false" visibility="public">
\t\t\t\t\t${packageXML}
\t\t\t\t</UML:Package>
\t\t\t\t<UML:DataType xmi.id="eaxmiid0" name="int" visibility="private" isRoot="false" isLeaf="false" isAbstract="false"/>
\t\t\t</UML:Namespace.ownedElement>`;

    const diagramXML = `\t\t\t<UML:ModelElement.taggedValue>
\t\t\t\t<UML:TaggedValue tag="version" value="1.0"/>
\t\t\t\t<UML:TaggedValue tag="author" value="HP"/>
\t\t\t\t<UML:TaggedValue tag="created_date" value="${formatDate(new Date())}"/>
\t\t\t\t<UML:TaggedValue tag="modified_date" value="${formatDate(new Date())}"/>
\t\t\t\t<UML:TaggedValue tag="package" value="EAPK_${xmiID}"/>
\t\t\t\t<UML:TaggedValue tag="type" value="Logical"/>
\t\t\t\t<UML:TaggedValue tag="swimlanes" value="locked=false;orientation=0;width=0;inbar=false;names=false;color=-1;bold=false;fcol=0;tcol=-1;ofCol=-1;ufCol=-1;hl=0;ufh=0;hh=0;cls=0;bw=0;hli=0;bro=0;SwimlaneFont=lfh:-13,lfw:0,lfi:0,lfu:0,lfs:0,lfface:Calibri,lfe:0,lfo:0,lfchar:1,lfop:0,lfcp:0,lfq:0,lfpf=0,lfWidth=0;"/>
\t\t\t\t<UML:TaggedValue tag="matrixitems" value="locked=false;matrixactive=false;swimlanesactive=true;kanbanactive=false;width=1;clrLine=0;"/>
\t\t\t\t<UML:TaggedValue tag="ea_localid" value="1"/>
\t\t\t\t<UML:TaggedValue tag="EAStyle" value="ShowPrivate=1;ShowProtected=1;ShowPublic=1;HideRelationships=0;Locked=0;Border=1;HighlightForeign=1;PackageContents=1;SequenceNotes=0;ScalePrintImage=0;PPgs.cx=1;PPgs.cy=1;DocSize.cx=826;DocSize.cy=1169;ShowDetails=0;Orientation=P;Zoom=100;ShowTags=0;OpParams=1;VisibleAttributeDetail=0;ShowOpRetType=1;ShowIcons=1;CollabNums=0;HideProps=0;ShowReqs=0;ShowCons=0;PaperSize=9;HideParents=0;UseAlias=0;HideAtts=0;HideOps=0;HideStereo=0;HideElemStereo=0;ShowTests=0;ShowMaint=0;ConnectorNotation=UML 2.1;ExplicitNavigability=0;ShowShape=1;AllDockable=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;m_bElementClassifier=1;SPT=1;ShowNotes=0;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;"/>
\t\t\t\t<UML:TaggedValue tag="styleex" value="SaveTag=09EF3329;ExcludeRTF=0;DocAll=0;HideQuals=0;AttPkg=1;ShowTests=0;ShowMaint=0;SuppressFOC=1;MatrixActive=0;SwimlanesActive=1;KanbanActive=0;MatrixLineWidth=1;MatrixLineClr=0;MatrixLocked=0;TConnectorNotation=UML 2.1;TExplicitNavigability=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;m_bElementClassifier=1;SPT=1;MDGDgm=;STBLDgm=;ShowNotes=0;VisibleAttributeDetail=0;ShowOpRetType=1;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;SuppressedCompartments=;Theme=:119;"/>
\t\t\t</UML:ModelElement.taggedValue>
\t\t\t<UML:Diagram.element>
${diagramClassElementXML(clases.nodeDataArray)}
\t\t\t</UML:Diagram.element>
`;

    const content = `<UML:Model name="EA Model" xmi.id="MX_EAID_${xmiID}">
\t\t\t${modelXML}
\t\t</UML:Model>
\t\t<UML:Diagram name="Class Diagram" xmi.id="EAID_${diagramxmiID}" diagramType="ClassDiagram" owner="EAPK_${xmiID}" toolName="Enterprise Architec 2.5">
${diagramXML}
\t\t</UML:Diagram>`;

    const xmlSkeleton = `<?xml version="1.0" encoding="Windows-1252" standalone="no" ?>
<XMI xmi.version="1.1" xmlns:UML="omg.org/UML1.3" timestamp="${formatDate(new Date())}">
\t<XMI.header>
\t\t<XMI.documentation>
\t\t\t<XMI.exporter>Enterprise Architect</XMI.exporter>
\t\t\t<XMI.exporterVersion>2.5</XMI.exporterVersion>
\t\t\t<XMI.exporterID>1</XMI.exporterID>
\t\t</XMI.documentation>
\t</XMI.header>
\t<XMI.content>
\t\t${content}
\t</XMI.content>
\t<XMI.difference/>
\t<XMI.extensions xmi.extender="Enterprise Architec 2.5"/>
</XMI>
`;

    return xmlSkeleton;
}

// Función para descargar el archivo XML
export function downloadXML(filename, xmlContent) {
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href); // Liberar el objeto Blob
}

const myJson = {
    "class": "ze",
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "linkCategoryProperty": "relationship",
    "linkFromPortIdProperty": "fromPort",
    "linkToPortIdProperty": "toPort",
    "nodeDataArray": [
        {
            "key": -1,
            "name": "Clase A",
            "properties": [
                {
                    "name": "newProperty",
                    "type": "String",
                    "visibility": "public"
                },
                {
                    "name": "getName",
                    "type": "String",
                    "visibility": "private"
                }
            ],
            "methods": [
                {
                    "name": "newMethod",
                    "parameters": [],
                    "type": "void",
                    "visibility": "public"
                },
                {
                    "name": "newMethod",
                    "parameters": [],
                    "type": "void",
                    "visibility": "public"
                }
            ],
            "location": "-230 -120"
        },
        {
            "key": -2,
            "name": "Clase B",
            "properties": [
                {
                    "name": "newProperty",
                    "type": "String",
                    "visibility": "public"
                }
            ],
            "methods": [
                {
                    "name": "newMethod",
                    "parameters": [],
                    "type": "void",
                    "visibility": "public"
                }
            ],
            "location": "-45.21875 38.37395853996277"
        }
    ],
    "linkDataArray": [
        {
            "relationship": "Association",
            "from": -1,
            "to": -2,
            "fromPort": "R",
            "toPort": "T"
        }
    ]
};
// Generar el XML y descargarlo

/*document.getElementById('download').addEventListener('click', function () {
    const xmlOutput = generateXML(myJson);
    downloadXML("classes.xml", xmlOutput);
});*/