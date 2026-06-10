<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Favorite;

class FavoriteController extends Controller
{
    public function toggle($jobId)
    {
        $userId = auth()->id();

        $favorite = Favorite::where('user_id', $userId)
            ->where('job_id', $jobId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Removed from favorites']);
        }

        Favorite::create([
            'user_id' => $userId,
            'job_id' => $jobId
        ]);

        return response()->json(['message' => 'Added to favorites']);
    }

    public function getFavorites()
    {
        $favorites = Favorite::where('user_id', auth()->id())
            ->pluck('job_id');

        return response()->json($favorites);
    }
}