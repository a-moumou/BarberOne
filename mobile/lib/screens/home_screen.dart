import 'package:flutter/material.dart';
import '../widgets/main_layout.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HomeScreen extends StatefulWidget {
  final Map<String, dynamic>? userData;

  const HomeScreen({Key? key, this.userData}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PageController _pageController = PageController(viewportFraction: 0.85);
  List<dynamic> salons = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchSalons();
  }

  Future<void> fetchSalons() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:5000/api/salons/public'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          salons = json.decode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          error =
              'Erreur lors du chargement des salons (${response.statusCode})';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Erreur de connexion au serveur: $e';
        isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      currentIndex: 0,
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
                        children: const [
                          Text(
                            'Furqan',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            'Javed',
                            style: TextStyle(
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
                        onPressed: fetchSalons,
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Sélectionnez un salon:',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            if (isLoading)
              const Expanded(
                child: Center(
                  child: CircularProgressIndicator(
                    color: Color(0xFFD4AF37),
                  ),
                ),
              )
            else if (error != null)
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        error!,
                        style: const TextStyle(
                          color: Colors.red,
                          fontSize: 16,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: fetchSalons,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFD4AF37),
                        ),
                        child: const Text('Réessayer'),
                      ),
                    ],
                  ),
                ),
              )
            else if (salons.isEmpty)
              const Expanded(
                child: Center(
                  child: Text(
                    'Aucun salon disponible',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                ),
              )
            else
              Expanded(
                child: Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        controller: _pageController,
                        itemCount: salons.length,
                        itemBuilder: (context, index) {
                          final salon = salons[index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                '/salon-detail',
                                arguments: salon,
                              );
                            },
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 10),
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
                                      child: const Icon(
                                        Icons.store,
                                        size: 60,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    Text(
                                      salon['name'] ?? 'Sans nom',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      salon['address'] ??
                                          'Adresse non disponible',
                                      style: const TextStyle(
                                        color: Colors.grey,
                                        fontSize: 16,
                                      ),
                                      textAlign: TextAlign.center,
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
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 10),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back,
                                color: Color(0xFFD4AF37)),
                            onPressed: () {
                              _pageController.previousPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.arrow_forward,
                                color: Color(0xFFD4AF37)),
                            onPressed: () {
                              _pageController.nextPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
