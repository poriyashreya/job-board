<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\FavoriteController;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

Route::post('/reset-password', function (Request $request) {

    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Password reset successful'])
        : response()->json(['message' => 'Invalid token or email'], 400);
});

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => __($status)])
        : response()->json(['message' => __($status)], 400);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/favorites/{jobId}', [FavoriteController::class, 'toggle']);

    Route::get('/favorites', [FavoriteController::class, 'getFavorites']);

});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
});

Route::post('/register', [AuthenticationController::class, 'register']);
Route::post('/login', [AuthenticationController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/profile', [AuthenticationController::class, 'profile']);

    Route::put('/profile', [AuthenticationController::class, 'updateProfile']);

    Route::get('/my-jobs', [AuthenticationController::class, 'myJobs']);
    Route::delete('/profile', [AuthenticationController::class, 'deleteProfile']);

});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthenticationController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

});