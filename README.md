# 🚀 DocuSmith AI

### AI-Based Report & Proposal Generator

DocuSmith AI is a modern web application designed to simplify the creation of structured reports and proposals using artificial intelligence. It provides an intuitive interface for generating content, rewriting reports, and drafting proposals with a clean and user-friendly UI.

---

## ✨ Current Features

### 🏗 Report Generator (Build Mode)

* Create report structures using:

  * Headings
  * Subheadings
  * Word count inputs
* Designed to generate structured content based on user-defined formats

---

### 🔁 Replace Content

* Paste or upload an existing report
* Intended to:

  * Preserve structure (headings/subheadings)
  * Replace content with AI-generated text
* Includes reference input for improved accuracy

---

### 💬 Proposal Writing (AI Chat UI)

* Chat-based interface for drafting proposals
* Includes:

  * Chat history sidebar
  * AI suggestions
* Designed to refine ideas through conversation

---

### 👤 User Authentication

* Firebase Authentication integration
* Supports:

  * Email/Password login
  * Google authentication

---

### 🌐 Community Page

* Displays public projects
* Users can:

  * View shared content
  * Explore ideas from others

---

### 👤 Profile Section

* Displays user information
* Shows project history
* Option to make projects public

---

### 📄 Static Pages

* About Us
* Contact Us

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS + Custom CSS
* Component-based architecture

### Backend (Planned)

* FastAPI (Python) *(for AI + file processing)*

### Authentication & Database

* Firebase Authentication
* Firebase Firestore *(planned / partially integrated)*

---

## 📁 Project Structure

```bash
DocuSmith---AI-Based-Report-Generator/
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   └── Navigation/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Community/
│   │   ├── Dashboard/
│   │   ├── Features/
│   │   │   ├── ReportGenerator.jsx
│   │   │   ├── ReplaceContent.jsx
│   │   │   └── ProposalDrafter.jsx
│   │   ├── Profile/
│   │   └── Static/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── firebase.js
│
├── public/
│   ├── ImagesUsed/
│   └── UIDesigns/
│
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/itzychuu/DocuSmith---AI-Based-Report-Generator.git
cd DocuSmith---AI-Based-Report-Generator
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Firebase Setup

Create a Firebase project and enable:

* Authentication (Google + Email/Password)

Then update your Firebase config in:

```js
src/firebase.js
```

---

### 4️⃣ Run the App

```bash
npm run dev
```

---

## 🚧 Current Status

This project is currently in the **UI + Frontend MVP stage**.

### Implemented:

* UI for all major features
* Navigation system
* Firebase authentication
* Page structure

### In Progress:

* AI integration (Gemini / OpenAI)
* Backend (FastAPI)
* File processing (PDF, DOCX, code files)
* Export system (DOCX, PDF)

---

## 🚀 Future Improvements

* AI-powered content generation
* Word-count controlled output
* File upload and summarization
* Document export (PDF/DOCX)
* Rich text editor
* Usage tracking and rate limiting
* Deployment as a SaaS platform

---

## ⚠️ Disclaimer

This project is currently under development.
AI functionality and backend services are planned but not fully implemented yet.

---

## 👨‍💻 Author

Developed by **Vaishnav Shalikumar**

---

## ⭐ Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
