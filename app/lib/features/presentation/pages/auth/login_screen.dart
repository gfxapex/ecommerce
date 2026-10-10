import 'package:app/features/core/const/app_string.dart';
import 'package:app/features/core/const/app_text_style.dart';
import 'package:app/features/core/const/app_validator.dart';
import 'package:app/features/core/const/routes/app_routes.dart';
import 'package:app/features/data/models/login_model.dart';
import 'package:app/features/presentation/widgets/app_button.dart';
import 'package:app/features/presentation/widgets/app_snackbar.dart';
import 'package:app/features/presentation/widgets/app_text_field.dart';
import 'package:app/features/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  //  fields
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final TextEditingController _identifierController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Form(
        key: _formKey,
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                children: [
                  Text(AppString.welcome, style: AppTextStyle.header),
                  const SizedBox(height: 10),
                  // username, email, phone
                  AppTextField(
                    controller: _identifierController,
                    validator: (value) => AppValidator.required(
                      value,
                      fieldName: AppString.identifier,
                    ),
                    labelText: AppString.identifier,
                    hintText: AppString.enterIdentifier,
                    keyboardType: TextInputType.text,
                  ),
                  const SizedBox(height: 10),
                  AppTextField(
                    controller: _passwordController,
                    validator: (value) => AppValidator.minLength(
                      value,
                      8,
                      fieldName: AppString.password,
                    ),
                    labelText: AppString.password,
                    hintText: AppString.enterPassword,
                    obscureText: true,
                  ),
                  const SizedBox(height: 10),

                  // Submitting State aware Button
                  Consumer<AuthProvider>(
                    builder: (context, authProvider, child) {
                      if (authProvider.isLoading) {
                        return const CircularProgressIndicator();
                      }
                      return AppButton(
                        onPressed: () {
                          _loginButton();
                        },
                        text: AppString.login,
                      );
                    },
                  ),
                  SizedBox(height: 10),
                  // navigation button
                  Row(
                    children: [
                      Text(AppString.dontHaveAnAccount),
                      TextButton(
                        onPressed: () {
                          Navigator.pushNamed(context, AppRoutes.signup);
                        },
                        child: Text(AppString.signUp),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _loginButton() async {
    if (!_formKey.currentState!.validate()) return;

    final provider = context.read<AuthProvider>();

    final model = LoginModel(
      identifier: _identifierController.text.trim(),
      password: _passwordController.text,
    );

    await provider.signin(model);

    if (!mounted) return;

    if (provider.isSuccess) {
      AppSnackbar.showSuccess(context, provider.message);
      _identifierController.clear();
      _passwordController.clear();
      Navigator.pushReplacementNamed(context, AppRoutes.home);
    } else if (provider.error.isNotEmpty) {
      AppSnackbar.showError(context, provider.error);
    }
  }
}
