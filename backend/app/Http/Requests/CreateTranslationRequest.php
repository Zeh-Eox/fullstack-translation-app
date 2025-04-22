<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateTranslationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'source_language' => 'required|string|size:2',
            'target_language' => 'required|string|size:2',
            'source_text' => 'required|string',
            'target_text' => 'required|string'
        ];
    }

    public function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'error' => true,
            'message' => 'Validation Errors',
            'errosList' => $validator->errors()
        ]));
    }

    public function messages(): array
    {
        return [
            'source_language.required' => 'Source Language is required',
            'source_language.string' => 'Source Language must be string',
            'source_language.size' => 'Source Language must ony have 2 characters',
            'target_language.required' => 'Target Language is required',
            'target_language.string' => 'Target Language must be string',
            'target_language.size' => 'Target Language must ony have 2 characters',
            'source_text.required' => 'Source Text is required',
            'source_text.string' => 'Source Text must be string',
            'target_text.required' => 'Target Text is required',
            'target_text.string' => 'Target Text must be string'
        ];
    }
}
