<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterUserRequest extends FormRequest
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
            'name' => 'required|max:160',
            'email' => 'required|email|unique:users,email',
            'password' => 'required'
        ];
    }

    public function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'status_code' => 422,
            'error' => true,
            'message' => 'Validation Errors',
            'errorLists' => $validator->errors()
        ]));
    }

    public function messages(): array
    {
        return [
            'name.required' => 'User Name is required',
            'email.required' => 'Email Adress is required',
            'email.unique' => 'Email Adress is already used',
            'email.email' => 'Invalid Email Adress',
            'password.required' => 'Password is required',
        ];
    }
}