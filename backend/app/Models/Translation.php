<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Translation extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "source_language",
        "target_language",
        "source_text",
        "target_text"
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
