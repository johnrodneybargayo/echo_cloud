<div style="display: flex; justify-content: center; align-items: center;">
  <img src="https://github.com/user-attachments/assets/d8ea19e1-c949-4e48-b88b-17712eb940bc" alt="VerbiVibe" />
</div>

# VerbiVibe 🎨✨

VerbiVibe is a modern, responsive web application designed for real-time word clouds and interactive happiness scale visualizations. It enables users to submit words that dynamically build a word cloud, as well as participate in happiness level surveys. This application is optimized for desktop, tablet, and mobile displays with a playful and engaging user interface.

## 🌟 Features

- **Real-Time Word Cloud**: Users can submit words, and the word cloud updates in real time based on frequency
- **Happiness Level Survey**: Collects happiness levels from users with a dynamic, visually engaging scale
- **Admin Dashboard**: Modern dashboard with enhanced UI/UX for managing questions, presentations, and settings
- **Question Manager**: Add, edit, and delete questions with an intuitive grid-based interface
- **Presentation Mode**: Start and control live presentations with QR code sharing for participant access
- **QR Code Integration**: Generate QR codes for easy participant joining during presentations
- **Real-time Synchronization**: Live updates across all connected participants during presentations
- **Mobile-Friendly Design**: Fully responsive layout with TailwindCSS for consistent experience across all devices
- **User Authentication**: Secure Google authentication with role-based access control
- **Role Management**: Admin users can assign and manage user roles
- **Database Management**: Admin users can reset and manage application data
- **Modern UI**: Enhanced with TailwindCSS, gradients, animations, and playful design elements
- **Compact Card Layout**: Questions displayed as smaller, more manageable cards in a responsive grid

## 🚀 Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/johnrodneybargayo/verbiVibe.git
    ```
2. Navigate into the project directory:
    ```bash
    cd verbiVibe
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up Firebase configuration in `.env` file:
    ```plaintext
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_DATABASE_URL=your_database_url
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    ```
5. Start the development server:
    ```bash
    npm start
    ```

## 📱 Usage

1. **Admin Dashboard**: Navigate to `/dashboard` to access the admin panel
2. **Question Manager**: Add, edit, and manage questions with the enhanced grid interface
3. **Start Presentation**: Use the magical start presentation button to begin live sessions
4. **QR Code Sharing**: Share the generated QR code with participants for easy joining
5. **Word Input**: Participants enter words on the `/enter/:questionId` page
6. **Display Word Cloud**: View the live word cloud at `/display/:questionId`
7. **Happiness Scale**: Collect happiness data with the interactive scale
8. **Real-time Sync**: All participants see updates in real-time during presentations
9. **Waiting Room**: Participants can join via `/waiting-room` and wait for the presentation to start

## 🏗️ Project Structure

- **components/**: Reusable React components with modern styling
  - **Dashboard/**: Admin dashboard components with enhanced UI and QR code functionality
  - **ui/**: Shared UI components
  - **loader/**: Loading animations and spinners
- **hooks/**: Custom React hooks for state management
- **pages/**: High-level page components including waiting room and presentation pages
- **context/**: React context providers for global state
- **firebase/**: Firebase configuration and services
- **utils/**: Utility functions including real-time synchronization helpers
- **styles/**: Global styles and TailwindCSS configuration

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Firebase**: Real-time database and authentication
- **React Router**: Client-side routing
- **Chart.js**: Data visualization for happiness metrics
- **React Icons**: Beautiful icon library
- **QRCode.react**: QR code generation for participant access
- **Responsive Design**: Mobile-first approach with modern CSS

## 🎨 Design System

- **Colors**: Playful gradient color palette with custom TailwindCSS colors
- **Animations**: Smooth transitions, hover effects, and custom keyframe animations
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent design language across all UI elements with compact card layouts
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation
- **Grid Layout**: Responsive grid system for optimal content organization

## 📋 Changelog

For detailed changes and version history, see [CHANGELOG.md](CHANGELOG.md).

### Latest Updates (v0.3.1)
- 🐛 Fixed QRCode import error in presentation functionality
- 🎨 Enhanced question display with compact card layout
- 📱 Improved grid responsiveness and mobile experience
- 🎯 Fixed sidebar title color for better readability
- ⚡ Resolved TypeScript and CSS linting warnings

### Previous Updates (v0.3.0)
- ✨ Added TailwindCSS integration with playful design system
- 🎨 Enhanced start presentation button with gradients and animations
- 📱 Improved mobile responsiveness across all components
- 🖼️ Removed logo borders for cleaner appearance
- 🎭 Added custom animations and hover effects
- 📱 Added QR code functionality for presentations

## 🤝 Contributing

1. Fork the repository
2. Create a new feature branch:
    ```bash
    git checkout -b feature/amazing-feature
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m 'Add some amazing feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/amazing-feature
    ```
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape VerbiVibe
- Special thanks to the open-source community for the amazing tools and libraries
- Inspired by the need for engaging, real-time collaborative tools

---

**Made with ❤️ and lots of ☕**

Thank you for using VerbiVibe! Feel free to contribute to its growth and share your feedback. Let's make presentations more engaging and fun! 🎉
