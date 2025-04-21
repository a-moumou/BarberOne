import 'package:flutter/material.dart';
import '../widgets/main_layout.dart';

class ServiceScreen extends StatelessWidget {
  final Map<String, dynamic>? userData;

  ServiceScreen({Key? key, this.userData}) : super(key: key);

  final List<Map<String, dynamic>> services = [
    {
      'name': 'ZE Prestige by Fay',
      'price': '25€',
      'duration': '30 min',
      'description': 'Coupe classique avec finitions',
      'icon': Icons.content_cut,
    },
    {
      'name': 'ZE Classic',
      'price': '15€',
      'duration': '20 min',
      'description': 'Taille et entretien de la barbe',
      'icon': Icons.face,
    },
    {
      'name': 'ZE Complete',
      'price': '35€',
      'duration': '45 min',
      'description': 'Coupe complète avec soin de la barbe',
      'icon': Icons.style,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            userData?['first_name'] ?? 'Furqan',
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            userData?['last_name'] ?? 'Javed',
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(
                          Icons.refresh,
                          color: Color(0xFFD4AF37),
                          size: 30,
                        ),
                        onPressed: () {},
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Sélectionnez une prestation:',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: PageController(viewportFraction: 0.85),
                itemCount: services.length,
                itemBuilder: (context, index) {
                  final service = services[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: GestureDetector(
                      onTap: () {
                        Navigator.of(context).pushNamed(
                          '/booking',
                          arguments: service,
                        );
                      },
                      child: Card(
                        color: const Color(0xFF2C2C2C),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 120,
                              height: 120,
                              decoration: const BoxDecoration(
                                color: Color(0xFFD4AF37),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                service['icon'] as IconData,
                                size: 60,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 20),
                            Text(
                              service['name'] as String,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              service['price'] as String,
                              style: const TextStyle(
                                color: Color(0xFFD4AF37),
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              service['duration'] as String,
                              style: TextStyle(
                                color: Colors.grey[400],
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Icon(Icons.arrow_back, color: Color(0xFFD4AF37)),
                  Icon(Icons.arrow_forward, color: Color(0xFFD4AF37)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
