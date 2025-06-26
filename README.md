# DevProFlow - A Lightweight Project Management System

DevProFlow is a lightweight, modern project management system designed to help teams and individuals efficiently plan, track, and manage their projects. It features a clear separation of concerns with a NestJS-powered backend and a Next.js frontend, providing a seamless full-stack development and user experience.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend (NestJS)](#backend-nestjs)
  - [Frontend (Next.js)](#frontend-nextjs)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 📁 Create, edit, and manage projects and tasks
- 👥 Assign tasks to users and track progress
- 🚦 Status tracking, priorities, and deadlines
- 🔒 Authentication and authorization
- 💡 Intuitive, user-friendly interface
- ⚡ Fast, lightweight, and easy to deploy

---

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (React), TypeScript, CSS
- **Backend:** [NestJS](https://nestjs.com/) (Node.js), TypeScript
- **Other:** REST API, JWT authentication (or OAuth, depending on config), modern JavaScript tooling

---

## Project Structure

```
root/
│
├── backend/      # NestJS backend (API, business logic, data models)
│
└── frontend/     # Next.js frontend (UI, React components, pages)
```

---

## Getting Started

This project contains **two separate applications**: the backend and the frontend. You will need to set up and run both for full functionality.

---

### Backend (NestJS)

1. **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the development server:**
    ```bash
    npm run start:dev
    ```

---

### Frontend (Next.js)

1. **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    - Copy the example file and edit as needed:
      ```bash
      cp .env.example .env
      ```
    - Update the backend API URL and any other config in `.env`

4. **Run the development server:**
    ```bash
    npm run dev
    ```

5. **The frontend will be available at:**  
   [http://localhost:3000](http://localhost:3000) (default, see your `.env` for port)

---

> **Note:**  
> The frontend relies on the backend API. Make sure the backend server is running before starting the frontend application.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

---