# Client-Side Navigation Documentation (Sub-Navbar)

This document explains the technical implementation of the responsive sub-navigation bar in the ShineFiling frontend application.

## Overview
The sub-navigation bar (located below the main header) is designed to handle 12+ service categories dynamically. Instead of squishing the text or causing layout breaks on smaller screens, it implements an **Adaptive Overflow Pattern** using a "More" dropdown.

## Core Features
- **Dynamic Breakpoints**: Automatically adjusts the number of visible categories based on viewport width.
- **"More" Overflow Menu**: Moves non-fitting categories into a secondary dropdown.
- **Nested Mega Menus**: Provides access to all services even for items tucked away in the "More" menu.
- **Real-time Synchronization**: Uses a resize listener to ensure layout integrity during browser scaling.

---

## Technical Implementation

### 1. Viewport Breakpoints
The navigation uses five distinct states to determine how many items to show:

| Screen Width | Visible Items | Overflow Content |
| :--- | :--- | :--- |
| **≥ 1600px** | 12 (All) | None |
| **≥ 1440px** | 10 | 2 categories + "More" |
| **≥ 1280px** | 8 | 4 categories + "More" |
| **≥ 1024px** | 6 | 6 categories + "More" |
| **< 1024px** | 0 | Switched to Mobile Toggle |

### 2. State Management
The logic resides in `src/components/Navbar.jsx` using React hooks:
- `visibleCount`: Controls how many items from the `categories` array are sliced for direct display.
- `hoveredMenu`: Manages the active state of both primary megamenus and the "More" dropdown.

### 3. "More" Dropdown Logic
When `categories.length > visibleCount`, the application:
1. Slices the category array: `categories.slice(0, visibleCount)`.
2. Appends a static "MORE" navigation item.
3. Renders the remaining categories (`categories.slice(visibleCount)`) inside the dropdown container.

### 4. Interactive Nested Menus
To provide a premium experience, items inside the "More" menu trigger a **Secondary Side Menu**:
- **Triggers**: `:hover` on the list item.
- **Content**: Fetches the `items` list from `SERVICE_DATA` for that specific category.
- **UI**: Positioned absolutely to the left of the "More" dropdown for natural mouse movement flow.

---

## Technical Stack Used
- **Framer Motion**: For smooth entry/exit animations of all dropdowns and menus.
- **Tailwind CSS**: For all responsive styling, specifically using `hidden lg:block` and `hidden xl:block` for higher-level visibility control.
- **Lucide React Icons**: For Category icons and navigational indicators (Chevron, ArrowRight).

## Maintenance
To add new categories or change the sorting:
1. Open `src/data/services.js` and update the `SERVICE_DATA` object.
2. Navigation will automatically pick up the new keys and handle the overflow logic without further code changes.
