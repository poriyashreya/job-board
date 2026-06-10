<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class AuthenticationController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('token')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        // Email not registered
        if (!$user) {
            return response()->json([
                'errors' => [
                    'email' => ['This email is not registered']
                ]
            ], 422);
        }

        // Password wrong
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'password' => ['Email or password is invalid']
                ]
            ], 422);
        }

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'token' => $token
        ]);

    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function profile()
    {
        return response()->json(Auth::user());
    }

    public function myJobs()
    {
        $user = Auth::user();

        $jobs = $user->jobs()->latest()->get();

        return response()->json($jobs);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required',
            'email' => 'required|email'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email
        ]);

        return response()->json([
            'message' => 'Profile updated successfully'
        ]);
    }

    public function deleteProfile(Request $request)
    {
        $user = Auth::user();

        $user->tokens()->delete();

        // OPTIONAL: delete user's jobs (if relation exists)
        if ($user->jobs()->exists()) {
            $user->jobs()->delete();
        }

        // Delete user
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}