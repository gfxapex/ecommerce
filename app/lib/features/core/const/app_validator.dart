class AppValidator {
  static String? required(
    String? value, {
    String fieldName = "Field",
  }) {
    if (value == null || value.trim().isEmpty) {
      return "$fieldName cannot be empty";
    }

    return null;
  }

  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) {
      return "Email cannot be empty";
    }

    final emailRegex = RegExp(
      r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    );

    if (!emailRegex.hasMatch(value.trim())) {
      return "Enter a valid email address";
    }

    return null;
  }

  static String? minLength(
    String? value,
    int min, {
    String fieldName = "Field",
  }) {
    if (value == null || value.trim().isEmpty) {
      return "$fieldName cannot be empty";
    }

    if (value.trim().length < min) {
      return "$fieldName must be at least $min characters";
    }

    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return "Phone number cannot be empty";
    }

    final phoneRegex = RegExp(r'^\+?[0-9]{7,15}$');

    if (!phoneRegex.hasMatch(value.trim())) {
      return "Enter a valid phone number";
    }

    return null;
  }
static String? password(
  String? value, {
  bool strong = false,
}) {
  final error = required(value, fieldName: 'Password');
  if (error != null) return error;

  if (strong &&
      !RegExp(
        r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$',
      ).hasMatch(value!)) {
    return 'Password must contain uppercase, lowercase, number and special character';
  }

  return null;
}
  
}
