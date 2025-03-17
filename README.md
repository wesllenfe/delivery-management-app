# Delivery Management App

A mobile application built with Ionic and Angular for managing delivery orders.

## Features

- List, add, edit, and delete delivery orders
- Mark orders as delivered with photo proof
- Filter orders by status (All, Pending, Delivered)
- View order details including delivery proof
- Integration with ViaCEP for address lookup
- Local storage for data persistence

## Prerequisites

- Node.js (v14+)
- npm (v6+)
- Ionic CLI
- Android Studio (for Android builds)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/delivery-management.git
cd delivery-management
Install dependencies:
shellscript
Copiar
npm install
Run the application in the browser:
shellscript
Copiar
ionic serve
Building for Android
shellscript
Copiar
# Add Android platform
ionic cap add android

# Build the app
ionic cap build android

# Open in Android Studio
ionic cap open android
Running Tests
shellscript
Copiar
# Run unit tests
ng test
Project Structure
src/app/models: Data models
src/app/pages: Application pages
src/app/components: Reusable components
src/app/services: Services for data management and business logic
Best Practices Implemented
Clean Code principles
SOLID principles
DRY (Don't Repeat Yourself)
Reactive programming with RxJS
Form validation
Error handling
Responsive design
Running the Application
After creating all the files, you can run the application with:

bash
Copiar
# Start the development server
ionic serve
Building for Android
To build for Android:

shellscript
Copiar
# Add Android platform
ionic cap add android

# Build the app
ionic cap build android

# Open in Android Studio
ionic cap open android
