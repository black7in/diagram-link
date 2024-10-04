<?php

use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

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

//Route::get('/rooms/{uuid}/join', [RoomController::class, 'joinRoom'])->name('rooms.join');

Route::get('/test/', [TestController::class, 'show']);

