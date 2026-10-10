class ServerException implements Exception{
  final String? message;
  ServerException([this.message]);
}

class CacheException implements Exception{
  final String message;
  CacheException([this.message=""]);
}

class OfflineException implements Exception{
final String message;
OfflineException([this.message=""]);
}

class UnauthorizedException implements Exception{
final String message;
UnauthorizedException([this.message=""]);
}