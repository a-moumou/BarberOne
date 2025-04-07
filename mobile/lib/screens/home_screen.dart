import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  final Map<String, dynamic> userData;

  const HomeScreen({super.key, required this.userData});

  @override
  Widget build(BuildContext context) {
    // Afficher les données reçues pour le débogage
    print('Données utilisateur reçues : $userData');

    // Extraire les données utilisateur de manière sécurisée
    final user = userData['user'] as Map<String, dynamic>? ?? {};
    final firstName = user['first_name'] as String? ?? 'Utilisateur';
    final lastName = user['last_name'] as String? ?? '';
    final email = user['email'] as String? ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('BarberOne'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              // Déconnexion et retour à la page de connexion
              Navigator.of(context).pushReplacementNamed('/login');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const CircleAvatar(
                          radius: 30,
                          child: Icon(Icons.person, size: 40),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Bienvenue $firstName $lastName',
                                style:
                                    Theme.of(context).textTheme.headlineSmall,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                email,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Mes rendez-vous',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            // Liste des rendez-vous (à implémenter)
            Expanded(
              child: Center(
                child: Text(
                  'Aucun rendez-vous pour le moment',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Ajouter la navigation vers la page de prise de rendez-vous
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Fonctionnalité à venir'),
              duration: Duration(seconds: 2),
            ),
          );
        },
        label: const Text('Prendre RDV'),
        icon: const Icon(Icons.add),
      ),
    );
  }
}
