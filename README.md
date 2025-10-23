# 📝 Tududi Kanban MVP

A simplified, self-hosted task management app with **Kanban board** and **task statuses**. Built as an MVP based on [chrisvel/tududi](https://github.com/chrisvel/tududi).

## ✨ Features

- **Task Management**: Create, update, and delete tasks
- **Task Statuses**: Organize tasks by status (To Do, In Progress, Done)
- **Kanban Board**: Visual board view with drag-and-drop between status columns
- **List View**: Traditional list view of all tasks
- **Projects**: Group tasks into projects
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Self-Hosted**: Keep your data private with SQLite database

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gitmvp-com/tududi-kanban-mvp.git
   cd tududi-kanban-mvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   export TUDUDI_USER_EMAIL=admin@example.com
   export TUDUDI_USER_PASSWORD=password123
   export TUDUDI_SESSION_SECRET=$(openssl rand -hex 64)
   ```

4. Initialize the database:
   ```bash
   npm run db:init
   ```

5. Start the development servers:
   ```bash
   npm start
   ```

6. Open your browser to `http://localhost:8080`

### Default Credentials

If no environment variables are set:
- **Email**: dev@example.com
- **Password**: password123

## 🛠️ Development

- **Frontend dev server**: `npm run frontend:dev` (runs on port 8080)
- **Backend server**: `npm run backend:start` (runs on port 3002)
- **Build for production**: `npm run build`

## 🎯 What's Different from Original Tududi?

This MVP focuses on core task management with Kanban:

**Added:**
- ✅ Task status field (To Do, In Progress, Done)
- ✅ Kanban board view with drag-and-drop
- ✅ Visual status indicators

**Removed for simplicity:**
- ❌ Telegram integration
- ❌ Recurring tasks
- ❌ Subtasks
- ❌ Tags and Areas
- ❌ Notes
- ❌ Calendar view
- ❌ Multi-language support
- ❌ User sharing/collaboration
- ❌ Advanced filters

## 📦 Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript 5.6.2
- Tailwind CSS 3.4.13
- React Router 6.26.2
- dnd-kit (drag and drop)
- Zustand (state management)
- Webpack 5

**Backend:**
- Express 4.21.2
- Sequelize 6.37.7
- SQLite 5.1.7
- Express Session
- Bcrypt for password hashing

## 📝 License

MIT

## 🙏 Credits

Based on [tududi](https://github.com/chrisvel/tududi) by [Chris Veleris](https://github.com/chrisvel)
