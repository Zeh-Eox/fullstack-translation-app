<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LogUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->query('page', 1);
        $perPage = $request->query('limit', 5);
        $users = User::paginate($perPage, ['*'], 'page', $page);

        return response()->json($users);
    }

    public function register(RegisterUserRequest $request): JsonResponse
    {
        try {
            $user = new User();

            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password, [
                'round' => 12
            ]);

            $user->save();

            return response()->json([
                'status_code' => 200,
                'status_message' => 'User successfully registered',
                'data' => $user
            ]);
        } catch(Exception $e)
        {
            return response()->json($e->getMessage());
        }
    }

    public function login(LogUserRequest $request): JsonResponse
    {
        try {
            if (auth()->attempt($request->only(['email', 'password']))) 
            {
                $user = auth()->user();
                $_token = $user
                            ->createToken(env('JSON_WEB_TOKEN'))
                            ->plainTextToken;
                
                return response()->json([
                    'status_code' => 200,
                    'status_message' => 'User connected',
                    'data' => $user,
                    'token' => $_token
                ]);
            } else 
            {
                return response()->json([
                    'status_code' => 403,
                    'status_message' => 'Invalid Informations',
                ]);
            }
        } catch (Exception $e) 
        {
            return response()->json($e);
        }
    }

    /**
     * Get the authenticated user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getConnectedUser(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'status_code' => 401,
                    'status_message' => 'User not authenticated',
                ], 401);
            }

            return response()->json([
                'status_code' => 200,
                'status_message' => 'Authenticated user retrieved successfully',
                'data' => $user
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'status_message' => 'Error retrieving user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
