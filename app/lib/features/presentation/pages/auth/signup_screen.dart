import 'package:app/features/core/const/app_string.dart';
import 'package:app/features/core/const/app_text_style.dart';
import 'package:app/features/core/const/app_validator.dart';
import 'package:app/features/core/const/routes/app_routes.dart';
import 'package:app/features/data/models/signup_model.dart';
import 'package:app/features/presentation/widgets/app_button.dart';
import 'package:app/features/presentation/widgets/app_snackbar.dart';
import 'package:app/features/presentation/widgets/app_text_field.dart';
import 'package:app/features/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _fNameController = TextEditingController();
  final TextEditingController _lNameController = TextEditingController();
  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _phoneController.dispose();
    _fNameController.dispose();
    _lNameController.dispose();
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
                  Text(AppString.createAccount, style: AppTextStyle.header),

                  const SizedBox(height: 10),
                  //  username
                  AppTextField(
                    controller: _usernameController,
                    validator: (value) => AppValidator.required(
                      value,
                      fieldName: AppString.username,
                    ),
                    labelText: AppString.username,
                    hintText: AppString.enterUserName,
                  ),
                  const SizedBox(height: 10),
                  // email
                  AppTextField(
                    controller: _emailController,
                    validator: AppValidator.email,
                    labelText: AppString.email,
                    hintText: AppString.enterEmail,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 10),
                  //  password
                  AppTextField(
                    controller: _passwordController,
                    validator: (value) =>
                        AppValidator.password(value, strong: true),
                    labelText: AppString.password,
                    hintText: AppString.enterPassword,
                    obscureText: true,
                  ),
                  const SizedBox(height: 10),

                  //  confirm password
                  AppTextField(
                    controller: _confirmPasswordController,
                    validator: (value) => AppValidator.minLength(
                      value,
                      6,
                      fieldName: AppString.confirmPassword,
                    ),
                    labelText: AppString.confirmPassword,
                    hintText: AppString.enterConfirmPassword,
                    obscureText: true,
                  ),

                  const SizedBox(height: 10),
                  //  phone
                  AppTextField(
                    controller: _phoneController,
                    validator: (value) => AppValidator.minLength(
                      value,
                      6,
                      fieldName: AppString.phone,
                    ),
                    labelText: AppString.phone,
                    hintText: AppString.enterPhone,
                  ),

                  const SizedBox(height: 10),
                  //  First name
                  AppTextField(
                    controller: _fNameController,
                    validator: (value) => AppValidator.required(
                      value,
                      fieldName: AppString.fName,
                    ),
                    labelText: AppString.fName,
                    hintText: AppString.enterFName,
                  ),

                  const SizedBox(height: 10),

                  //  Last name
                  AppTextField(
                    controller: _lNameController,
                    validator: (value) => AppValidator.required(
                      value,
                      fieldName: AppString.lName,
                    ),
                    labelText: AppString.lName,
                    hintText: AppString.enterLName,
                  ),

                  const SizedBox(height: 10),
                  // Role Dropdown (Placed above button for natural form progression)
                  Consumer<AuthProvider>(
                    builder: (context, authProvider, child) {
                      return DropdownButtonFormField<Role>(
                        initialValue: authProvider.selectedRole,
                        hint: const Text("Select your role"),
                        decoration: const InputDecoration(
                          labelText: "Role",
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null) {
                            return "Please manually select a role";
                          }
                          return null;
                        },
                        items: const [
                          DropdownMenuItem(
                            value: Role.ADMIN,
                            child: Text('Admin'),
                          ),
                          DropdownMenuItem(
                            value: Role.USER,
                            child: Text('User'),
                          ),
                        ],
                        onChanged: (value) {
                          authProvider.setRole(value);
                          _formKey.currentState?.validate();
                        },
                      );
                    },
                  ),
                  const SizedBox(height: 20),

                  // Submitting State aware Button
                  Consumer<AuthProvider>(
                    builder: (context, authProvider, child) {
                      if (authProvider.isLoading) {
                        return const CircularProgressIndicator();
                      }
                      return AppButton(
                        onPressed: () {
                          _signupButton();
                        },
                        text: AppString.signUp,
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
                          Navigator.pushNamed(context, AppRoutes.login);
                        },
                        child: Text(AppString.login),
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

  Future<void> _signupButton() async {
    if (!_formKey.currentState!.validate()) return;

    final provider = context.read<AuthProvider>();

    final signup = SignupModel(
      username: _usernameController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
      confirmPassword: _confirmPasswordController.text,
      phone: _phoneController.text,
      firstName: _fNameController.text,
      lastName: _lNameController.text,
      role: provider.selectedRole!,
    );

    await provider.signup(signup);

    if (!mounted) return;

    if (provider.isSuccess) {
      if (provider.isSuccess) {
        AppSnackbar.showSuccess(context, provider.message);
        _usernameController.clear();
        _emailController.clear();
        _passwordController.clear();
        Navigator.pushReplacementNamed(context, AppRoutes.login);
      } else if (provider.error.isNotEmpty) {
        AppSnackbar.showError(context, provider.error);
      }
    }
  }
}
