import 'package:flutter/material.dart';

class CustomBottomBar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemSelected;

  const CustomBottomBar({
    Key? key,
    required this.selectedIndex,
    required this.onItemSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        border: Border(
          top: BorderSide(
            color: Colors.grey[900]!,
            width: 0.5,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            index: 0,
            icon: Icons.home,
            isSelected: selectedIndex == 0,
          ),
          _buildNavItem(
            index: 1,
            icon: Icons.calendar_today,
            isSelected: selectedIndex == 1,
          ),
          _buildNavItem(
            index: 2,
            icon: Icons.notifications,
            isSelected: selectedIndex == 2,
            badgeCount: 5,
          ),
          _buildProfileItem(),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData icon,
    required bool isSelected,
    int? badgeCount,
  }) {
    return GestureDetector(
      onTap: () => onItemSelected(index),
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFD4AF37) : Colors.transparent,
          shape: BoxShape.circle,
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : Colors.grey,
              size: 28,
            ),
            if (badgeCount != null)
              Positioned(
                right: 12,
                top: 12,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFFD4AF37),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    badgeCount.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileItem() {
    return Container(
      width: 35,
      height: 35,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white24,
      ),
      child: const Icon(
        Icons.person,
        color: Colors.white,
        size: 20,
      ),
    );
  }
}
