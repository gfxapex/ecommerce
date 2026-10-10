import 'package:app/features/core/const/routes/app_routes.dart';
import 'package:app/features/presentation/pages/auth/login_screen.dart';
import 'package:app/features/presentation/pages/auth/signup_screen.dart';
import 'package:app/features/presentation/pages/home/home_screen.dart';
import 'package:flutter/material.dart';

class Routes {
  Route<dynamic> onGenerate(RouteSettings settings) {
    switch (settings.name) {
      // signup
      case AppRoutes.signup:
        return MaterialPageRoute(builder: (context) => SignupScreen());
      // login
      case AppRoutes.login:
        return MaterialPageRoute(builder: (context) => LoginScreen());
      // home
      case AppRoutes.home:
        return MaterialPageRoute(builder: (context) => HomeScreen());

        // on default
       default: return MaterialPageRoute(builder: (context) => Scaffold(body: Center(child: Text("No routes found"),),),);
    }
  }
}
