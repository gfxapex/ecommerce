import 'package:app/features/data/models/category_model.dart';
import 'package:app/features/data/services/dio_client.dart';
import 'package:dio/dio.dart';
import 'package:flutter/widgets.dart';

class CategoryService {
  final _dio = DioClient().dio;

  // create
  Future<String> createCategory(CategoryModel model) async {
    try {
      final response = await _dio.post(
        "categories/create",
        data: model.toJson(),
      );
      debugPrint("category response: ${response.data}");
      if (response.statusCode == 201 || response.statusCode == 200) {
        return response.data["message"];
      }
      throw Exception(response.data["message"]);
    } on DioException catch (e) {
       debugPrint("Category create error: ${e.response?.data}");
      throw Exception(
        e.response?.data?["message"] ??
            e.message ??
            "Failed to create category",
      );
    }
  }

  // get
  Future<List<CategoryModel>> getCategories() async {
    try {
      final response = await _dio.get("categories");
      debugPrint("category list response: ${response.data}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        final List<dynamic> data = response.data["data"];
        final result = data.map((e) => CategoryModel.fromJson(e)).toList();
        return result;
      }
      throw Exception(response.data["message"] ?? "Failed to load categories");
    } on DioException catch (e) {
         debugPrint("Category fetch error: ${e.response?.data}");
      throw Exception(
        e.response?.data?["message"] ?? e.message ?? "An error occurred",
      );
    }
  }
}
