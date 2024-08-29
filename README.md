# EticPlus Platform POC

This is a Proof of Concept (POC) project for the EticPlus platform, an extension of the Etic online sales platform. EticPlus aims to offer an enhanced and expandable experience to stores already registered on Etic by providing various features on a new, independent platform.

## Project Overview

The EticPlus POC demonstrates a new platform where existing Etic stores can easily transition using their current store names. The POC implements basic functionalities to showcase how stores can register, manage subscriptions, and control available add-ons.

### Key Features

1. **Store Registration and Login**: 
   - Stores can register on the platform using a store name, description, and password.
   - Registered stores can log in using their credentials.

2. **Subscription Packages**: 
   - Stores can choose between three packages: Silver, Gold, and Platinum.

3. **Add-ons Management**:
   - Stores can list and activate/deactivate up to three add-ons at a time (except for Platinum package subscribers who can activate all).
   - Add-ons: "My Page" (default active), "Daily Sales Report", "Google Analytics", "Chatmate", "ReviewMe", "GiftSend".

4. **Virtual Notifications**:
   - When an add-on is activated or deactivated, a virtual notification/log is created (e.g., "Store 123 activated add-on 'Google Analytics'").

5. **Profile Management**:
   - Store users can update all their profile information except for the username.
   - Includes functionality for logging out of the platform.
     
6. **Logout**:
   - Store users can securely log out from their account at any time.
     
7. **Account Deletion**:
   - Stores have the option to close their EticPlus accounts.

## Screenshots

### Login Page
![Ekran görüntüsü 2024-08-29 112912](https://github.com/user-attachments/assets/c9567ef4-eb18-4079-9a4f-816f9907276b)


### Sign-up Page
![Ekran görüntüsü 2024-08-29 112928](https://github.com/user-attachments/assets/860d15ce-3801-4829-b512-0cfe97855ff4)


### Profile Page
https://github.com/user-attachments/assets/a04c072a-24f5-4470-8a10-a3d8690c8d04


### Home Page
![Ekran görüntüsü 2024-08-29 113024](https://github.com/user-attachments/assets/1e945e57-8b99-414e-9630-83ac92096912)


## Technical Details

- **Java Version**: 17
- **Framework**: Spring Boot
- **Database**: MongoDB 
- **Frontend**: React 
