<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateLanguageRequest;
use App\Models\Language;
use Illuminate\Http\JsonResponse;

class LanguageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'status_message' => 'Languages retrieved successfully',
            'data' => Language::all(),
        ]);
    }

    public function store(CreateLanguageRequest $request): JsonResponse
    {
        $language = new Language();

        $language->language_code = $request->language_code;
        $language->language = $request->language;

        $language->save();

        return response()->json([
            'success' => true,
            'status_message' => 'Language successfully added',
            'data' => $language
        ]);
    }

    public function destroy(Language $language): JsonResponse
    {
        $language->delete();

        return response()->json([
            'success' => true,
            'status_message' => 'Languages deleted successfully',
        ]);
    }
}
