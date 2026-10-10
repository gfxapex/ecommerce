class ProductModel {
  final int id;
  final String title;
  final String? description;
  final double price;
  final double stock;
  final int categoryId;
  final DateTime? createdAt;

  ProductModel({
    required this.id,
    required this.title,
    this.description,
    required this.price,
    required this.stock,
    required this.categoryId,
    this.createdAt,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      price: double.parse(json['price'].toString()),
      stock: double.parse(json['stock'].toString()),
      categoryId: json['categoryId'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }
}