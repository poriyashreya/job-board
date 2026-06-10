<?php

namespace App\Http\Controllers\Api;

use App\Models\Newjobs;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Newjobs::all();

        return response()->json($jobs);
    }

    public function show($id)
    {
        $job = Newjobs::find($id);

        if (!$job) {
            return response()->json([
                "message" => "Job not found"
            ], 404);
        }

        return response()->json($job);
    }
    public function store(Request $request)
    {
        $job = Newjobs::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'company' => $request->company,
            'location' => $request->location,
            'salary' => $request->salary,
            'type' => $request->type,
            'experience' => $request->experience,
            'description' => $request->description,
            'skills' => $request->skills,
            'responsibilities' => $request->responsibilities,
            'qualifications' => $request->qualifications
        ]);

        return response()->json($job);
    }

    public function destroy($id)
    {
        $job = Newjobs::findOrFail($id);
        $job->delete();

        return response()->json([
            "message" => "Job deleted successfully"
        ]);
    }

    public function update(Request $request, $id)
    {
        $job = Newjobs::findOrFail($id);

        $job->update([
            'company' => $request->company,
            'type' => $request->type,
            'location' => $request->location,
            'job_type' => $request->title,
            'experience' => $request->experience,
            'qualifications' => $request->qualifications,
            'salary' => $request->salary,
            'skills' => $request->skills,
            'description' => $request->description,
            'responsibilities' => $request->responsibilities,
            'date_posted' => $request->datePosted
        ]);

        return response()->json([
            "message" => "Job updated successfully"
        ]);
    }
}