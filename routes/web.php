<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChirpController;


Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('chirps', [ChirpController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('chirps');
