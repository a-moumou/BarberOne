import 'package:flutter/material.dart';
import '../widgets/main_layout.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/date_symbol_data_local.dart';

class HomeScreen extends StatefulWidget {
  final Map<String, dynamic>? userData;

  const HomeScreen({Key? key, this.userData}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PageController _pageController = PageController(viewportFraction: 0.85);
  List<dynamic> salons = [];
  List<dynamic> hairdressers = [];
  List<dynamic> services = [];
  List<DateTime> dates = [];
  List<String> timeSlots = [];
  List<dynamic> reservations = [];
  bool isLoading = true;
  String? error;
  String? selectedSalonId;
  String? selectedHairdresserId;
  String? selectedServiceId;
  DateTime? selectedDate;
  String? selectedTime;
  bool showConfirmation = false;
  bool isSaving = false;

  @override
  void initState() {
    super.initState();
    initializeDateFormatting('fr_FR', null).then((_) {
      fetchSalons();
      _generateDates();
      _generateTimeSlots();
    });
  }

  @override
  void didUpdateWidget(HomeScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (selectedHairdresserId != null && selectedDate != null) {
      fetchReservations(selectedHairdresserId!);
    }
  }

  void _generateDates() {
    final now = DateTime.now();
    dates = List.generate(7, (index) => now.add(Duration(days: index)));
  }

  void _generateTimeSlots() {
    timeSlots = [];
    final now = DateTime.now();
    DateTime time = DateTime(2024, 1, 1, 9, 0); // 9:00
    final endTime = DateTime(2024, 1, 1, 19, 30); // 19:30

    while (time.isBefore(endTime) || time.isAtSameMomentAs(endTime)) {
      final timeString = DateFormat('HH:mm').format(time);
      timeSlots.add(timeString);
      time = time.add(const Duration(minutes: 30));
    }
  }

  void _selectDate(DateTime date) {
    setState(() {
      selectedDate = date;
      dates = List.generate(7, (index) => date.add(Duration(days: index)));
      _generateTimeSlots();
    });
    if (selectedHairdresserId != null) {
      fetchReservations(selectedHairdresserId!);
    }
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

  Future<void> fetchHairdressers(String salonId) async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:5000/api/hairdressers/salon/$salonId'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          hairdressers = json.decode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          error =
              'Erreur lors du chargement des coiffeurs (${response.statusCode})';
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

  Future<void> fetchServices(String hairdresserId) async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:5000/api/services/public'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          services = json.decode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          error =
              'Erreur lors du chargement des services (${response.statusCode})';
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

  Future<void> fetchReservations(String hairdresserId) async {
    try {
      if (selectedDate == null) return;

      final response = await http.get(
        Uri.parse(
            'http://10.0.2.2:5000/api/reservations/reserved-times?hairdresserId=$hairdresserId&date=${selectedDate!.toIso8601String()}'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ${widget.userData?['token']}',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          reservations = data;
        });
      }
    } catch (e) {
      print('Erreur lors de la récupération des réservations: $e');
    }
  }

  Future<void> saveReservation() async {
    if (widget.userData?['token'] == null) {
      setState(() {
        error = 'Vous devez être connecté pour effectuer une réservation';
        isSaving = false;
      });
      return;
    }

    setState(() {
      isSaving = true;
      error = null;
    });

    try {
      final response = await http.post(
        Uri.parse('http://10.0.2.2:5000/api/reservations'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ${widget.userData?['token']}',
        },
        body: json.encode({
          'selectedService': selectedServiceId,
          'selectedDate': selectedDate?.toIso8601String(),
          'selectedTime': selectedTime,
          'selectedSalon': selectedSalonId,
          'selectedHairdresser': selectedHairdresserId,
          'userInfo': {
            'name':
                '${widget.userData?['first_name'] ?? 'Client'} ${widget.userData?['last_name'] ?? ''}'
                    .trim()
          }
        }),
      );

      if (response.statusCode == 201) {
        setState(() {
          showConfirmation = true;
          isSaving = false;
        });
      } else if (response.statusCode == 401) {
        setState(() {
          error = 'Votre session a expiré. Veuillez vous reconnecter.';
          isSaving = false;
        });
      } else {
        setState(() {
          error =
              'Erreur lors de la sauvegarde de la réservation (${response.statusCode})';
          isSaving = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Erreur de connexion au serveur: $e';
        isSaving = false;
      });
    }
  }

  void _showSuccessDialog() {
    // Suppression de la boîte de dialogue
  }

  bool isTimeSlotBooked(String timeSlot) {
    return reservations.contains(timeSlot);
  }

  bool isTimeSlotPassed(String timeSlot) {
    if (selectedDate == null) return false;

    final now = DateTime.now();
    final timeSlotDate = DateFormat('HH:mm').parse(timeSlot);
    final selectedDateTime = DateTime(
      selectedDate!.year,
      selectedDate!.month,
      selectedDate!.day,
      timeSlotDate.hour,
      timeSlotDate.minute,
    );

    return selectedDateTime.isBefore(now);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

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
                      if (selectedSalonId != null ||
                          selectedHairdresserId != null ||
                          selectedServiceId != null ||
                          selectedDate != null)
                        IconButton(
                          icon: const Icon(Icons.arrow_back,
                              color: Color(0xFFD4AF37)),
                          onPressed: () {
                            setState(() {
                              if (selectedDate != null) {
                                selectedDate = null;
                                selectedTime = null;
                              } else if (selectedServiceId != null) {
                                selectedServiceId = null;
                              } else if (selectedHairdresserId != null) {
                                selectedHairdresserId = null;
                              } else {
                                selectedSalonId = null;
                              }
                            });
                          },
                        )
                      else
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.userData?['first_name'] ?? 'Furqan',
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                              ),
                            ),
                            Text(
                              widget.userData?['last_name'] ?? 'Javed',
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      Row(
                        children: [
                          if (widget.userData != null)
                            IconButton(
                              icon: const Icon(
                                Icons.logout,
                                color: Color(0xFFD4AF37),
                                size: 30,
                              ),
                              onPressed: () {
                                Navigator.of(context)
                                    .pushReplacementNamed('/login');
                              },
                            ),
                          IconButton(
                            icon: const Icon(
                              Icons.refresh,
                              color: Color(0xFFD4AF37),
                              size: 30,
                            ),
                            onPressed: () {
                              if (selectedDate != null) {
                                _generateTimeSlots();
                              } else if (selectedServiceId != null) {
                                _generateDates();
                              } else if (selectedHairdresserId != null) {
                                fetchServices(selectedHairdresserId!);
                              } else if (selectedSalonId != null) {
                                fetchHairdressers(selectedSalonId!);
                              } else {
                                fetchSalons();
                              }
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    selectedDate != null
                        ? 'Choisissez une heure:'
                        : selectedServiceId != null
                            ? 'Choisissez une date:'
                            : selectedHairdresserId != null
                                ? 'Choisissez un services:'
                                : selectedSalonId != null
                                    ? 'Choisissez un coiffeurs:'
                                    : 'Choisissez un salon:',
                    style: const TextStyle(
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
                        onPressed: () {
                          if (selectedDate != null) {
                            _generateTimeSlots();
                          } else if (selectedServiceId != null) {
                            _generateDates();
                          } else if (selectedHairdresserId != null) {
                            fetchServices(selectedHairdresserId!);
                          } else if (selectedSalonId != null) {
                            fetchHairdressers(selectedSalonId!);
                          } else {
                            fetchSalons();
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFD4AF37),
                        ),
                        child: const Text('Réessayer'),
                      ),
                    ],
                  ),
                ),
              )
            else if (selectedDate != null && selectedTime == null)
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Text(
                        'Horaires du ${DateFormat('d MMMM').format(selectedDate!)}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Expanded(
                      child: GridView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          childAspectRatio: 2.5,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                        ),
                        itemCount: timeSlots.length,
                        itemBuilder: (context, index) {
                          final timeSlot = timeSlots[index];
                          final bool isPassed = isTimeSlotPassed(timeSlot);
                          final bool isBooked = isTimeSlotBooked(timeSlot);

                          return GestureDetector(
                            onTap: (isPassed || isBooked)
                                ? null
                                : () {
                                    setState(() {
                                      selectedTime = timeSlot;
                                    });
                                    saveReservation();
                                  },
                            child: Container(
                              decoration: BoxDecoration(
                                color: (isPassed || isBooked)
                                    ? Colors.grey.withOpacity(0.3)
                                    : const Color(0xFF2C2C2C),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: (isPassed || isBooked)
                                      ? Colors.grey
                                      : const Color(0xFFD4AF37),
                                  width: 1,
                                ),
                              ),
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      timeSlot,
                                      style: TextStyle(
                                        color: (isPassed || isBooked)
                                            ? Colors.grey
                                            : const Color(0xFFD4AF37),
                                        fontSize: 16,
                                      ),
                                    ),
                                    if (isBooked)
                                      const Text(
                                        'Réservé',
                                        style: TextStyle(
                                          color: Colors.red,
                                          fontSize: 12,
                                        ),
                                      ),
                                    if (isPassed)
                                      const Text(
                                        'Passé',
                                        style: TextStyle(
                                          color: Colors.grey,
                                          fontSize: 12,
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
                  ],
                ),
              )
            else if (selectedTime != null)
              Expanded(
                child: Column(
                  children: [
                    Container(
                      width: double.infinity,
                      margin: const EdgeInsets.all(20),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2C2C2C),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Column(
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: const BoxDecoration(
                              color: Color(0xFFD4AF37),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.check_circle,
                              color: Colors.white,
                              size: 40,
                            ),
                          ),
                          const SizedBox(height: 20),
                          const Text(
                            'Réservation confirmée !',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 10),
                          const Text(
                            'Votre rendez-vous a été enregistré',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Column(
                          children: [
                            _buildConfirmationDetail(
                              'Salon',
                              salons.firstWhere(
                                  (s) => s['_id'] == selectedSalonId)['name'],
                            ),
                            _buildConfirmationDetail(
                              'Coiffeur',
                              hairdressers.firstWhere((h) =>
                                  h['_id'] == selectedHairdresserId)['name'],
                            ),
                            _buildConfirmationDetail(
                              'Service',
                              '${services.firstWhere((s) => s['_id'] == selectedServiceId)['name']} - ${services.firstWhere((s) => s['_id'] == selectedServiceId)['price']}€',
                            ),
                            _buildConfirmationDetail(
                              'Date',
                              DateFormat('d MMMM y').format(selectedDate!),
                            ),
                            _buildConfirmationDetail('Heure', selectedTime!),
                          ],
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            selectedSalonId = null;
                            selectedHairdresserId = null;
                            selectedServiceId = null;
                            selectedDate = null;
                            selectedTime = null;
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFD4AF37),
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: const Text(
                          'Retour à l\'accueil',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              )
            else if (selectedServiceId != null)
              Expanded(
                child: Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        controller: _pageController,
                        itemCount: dates.length + 1,
                        itemBuilder: (context, index) {
                          if (index == dates.length) {
                            return GestureDetector(
                              onTap: () async {
                                final DateTime? picked = await showDatePicker(
                                  context: context,
                                  initialDate: DateTime.now(),
                                  firstDate: DateTime.now(),
                                  lastDate: DateTime.now()
                                      .add(const Duration(days: 90)),
                                  builder: (context, child) {
                                    return Theme(
                                      data: Theme.of(context).copyWith(
                                        colorScheme: const ColorScheme.dark(
                                          primary: Color(0xFFD4AF37),
                                          onPrimary: Colors.white,
                                          surface: Color(0xFF2C2C2C),
                                          onSurface: Colors.white,
                                        ),
                                      ),
                                      child: child!,
                                    );
                                  },
                                );
                                if (picked != null) {
                                  _selectDate(picked);
                                }
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
                                          Icons.calendar_month,
                                          size: 60,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(height: 20),
                                      const Text(
                                        'Autre date',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                      const SizedBox(height: 10),
                                      const Text(
                                        'Sélectionner une date spécifique',
                                        style: TextStyle(
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
                          }
                          final date = dates[index];
                          return GestureDetector(
                            onTap: () {
                              _selectDate(date);
                            },
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 10),
                              child: Card(
                                color: selectedDate == date
                                    ? const Color(0xFFD4AF37).withOpacity(0.3)
                                    : const Color(0xFF2C2C2C),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Container(
                                      width: 120,
                                      height: 120,
                                      decoration: BoxDecoration(
                                        color: selectedDate == date
                                            ? const Color(0xFFD4AF37)
                                            : const Color(0xFFD4AF37)
                                                .withOpacity(0.7),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(
                                        Icons.calendar_today,
                                        size: 60,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    Text(
                                      DateFormat('EEEE').format(date),
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      DateFormat('d MMMM y').format(date),
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
              )
            else if (selectedHairdresserId != null && services.isEmpty)
              const Expanded(
                child: Center(
                  child: Text(
                    'Aucun service disponible',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                ),
              )
            else if (selectedHairdresserId != null)
              Expanded(
                child: Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        controller: _pageController,
                        itemCount: services.length,
                        itemBuilder: (context, index) {
                          final service = services[index];
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                selectedServiceId = service['_id'];
                              });
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
                                        Icons.cleaning_services,
                                        size: 60,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    Text(
                                      service['name'] ?? 'Sans nom',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      '${service['price']}€ - ${service['duration']} min',
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
              )
            else if (selectedSalonId != null)
              Expanded(
                child: Column(
                  children: [
                    Expanded(
                      child: PageView.builder(
                        controller: _pageController,
                        itemCount: hairdressers.length,
                        itemBuilder: (context, index) {
                          final hairdresser = hairdressers[index];
                          final bool isAvailable =
                              hairdresser['isAvailable'] ?? true;

                          return GestureDetector(
                            onTap: isAvailable
                                ? () {
                                    setState(() {
                                      selectedHairdresserId =
                                          hairdresser['_id'];
                                    });
                                    fetchServices(hairdresser['_id']);
                                  }
                                : null,
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 10),
                              child: Card(
                                color: isAvailable
                                    ? const Color(0xFF2C2C2C)
                                    : Colors.grey.withOpacity(0.3),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Container(
                                      width: 120,
                                      height: 120,
                                      decoration: BoxDecoration(
                                        color: isAvailable
                                            ? const Color(0xFFD4AF37)
                                            : Colors.grey,
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(
                                        Icons.person,
                                        size: 60,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    Text(
                                      hairdresser['name'] ?? 'Sans nom',
                                      style: TextStyle(
                                        color: isAvailable
                                            ? Colors.white
                                            : Colors.grey,
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      isAvailable
                                          ? 'Disponible'
                                          : 'Indisponible',
                                      style: TextStyle(
                                        color: isAvailable
                                            ? Colors.green
                                            : Colors.red,
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
                              setState(() {
                                selectedSalonId = salon['_id'];
                              });
                              fetchHairdressers(salon['_id']);
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

  Widget _buildConfirmationDetail(String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: const Color(0xFF2C2C2C),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 16,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
