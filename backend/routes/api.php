<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthentificationController;
use App\Http\Controllers\FichiersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [AuthentificationController::class, 'register']);
Route::post('/login', [AuthentificationController::class, 'login']);
Route::get("/fichiers", [FichiersController::class, "index"]);
Route::get("/fichiers/{id}", [FichiersController::class, "show"]);
Route::post("/search/{search}", [FichiersController::class, "search"]);
Route::get("/download/{id}", [FichiersController::class, "download"]);

//Protecting Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', [AuthentificationController::class, 'profile']);
    Route::post('/logout', [AuthentificationController::class, 'logout']);
    Route::post('/updateprofil/{id}', [AuthentificationController::class, 'update']);
    Route::post('/suppressionprofil/{id}', [AuthentificationController::class, 'destroy']);
    Route::post("/creationfichiers/{id}", [FichiersController::class, "store"]);
    Route::post("/destroy/{id}", [FichiersController::class, "destroy"]);
    Route::post("/update/{id}", [FichiersController::class, "update"]);
    Route::get("/mesfichiers/{id}", [FichiersController::class, "mesFichiers"]);
});
