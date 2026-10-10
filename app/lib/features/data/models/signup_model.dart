enum Role { ADMIN, USER }

class SignupModel {
  final String username;
  final String email;
  final String password;
  final String confirmPassword;
  final String phone;
  final String firstName;
  final String lastName;
  final Role role;

  SignupModel({
    required this.username,
    required this.email,
    required this.password,
    required this.confirmPassword,
    required this.phone,
    required this.firstName,
    required this.lastName,
    required this.role,
  });

 Map<String, dynamic> toJson() {
  return {
    'username': username,
    'email': email,
    'password': password,
    'confirmPassword': confirmPassword,
    'phone': phone,
    'firstName': firstName,
    'lastName': lastName,
    'role': role.name,
  };
}
}
