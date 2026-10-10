import 'package:app/features/core/const/routes/app_routes.dart';
import 'package:app/features/core/const/routes/routes.dart';

import 'package:app/features/providers/auth_provider.dart';
import 'package:app/features/providers/category_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main(List<String> args) {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AuthProvider()),
        ChangeNotifierProvider(create: (context) => CategoryProvider()),
      ],
      child: MaterialApp(
        initialRoute: AppRoutes.login,
        onGenerateRoute: Routes().onGenerate,
      ),
    );
  }
}
