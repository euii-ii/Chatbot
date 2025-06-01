# 🤖 AI-Powered ChatBot

A modern, full-stack AI chat application built with Next.js, featuring real-time streaming responses, user authentication, and a responsive design optimized for all devices.

![AI ChatBot](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge&logo=clerk)

## 📱 Screenshots

### 💻 Desktop Experience
<div align="center">

**Main Chat Interface**
![Main Chat Interface](https://res.cloudinary.com/dporz9gz6/image/upload/v1748797845/Screenshot_31_f1cdui.png)

**Chat History & Sidebar**
![Chat History](https://res.cloudinary.com/dporz9gz6/image/upload/v1748797845/Screenshot_29_ega89v.png)

**AI Response with Code Highlighting**
![Code Highlighting](https://res.cloudinary.com/dporz9gz6/image/upload/v1748797845/Screenshot_30_ojci40.png)

</div>

### 📱 Mobile Experience
<div align="center">

**Mobile Responsive Design**
![Mobile Interface](https://res.cloudinary.com/dporz9gz6/image/upload/v1748798255/WhatsApp_Image_2025-06-01_at_22.47.00_31fdf547_xbtsmc.jpg)

*Optimized for mobile browsers with touch-friendly icons and proper sizing*

</div>

### 🎯 What You Can See in Screenshots

#### 💻 **Desktop Features Showcased:**
- **Clean Dark Theme** - Modern, professional interface
- **Real-time Chat** - Streaming AI responses with typing animation
- **Syntax Highlighting** - Code blocks with Prism.js integration
- **Action Icons** - Copy, regenerate, edit, like/dislike buttons
- **Sidebar Navigation** - Chat history and session management
- **Responsive Layout** - Optimized for laptop and desktop screens

#### 📱 **Mobile Features Showcased:**
- **Touch-Friendly Design** - Larger icons and proper spacing
- **Mobile Optimization** - No scrolling required for action buttons
- **Responsive Interface** - Adapts perfectly to mobile screens
- **Easy Navigation** - Accessible chat functions on mobile browsers
- **Consistent Experience** - Same functionality across all devices

## ✨ Features

### 🎯 Core Functionality
- **Real-time AI Chat** - Streaming responses with character-by-character display
- **Multiple AI Providers** - Support for DeepSeek, OpenAI, and OpenRouter APIs
- **Message Management** - Copy, edit, regenerate, and rate messages
- **Chat History** - Persistent conversation storage with MongoDB
- **User Authentication** - Secure login/signup with Clerk

### 🎨 User Experience
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Theme** - Modern dark UI with smooth animations
- **Syntax Highlighting** - Code blocks with Prism.js integration
- **Markdown Support** - Rich text formatting with react-markdown
- **Toast Notifications** - Real-time feedback for user actions

### 🔧 Technical Features
- **Streaming API** - Server-sent events for real-time responses
- **Database Integration** - MongoDB with Mongoose ODM
- **Type Safety** - TypeScript middleware and configurations
- **Performance Optimized** - Turbopack for fast development builds
- **Mobile Optimized** - Touch-friendly interface with proper sizing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database
- AI API key (DeepSeek/OpenAI/OpenRouter)
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd deepseek
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # AI API Keys (choose one or multiple)
   DEEPSEEK_API_KEY=your_deepseek_api_key
   OPENAI_API_KEY=your_openai_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
deepseek/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── chat/         # Chat-related endpoints
│   │   │   ├── ai/       # Main AI chat endpoint
│   │   │   ├── create/   # Create new chat
│   │   │   ├── get/      # Fetch user chats
│   │   │   ├── regenerate/ # Regenerate responses
│   │   │   └── ...       # Other chat operations
│   │   └── clerk/        # Clerk webhook handler
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout component
│   └── page.jsx          # Main chat interface
├── components/            # React Components
│   ├── Message.jsx       # Chat message component
│   ├── PromptBox.jsx     # Message input component
│   ├── Sidebar.jsx       # Chat history sidebar
│   └── ...               # Other components
├── context/              # React Context
│   └── AppContext.jsx    # Global app state
├── models/               # Database Models
│   ├── Chat.js          # Chat schema
│   └── User.js          # User schema
├── config/               # Configuration
│   └── db.js            # Database connection
├── assets/               # Static assets
│   └── *.svg            # Icons and images
└── utils/                # Utility functions
    └── toast.js         # Toast notifications
```

## 🔌 API Endpoints

### Chat Management
- `POST /api/chat/ai` - Send message to AI and get response
- `POST /api/chat/create` - Create new chat session
- `GET /api/chat/get` - Fetch user's chat history
- `POST /api/chat/regenerate` - Regenerate AI response
- `DELETE /api/chat/delete` - Delete chat session
- `PUT /api/chat/rename` - Rename chat session

### Authentication
- `POST /api/clerk` - Clerk webhook for user management

## 🎨 UI Components

### Message Component
- **Markdown rendering** with syntax highlighting
- **Action buttons** - Copy, edit, regenerate, like/dislike
- **Streaming animation** for real-time responses
- **Mobile-optimized** touch targets

### Sidebar Component
- **Chat history** with search functionality
- **Create new chat** button
- **Responsive design** with mobile overlay

### PromptBox Component
- **Multi-line input** with auto-resize
- **Send button** with loading states
- **Keyboard shortcuts** (Enter to send)

### Additional Components
- **ChatLabel** - Chat session labeling and management
- **PerformanceMonitor** - Real-time performance tracking

## 🔧 Configuration

### AI Provider Setup

The application supports multiple AI providers with automatic fallback:

1. **DeepSeek** (Primary)
   ```env
   DEEPSEEK_API_KEY=sk-your-deepseek-key
   ```

2. **OpenRouter** (Alternative)
   ```env
   OPENROUTER_API_KEY=sk-or-your-openrouter-key
   ```

3. **OpenAI** (Fallback)
   ```env
   OPENAI_API_KEY=sk-your-openai-key
   ```

### Database Configuration

MongoDB connection with Mongoose:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Authentication Setup

Clerk configuration for user management:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 📱 Mobile Optimization

### Responsive Design
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** buttons and interactions
- **Optimized spacing** for mobile browsers
- **Proper viewport** configuration

### Mobile Features
- **Always visible icons** - No scrolling required
- **Larger touch targets** - 20px icons on mobile
- **Swipe gestures** - Sidebar toggle on mobile
- **Keyboard optimization** - Proper input handling

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Development Features
- **Hot reload** with Turbopack
- **TypeScript support** for middleware
- **ESLint configuration** with Next.js rules
- **Tailwind CSS** for styling

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in your deployment platform:
- Database connection string
- Clerk authentication keys
- AI API keys
- Webhook URLs

### Build Optimization
- **Static optimization** for better performance
- **Image optimization** with Next.js Image component
- **Font optimization** with Next.js font loading
- **Bundle analysis** for size optimization

### Deployment Platforms
- **Vercel** (Recommended) - Seamless Next.js deployment
- **Netlify** - Static site hosting with serverless functions
- **Railway** - Full-stack deployment with database
- **AWS/GCP/Azure** - Cloud platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - React framework for production
- **Clerk** - Authentication and user management
- **MongoDB** - Database for chat storage
- **DeepSeek** - AI model for chat responses
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Markdown rendering
- **Prism.js** - Syntax highlighting

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Built with ❤️ using Next.js and modern web technologies**
