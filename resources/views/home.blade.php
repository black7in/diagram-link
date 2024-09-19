@extends('layouts.app')

@section('content')
    <style>
        .no-padding {
            padding: 0 !important;
        }
    </style>
    <div class="card">
        <div class="card-header">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Archivo
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <li><a class="dropdown-item" href="#">Nuevo</a></li>
                            <li><a class="dropdown-item" href="#">Abrir</a></li>
                            <li><a class="dropdown-item" href="#">Guardar</a></li>
                            <li><a class="dropdown-item" href="#">Exportar</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Compartir</a>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="card-body d-flex flex-column no-padding">
            @livewire('game')
        </div>
    </div>
@endsection

@section('footer')
@endsection
