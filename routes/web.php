<?php

use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('rooms', [RoomController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('rooms');

Route::get('/rooms/{uuid}', [RoomController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('rooms.show');

Route::post('rooms', [RoomController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('rooms.store');
