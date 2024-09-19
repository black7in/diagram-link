@extends('layouts.app')

@section('content')
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <livewire:chirpss.create />

                <livewire:chirps.list />
            </div>
        </div>
    </div>
@endsection

@section('footer')
    @parent
@endsection
