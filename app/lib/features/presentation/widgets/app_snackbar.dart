

import 'package:flutter/material.dart';

class AppSnackbar extends SnackBar {
  AppSnackbar.success({super.key, required String message})
      : super(
          content: Text(message),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        );

  AppSnackbar.error({super.key, required String message})
      : super(
          content: Text(message),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        );

  // Static helper methods with distinct names
  static void showSuccess(BuildContext context, String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(AppSnackbar.success(message: message));
  }

  static void showError(BuildContext context, String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(AppSnackbar.error(message: message));
  }
}