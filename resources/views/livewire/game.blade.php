<div>
    <div class="row no-gutter flex-grow-1 justify-content-center" style="height: 82vh;">
        <div class="col-md-1 d-flex no-padding" style="background-color:  #e4e7ea;">
            <div id="myPaletteDiv" style="border: solid 1px black; border-right: 0; width:100%; height:100%;"></div>
        </div>
        <div class="col-md-11 d-flex no-padding">
            <div style="display: flex; width: 100%; height: 100%;">
                <div style="position: relative; width: 100%; height: 100%;">
                    <div id="myDiagramDiv" style="border: solid 1px black; width: 100%; height: 100%;"></div>
                    <ul id="contextMenu" class="menu">
                        <!-- Imprimir nombre -->
                        <li id="printname" class="menu-item" onpointerdown="cxcommand(event)">Print Name</li>
                        <!-- Agregar Atributo -->
                        <li id="attribute" class="menu-item" onpointerdown="cxcommand(event)">Add Attribute
                            <ul class="menu">
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributepublic')">Public</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributeprivate')">Private</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributeprotected')">Protected
                                </li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'attributepacket')">Packet</li>
                            </ul>
                        </li>
                        <!-- Agregar Método -->
                        <li id="method" class="menu-item" onpointerdown="cxcommand(event)">Add Method
                            <ul class="menu">
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodpublic')">Public</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodprivate')">Private</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodprotected')">Protected</li>
                                <li class="menu-item" onpointerdown="cxcommand(event, 'methodpacket')">Packet</li>
                            </ul>
                        </li>

                        <!-- Cambiar color -->
                        <li id="color" class="menu-item">
                            Color
                            <ul class="menu">
                                <li class="menu-item" style="background-color: #f38181"
                                    onpointerdown="cxcommand(event, 'color')">Red</li>
                                <li class="menu-item" style="background-color: #eaffd0"
                                    onpointerdown="cxcommand(event, 'color')">Green</li>
                                <li class="menu-item" style="background-color: #95e1d3"
                                    onpointerdown="cxcommand(event, 'color')">Blue</li>
                                <li class="menu-item" style="background-color: #fce38a"
                                    onpointerdown="cxcommand(event, 'color')">Yellow</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    @vite('resources/css/game.css')
    @vite('resources/js/game/game.js')
</div>
