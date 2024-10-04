<!-- resources/views/welcome.blade.php -->

@extends('layouts.app')

@section('content')
    <section class="bg-ligth py-5">
        <div class="container px-5">
            <div class="row gx-5 align-items-center justify-content-center">
                <div class="col-lg-8 col-xl-7 col-xxl-6">
                    <div class="my-5 text-center text-xl-start">
                        <h1 class="display-5 fw-bolder text-black mb-2">Diseña y Colabora, Simplifica la Complejidad</h1>
                        <p class="lead fw-normal text-black-50 mb-4">Con DiagramLink, crear diagramas de clase
                            nunca ha sido tan fácil y eficiente. Diseña, visualiza y comparte tus diagramas UML en tiempo
                            real, junto a tu equipo, sin importar dónde se encuentren. Facilita la comunicación, acelera el
                            desarrollo y asegura que todos trabajen en la misma página.</p>
                        <div class="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                            <a class="btn btn-success btn-lg px-4 me-sm-3" href="{{route('rooms')}}">Empezar</a>
                            <a class="btn btn-outline-dark btn-lg px-4" href="https://github.com/black7in/diagram-link">
                                <i class="bi-github" role="img" aria-label="GitHub"></i>
                                Source Code
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
                    <img class="img-fluid rounded-3 my-5"
                        src="https://d2slcw3kip6qmk.cloudfront.net/marketing/pages/chart/class-diagram-for-ATM-system-UML/Class-Diagram-ATM-system-750x660.png"
                        alt="..." style="width: calc(100% - 120px); height: calc(100% - 120px);">
                </div>
            </div>
        </div>
    </section>
@endsection
