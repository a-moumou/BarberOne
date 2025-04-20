import 'package:flutter/material.dart';
import 'custom_bottom_bar.dart';

class MainLayout extends StatelessWidget {
  final Widget child;
  final int currentIndex;

  const MainLayout({
    Key? key,
    required this.child,
    this.currentIndex = 0,
  }) : super(key: key);

  void _onNavigationItemSelected(BuildContext context, int index) {
    switch (index) {
      case 0:
        Navigator.of(context).pushReplacementNamed('/home');
        break;
      case 1:
        Navigator.of(context).pushNamed('/calendar');
        break;
      case 2:
        Navigator.of(context).pushNamed('/notifications');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1E1E1E),
      body: child,
      bottomNavigationBar: CustomBottomBar(
        selectedIndex: currentIndex,
        onItemSelected: (index) => _onNavigationItemSelected(context, index),
      ),
    );
  }
}
