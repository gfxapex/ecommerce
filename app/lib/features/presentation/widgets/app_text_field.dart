import 'package:app/features/core/const/app_text_style.dart';
import 'package:flutter/material.dart';

class AppTextField extends StatelessWidget {
  final TextEditingController controller;
  final bool obscureText;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final String? hintText;
  final String? labelText;

  const AppTextField({
    super.key,
    required this.controller,
    this.obscureText = false,
    this.keyboardType,
    this.validator,
    this.hintText,
    this.labelText,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      decoration: InputDecoration(
        labelText: labelText,
        hintText: hintText,
        labelStyle: AppTextStyle.label,
        hintStyle: AppTextStyle.label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: const BorderSide(width: 0.5),

        ),
      ),
    );
  }
}