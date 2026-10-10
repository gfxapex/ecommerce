import 'package:app/features/data/models/category_model.dart';
import 'package:app/features/providers/category_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../widgets/app_snackbar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
   final TextEditingController _nameController = TextEditingController();
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<CategoryProvider>().getCategories());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(actions: [
        ElevatedButton(onPressed: () {
          showAboutDialog();
        }, child: Text("Save")),
      ],),
      body: Consumer<CategoryProvider>(
        builder: (context, value, child) {
          if (value.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (value.categories.isEmpty) {
            return const Center(child: Text('There is no category'));
          }

          return ListView.builder(
            itemCount: value.categories.length,
            itemBuilder: (context, index) {
              final category = value.categories[index];

              return ListTile(title: Text(category.name));
            },
          );
        },
      ),
    );
  }

  Future<void> showAboutDialog()async{
   _nameController.clear();
return showDialog(context: context, builder: (context) {
  return AlertDialog(
    title: Text("data"),
    content: TextFormField(
             controller: _nameController,
               autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Category Name',
            border: OutlineInputBorder(),
          ),
    ),
  );
},);

  }

  Future<void> categoryButton() async {
       
    final name = _nameController.text.trim();

    try {
      final model = CategoryModel(name: name);
      final provider = context.read<CategoryProvider>();
      await provider.createCategory(model);

      if (!mounted) return;

      if (provider.isSuccess) {
        AppSnackbar.showSuccess(
          context,
          provider.message ?? 'Category created',
        );
        _nameController.clear();
      } else {
        AppSnackbar.showError(
          context,
          provider.error ?? 'Failed to create category',
        );
      }
    } catch (e) {
      debugPrint("$e");
    }
  }
}
