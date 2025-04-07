import 'dart:convert';
import 'dart:io';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;

class AuthService {
  // URL de base en fonction de l'environnement
  static String baseUrl = kIsWeb
      ? 'http://localhost:5000/api' // URL pour le web
      : 'http://10.0.2.2:5000/api'; // URL pour l'émulateur Android

  static const Duration timeoutDuration = Duration(seconds: 30);

  // Pour permettre de changer l'URL de base dynamiquement
  static void updateBaseUrl(String newUrl) {
    baseUrl = newUrl;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      print('Tentative de connexion à : $baseUrl/auth/login');
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/login'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: json.encode({'email': email, 'password': password}),
          )
          .timeout(timeoutDuration);

      print('Statut de la réponse : ${response.statusCode}');
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        final errorBody = json.decode(response.body);
        throw Exception(errorBody['message'] ?? 'Erreur de connexion');
      }
    } catch (e) {
      print('Erreur de connexion : $e');
      throw Exception('Erreur de connexion: $e');
    }
  }

  Future<bool> checkServer() async {
    try {
      print('Vérification du serveur à : $baseUrl');
      final response = await http.get(
        Uri.parse('$baseUrl/auth/check'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 5));
      print('Statut de la vérification : ${response.statusCode}');
      return response.statusCode == 200;
    } catch (e) {
      print('Erreur lors de la vérification du serveur : $e');
      return false;
    }
  }
}
