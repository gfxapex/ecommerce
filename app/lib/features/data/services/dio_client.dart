import 'package:dio/dio.dart';

class UrlService {
  static const String url = "http://localhost:3001/api/v1/";
  // static const String url = "http://192.168.1.104:3000";
}

class DioClient {
  Dio dio = Dio(
    BaseOptions(
      baseUrl: UrlService.url,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

// token for adding
  void setToken(String token) {
    dio.options.headers['Authorization'] = 'Bearer $token';
  }

  // remove token on Logout
  void clearToken() {
    dio.options.headers.remove('Authorization');
  }
}
