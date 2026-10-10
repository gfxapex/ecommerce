import 'package:app/features/data/models/category_model.dart';
import 'package:app/features/data/services/category_service.dart';
import 'package:flutter/material.dart';

class CategoryProvider extends ChangeNotifier {
  final CategoryService _service = CategoryService();

  // 1. Singleton pattern implementation
  // 2. Private state variables
  bool _isLoading = false;
  bool _isSuccess = false;
  String? _error;
  String? _message;
  List<CategoryModel> _categories = [];

  // 3. Getters
  bool get isLoading => _isLoading;
  bool get isSuccess => _isSuccess;
  String? get error => _error;
  String? get message => _message;
  List<CategoryModel> get categories => _categories;

  // create category
  Future<void> createCategory(CategoryModel model) async {
    _isLoading = true;
    _isSuccess = false;
    _error = "";
    _message = "";
    notifyListeners();

    try {
      _message = await _service.createCategory(model);
    } catch (e) {
      debugPrint("$e");
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // get category
  Future<void> getCategories() async {
    _isLoading = true;
    _isSuccess = false;
    _error = "";
    _message = "";
    notifyListeners();

    try {
      final result = await _service.getCategories();
      _categories = result;
    } catch (e) {
      debugPrint("$e");
      _error = e.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 6. Reset state
  void clear() {
    _isLoading = false;
    _isSuccess = false;
    _error = null;
    _message = null;
    _categories = [];
    notifyListeners();
  }
}
