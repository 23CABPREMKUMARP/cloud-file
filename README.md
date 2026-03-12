# MediResolve - PHP Version

A modern patient issue resolution platform built with PHP and MySQL.

## 🚀 Getting Started

### Prerequisites
- PHP 7.4+
- MySQL Server
- A local server like XAMPP, WAMP, or MAMP.

### Setup Instructions
1.  **Clone the repository** to your `htdocs` or `www` folder.
2.  **Database Configuration**:
    - Open **phpMyAdmin**.
    - Create a new database named `mediresolve`.
    - Import the `database.sql` file located in the root directory.
3.  **Connection Settings**:
    - Open `includes/db.php`.
    - Update the database credentials (`$username` and `$password`) to match your local setup.
4.  **Run the App**:
    - Start Apache and MySQL in your control panel.
    - Navigate to `http://localhost/patient` (or your folder name).

## 🛠 Features
- **Modern UI**: Built with Tailwind CSS and glassmorphism design.
- **Authentication**: Secure login and registration for patients.
- **Issue Tracking**: Patients can submit complaints, upload evidence, and track status in real-time.
- **Admin Console**: Hospital staff can manage, assign, and resolve cases efficiently.
- **Timeline View**: Detailed audit trail for every reported issue.

## 📁 Structure
- `/admin`: Administrative dashboard and case review logic.
- `/includes`: Shared database connection and UI components (navbar).
- `/uploads`: Storage for patient-submitted evidence files.
- `database.sql`: MySQL schema definition.
# patient1
