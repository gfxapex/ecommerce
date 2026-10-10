import 'package:flutter/material.dart';

class AppButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String text;
  const AppButton({super.key, required this.onPressed, required this.text});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        minimumSize: Size(double.infinity, 55),
        shape: BeveledRectangleBorder(
          borderRadius: BorderRadiusGeometry.circular(5),
        ),
      ),
      child: Text(text),
    );
  }
}
