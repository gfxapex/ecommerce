import 'package:app/features/data/models/login_model.dart';
import 'package:app/features/data/models/signup_model.dart';
import 'package:app/features/data/services/auth_service.dart';
import 'package:flutter/foundation.dart';

class AuthProvider extends ChangeNotifier {
  final _service = AuthService();
// singleton
  bool _isLoading = false;
  String _error = '';
  String _message = '';
  bool _isSuccess = false;
  Role? _selectedRole;

  // getters
  bool get isLoading => _isLoading;
  String get error => _error;
  String get message => _message;
  bool get isSuccess => _isSuccess;
  Role? get selectedRole => _selectedRole;

  void setRole(Role? role) {
    _selectedRole = role;
    notifyListeners();
  }

  Future<void> signup(SignupModel signup) async {
    _isLoading = true;
    _error = '';
    _message = '';
    _isSuccess = false;
    notifyListeners();

    try {
      _message = await _service.signup(signup);
      _isSuccess = true;
      _selectedRole = null;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      debugPrint('Provider Signup Error: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signin(LoginModel model) async {
    _isLoading = true;
    _error = "";
    _message = "";
    _isSuccess = false;
    notifyListeners();

    try {
      _message = await _service.signin(model);
      _isSuccess = true;
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      debugPrint('Provider Signin Error: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
