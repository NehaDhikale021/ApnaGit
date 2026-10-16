# 🚀 ApnaGit — Full-Stack Version Control System

ApnaGit is a full-stack version control system designed to help developers manage repositories, track code changes, and maintain commit history. It combines a custom command-line interface (CLI), a backend for version control operations, and a web interface for user interaction.

## ✨ Features

- **Repository Management:** Initialize and manage repositories.
- **Version Control:** Track file changes and maintain commit history.
- **Commit Management:** Create commits to save snapshots of changes.
- **Push & Pull:** Transfer changes between the CLI and the server.
- **Revert:** Restore an earlier version of files.
- **User Authentication:** Register and log in through the web application.
- **Web Interface:** Interact with ApnaGit through a React-based frontend.
- **Repository Storage:** Store repository and commit data on the server.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- JavaScript

### Database
- MongoDB
- Mongoose

### Development Tools
- Git
- GitHub
- Visual Studio Code
- npm

## 📁 Project Structure

```text
Version-control-project/
├── backend/                 # CLI and version control operations
├── frontend/                # React frontend application
├── git-server/              # Express server and authentication
│   ├── config/              # Database configuration
│   ├── controllers/         # Authentication and repository logic
│   ├── middleware/          # Authentication middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   └── server.js             # Server entry point
├── .gitignore
├── package.json
├── package-lock.json
└── README.md