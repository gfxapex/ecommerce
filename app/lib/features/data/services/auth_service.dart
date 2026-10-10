import 'package:app/features/data/models/login_model.dart';
import 'package:app/features/data/models/signup_model.dart';
import 'package:app/features/data/services/dio_client.dart';
import 'package:dio/dio.dart';
import 'package:flutter/widgets.dart';

class AuthService {
  final _dio = DioClient().dio;

  Future<String> signup(SignupModel model) 
  async {
    debugPrint('Login request: ${model.toJson()}');
    try {
      final response = await _dio.post('auth/signup', data: model.toJson());
      debugPrint('Login response: ${response.data}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        return response.data['message'] ?? 'Signup successful';
      }

      throw Exception(response.data['message']);
    } on DioException catch (e) {
      debugPrint('signup error type: ${e.type}');
      debugPrint('signup error message: ${e.message}');
      debugPrint('signup URL: ${e.requestOptions.uri}');
      debugPrint('signup status: ${e.response?.statusCode}');
      debugPrint('signup response: ${e.response?.data}');

      throw Exception(e.response?.data?['message'] ?? 'Signup failed');
    }
  }

  // signin
  Future<String> signin(LoginModel model) async {
    debugPrint('Login request: ${model.toJson()}');
    try {
      final response = await _dio.post("auth/login", data: model.toJson());
      debugPrint("login response ${response.data}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.data["message"] ?? "login successful";
      }
      throw Exception(response.data["message"]);
    } on DioException catch (e) {
      debugPrint('Login error type: ${e.type}');
      debugPrint('Login error message: ${e.message}');
      debugPrint('Login URL: ${e.requestOptions.uri}');
      debugPrint('Login status: ${e.response?.statusCode}');
      debugPrint('Login response: ${e.response?.data}');
      throw Exception(e.response?.data?['message'] ?? 'login failed');
    }
  }
}
