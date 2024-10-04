@extends('layouts.app')

@section('content')
    <style>
        .no-padding {
            padding: 0 !important;
        }

        .chat-dropdown {
            width: 300px;
            height: 600px;
            overflow: auto;
        }

        .custom-chat-container {
            min-height: 400px;
            max-height: 400px;
            overflow-y: auto;
            background-color: green;
        }
    </style>
    <div class="card">
        <div class="card-header">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <ul class="navbar-nav">
                    <li id = "" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-file"></i> Nuevo</a></li>
                    <li id = "abrirD" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-folder-open"></i> Abrir</a></li>
                    <li id = "saveDB" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-save"></i> Guardar</a></li>
                    <li id = "exportarPNG" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-file-export"></i> Exportar PNG</a></li>
                    <li id = "exportarJSON" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-file-export"></i> Exportar JSON</a></li>
                    <li id = "exportarArchitect" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-file-export"></i> Exportar Architect</a></li>
                    <li id = "" class="nav-item"><a class="nav-link" href="#"><i class="fas fa-share-alt"></i> Compartir</a></li>
                </ul>
                <div class="ms-auto">
                    <div class="dropdown">
                        <button class="btn" data-bs-toggle="dropdown">
                            <i class="fas fa-comments"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end chat-dropdown">
                            <!-- Titulo Chat Room al centro -->
                            <h5 class="dropdown-header text-center">Chat Room</h5>
                            <!-- Linea separador -->
                            <div class="dropdown-divider"></div>

                            <!-- Contenedor scroll de 300px de ancho y 400 de alto para mensajes -->
                            <div id="messageContainer" class="custom-chat-container">
                                <!-- Mensajes -->
                                @livewire('messages.lista', ['room' => $room])
                            </div>
                            <div>
                                @livewire('messages.create', ['room' => $room])
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>

        <div class="card-body d-flex flex-column no-padding">
            @livewire('game', ['room' => $room])
        </div>
    </div>

    <script>
        document.querySelector('.dropdown').addEventListener('shown.bs.dropdown', function() {
            var messageContainer = document.getElementById('messageContainer');
            messageContainer.scrollTop = messageContainer.scrollHeight;
        });
    </script>
@endsection

@section('footer')
@endsection
