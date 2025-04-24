<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateLanguageRequest extends FormRequest
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
            'language_code' => 'required|string|size:2',
            'language' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'language_code.required' => 'Language code is required',
            'language_code.string' => 'Language code must be a string',
            'language_code.size' => 'Language code must be exactly 2 characters',
            'language.required' => 'Language name is required',
            'language.string' => 'Language name must be a string',
            'language.max' => 'Language name must not exceed 255 characters',
        ];
    }
    public function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'error' => true,
            'message' => 'Validation Errors',
            'errorsList' => $validator->errors()
        ]));
    }
}
