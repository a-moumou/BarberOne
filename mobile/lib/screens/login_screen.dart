import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _serverUrlController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  String? _errorMessage;
  bool _showServerConfig = false;

  @override
  void initState() {
    super.initState();
    _serverUrlController.text = AuthService.baseUrl;
    _checkServerConnection();
  }

  Future<void> _checkServerConnection() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final isServerAccessible = await _authService.checkServer();

    if (mounted) {
      setState(() {
        _isLoading = false;
        if (!isServerAccessible) {
          _errorMessage =
              'Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d\'exécution.';
        }
      });
    }
  }

  void _updateServerUrl() {
    if (_serverUrlController.text.isNotEmpty) {
      AuthService.updateBaseUrl(_serverUrlController.text);
      _checkServerConnection();
    }
  }

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        final response = await _authService.login(
          _emailController.text,
          _passwordController.text,
        );

        if (mounted) {
          // Afficher les données pour le débogage
          print('Réponse de connexion : $response');

          // Vérifier que nous avons les données utilisateur requises
          if (response['user'] == null) {
            throw Exception('Données utilisateur manquantes dans la réponse');
          }

          // Navigation vers la page d'accueil avec les données utilisateur
          Navigator.of(context).pushReplacementNamed(
            '/home',
            arguments: response,
          );
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            _errorMessage = e.toString().replaceAll('Exception: ', '');
          });
        }
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connexion'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              setState(() {
                _showServerConfig = !_showServerConfig;
              });
            },
            tooltip: 'Configuration du serveur',
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _isLoading ? null : _checkServerConnection,
            tooltip: 'Vérifier la connexion au serveur',
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (_showServerConfig) ...[
                  TextFormField(
                    controller: _serverUrlController,
                    decoration: InputDecoration(
                      labelText: 'URL du serveur',
                      border: const OutlineInputBorder(),
                      prefixIcon: const Icon(Icons.computer),
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.save),
                        onPressed: _updateServerUrl,
                        tooltip: 'Sauvegarder l\'URL',
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
                if (_errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.red.shade100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: Colors.red),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.email),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez entrer votre email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  decoration: const InputDecoration(
                    labelText: 'Mot de passe',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.lock),
                  ),
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez entrer votre mot de passe';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _login,
                    child: _isLoading
                        ? const SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(),
                          )
                        : const Text('Se connecter'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _serverUrlController.dispose();
    super.dispose();
  }
}
