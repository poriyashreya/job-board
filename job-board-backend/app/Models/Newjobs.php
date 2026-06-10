<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Newjobs extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'company',
        'location',
        'salary',
        'type',
        'experience',
        'description',
        'skills',
        'responsibilities',
        'qualifications'
    ];

    protected $casts = [
        'skills' => 'array',
        'responsibilities' => 'array',
        'qualifications' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}