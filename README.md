# 🤖 AI Code Assistant

A powerful developer assistant that uses **LLMs (Large Language Models)** to **refactor**, **explain**, and **generate tests** for your code – with seamless **GitHub integration** for creating Pull Requests.

> Built with ❤️ using Next.js, Express.js, and OpenAI APIs.

---

## 🚀 Features

- ✨ **Code Editor** with syntax highlighting
- 🔍 **AI Workflows**: Refactor, Explain, Generate Tests
- 💾 **Version History** (auto-saving via `localStorage`)
- 🔐 **GitHub OAuth** login
- 📂 **Fetch Your Repositories**
- 📤 **Create Pull Requests** from AI-generated code
- 🌐 **Deployed Full Stack App**
  - Frontend: Vercel
  - Backend: Render

---

## 📸 Live Demo

- 🖥️ **Frontend (Vercel)**: [https://ai-code-assistant-eight.vercel.app/](https://ai-code-assistant-eight.vercel.app/)
- ⚙️ **Backend (Render)**: [https://ai-code-assistant-rioj.onrender.com](https://ai-code-assistant-rioj.onrender.com)

---

## 🧩 Tech Stack

| Layer      | Tech Used                     |
|------------|-------------------------------|
| Frontend   | React + Next.js + TailwindCSS |
| Backend    | Express.js + OpenAI SDK       |
| Auth       | GitHub OAuth (OAuth2 flow)    |
| Realtime   | Socket.IO (code sync)         |
| Deployment | Vercel (UI) + Render (API)    |

---

## 📁 Folder Structure

```
ai-code-assistant/
├── ai-code-assistant-ui/       # Frontend (Next.js)
│   ├── components/             # UI Components
│   ├── pages/                  # Main Editor Page
│   └── ...
├── backend/                    # Backend (Express)
│   ├── routes/                 # GitHub & OpenAI APIs
│   └── server.js               # Express app entry point
└── README.md                   # This file
```

---

## 🛠️ Local Development

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/isakibul15/ai-code-assistant
cd ai-code-assistant
```

### 2️⃣ Setup Backend (`/backend`)

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ Never commit `.env` to GitHub!

### 3️⃣ Start Backend Server

```bash
node server.js
```

> Runs at: `http://localhost:8080`

### 4️⃣ Setup Frontend (`/ai-code-assistant-ui`)

```bash
cd ../ai-code-assistant-ui
npm install
npm run dev
```

> Runs at: `http://localhost:3000`

---

## 🔐 GitHub OAuth Setup

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Create a new app:
   - **Homepage**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:8080/auth/github/callback`
3. Copy `Client ID` and `Client Secret` → add to backend `.env`

---

## 🧪 How to Use

1. Visit `http://localhost:3000`
2. Sign in with GitHub
3. Select a workflow: **Refactor**, **Explain**, or **Generate Tests**
4. Paste your code → Click **Send to AI**
5. Review or restore previous versions
6. Enter your repo name → Create a Pull Request 🎉

---

## 📦 Deployment

### ✅ Frontend (Vercel)

- Connect the `/ai-code-assistant-ui` folder to Vercel
- Set build command: `npm run build`
- Set output directory: `.next`

### ✅ Backend (Render)

- Connect the `/backend` folder to Render
- Set environment: `Node.js`
- Start command: `node server.js`
- Add environment variables:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`
  - `OPENAI_API_KEY`

---

## ✅ Completed Milestones

- ✅ GitHub OAuth
- ✅ Repo Fetch
- ✅ Code Editor with syntax + real-time sync
- ✅ AI workflows with OpenAI
- ✅ Version Save/Restore
- ✅ Create Pull Request API
- ✅ UI polish (spacing, shadows)
- ✅ Deploy to Vercel + Render

---

## 💡 Future Improvements

- 🔐 JWT-based session authentication
- ⚙️ CI/CD using GitHub Actions
- 🐳 Docker support
- 👥 Team collaboration mode
- 🔍 AI diff viewer for changes

---

## 👨‍💻 Author

**Md. Sakibul Islam**  
📫 sakibulislam.dev@gmail.com  
🔗 [https://github.com/isakibul15](https://github.com/isakibul15)

---

## 📄 License

MIT — feel free to fork, modify, and build upon this project!
