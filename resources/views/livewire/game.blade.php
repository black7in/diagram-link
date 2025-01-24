<?php

use Livewire\Volt\Component;
use Livewire\Attributes\On;
use App\Models\Diagrama;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use App\Events\UpdateDiagram;

new class extends Component {
    //
    use LivewireAlert;
    public $room;
    public $diagrama;

    public function mount($room)
    {
        $this->room = $room;
        $this->diagrama = Diagrama::where('room_id', $room->uuid)->first();

        $this->dispatch('cargarDiagramaInicio', $this->diagrama->diagram);
    }

    #[On('storeDiagram')]
    public function storeDiagram($data)
    {
        $id = $this->room->uuid;

        Diagrama::where('room_id', $id)->update([
            'diagram' => json_decode($data, true),
        ]);

        $this->alert('success', 'Diagrama Guardado');
        $this->skipRender(); // Evita el renderizado después de esta llamada
    }

    #[On('updateDiagram')]
    public function updateDiagram($data)
    {
        
        $id = $this->room->uuid;
        Diagrama::where('room_id', $id)->update([
            'diagram' => json_decode($data, true),
        ]);
        broadcast(new UpdateDiagram($this->room, $data))->toOthers();
        $this->skipRender(); // Evita el renderizado después de esta llamada
    }

    #[On('echo:room.{room.id},UpdateDiagram')]
    public function reloadDiagram()
    {
        //$this->dispatch('actualizarDiagrama', $this->diagrama->diagram);
        // enviar nuevo diagrama de bae de datos
        //$this->diagrama = Diagrama::where('room_id', $this->room->uuid)->first();
        $this->dispatch('actualizarDiagrama', $this->diagrama->diagram);
        $this->skipRender(); // Evita el renderizado después de esta llamada
    }

    #[On('cargarDiagrama')]
    public function cargarDiagrama()
    {
        $this->dispatch('diagramaEnviado', $this->diagrama->diagram);
        $this->skipRender(); // Evita el renderizado después de esta llamada
    }
};

?>

<div>
    <div class="row no-gutter flex-grow-1 justify-content-center" style="height: 82vh;">
        <div class="col-md-2 d-flex no-padding" style="background-color:  #e4e7ea;">
            <div id="myPaletteDiv" style="border: solid 1px black; border-right: 0; width:100%; height:100%;"></div>
        </div>
        <div class="col-md-10 d-flex no-padding">
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
