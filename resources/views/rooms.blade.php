@extends('layouts.app')

@section('content')
    <style>
        .compact-paragraph {
            margin-bottom: 0.2rem;
            /* Ajusta este valor según tus necesidades */
        }
    </style>
    <div class="container-fluid">
        <div class="d-flex align-items-center my-2">
            <h3>MIS DIAGRAMAS</h3>
            <a href="#" class="btn btn-dark ms-3" data-bs-toggle="modal" data-bs-target="#createModal">
                <i class="fas fa-plus"></i> Crear
            </a>
        </div>

        @livewire('rooms.list', ['rooms' => $rooms])
    </div>


    <!-- Modal -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createModalLabel">Crear Nuevo Diagrama</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Aquí puedes poner el formulario para crear un nuevo proyecto -->
                    <form id="createForm" action="{{ route('rooms.store') }}" method="POST">
                        @csrf
                        <div class="mb-3">
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Descripción</label>
                            <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-success"
                        onclick="document.getElementById('createForm').submit();">Guardar</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('footer')
    @parent
@endsection
