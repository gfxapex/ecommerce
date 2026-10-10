class CategoryModel {
  final int? id;
  final String name;
  final DateTime? createdAt;

  CategoryModel({this.id, required this.name, this.createdAt});

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: int.tryParse(json['id'].toString()) ?? 0,
      name: json['name'].toString(),
      createdAt: DateTime.parse(json['createdAt'].toString()),
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name, 'createdAt': createdAt?.toIso8601String()};
  }
}
