<div style="display: flex; justify-content: center; align-items: center;">
  <img src="https://github.com/user-attachments/assets/d8ea19e1-c949-4e48-b88b-17712eb940bc" alt="VerbiVibe" />
</div>

# VerbiVibe

VerbiVibe is a responsive web application designed for real-time word clouds and interactive happiness scale visualizations. It enables users to submit words that dynamically build a word cloud, as well as participate in happiness level surveys. This application is optimized for desktop, tablet, and mobile displays.

## Features

- **Real-Time Word Cloud**: Users can submit words, and the word cloud updates in real time based on frequency.
- **Happiness Level Survey**: Collects happiness levels from users with a dynamic, visually engaging scale.
- **Admin Panel**: Manage questions, reset the word cloud, and view submission statistics.
- **Question Manager**: Add, edit, and delete questions with an easy-to-use interface, organized in a 3x3 grid layout.
- **Mobile-Friendly Design**: Fully responsive layout across desktop, tablet, and mobile devices.
- **User Authentication**: Google authentication allows users to log in, and their roles are automatically assigned (admin or participant).
- **Role Management**: Admin users can assign roles to users after authentication.
- **Database Reset**: Admin users can reset the word cloud and database data from the admin panel.

## Installation

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

## Usage

1. **Question Manager**: Navigate to `/manage-questions` to add or edit questions.
2. **Word Input**: Enter words on the `/enter/:questionId` page.
3. **Display Word Cloud**: View the live word cloud at `/display/:questionId`.
4. **Admin Panel**: Reset data and manage settings on the `/admin` page.

## Project Structure

- **components/**: Contains reusable components like `WordCloud`, `WordInput`, `HappinessInput`, and `QuestionManager`.
- **hooks/**: Custom React hooks for managing state, such as `useWords`.
- **pages/**: High-level pages like `AdminPage`, `ThankYouPage`, and `HappinessBarChart`.
- **context/**: Context providers for global state management, including `QuestionsContext`.

## Technologies Used

- **React**: For building the user interface.
- **Firebase**: Real-time database for storing word submissions and questions.
- **TypeScript**: Typed JavaScript for better maintainability.
- **CSS**: Styling and layout management.
- **Responsive Design**: Ensures usability across various devices.

## Changelog

### 2024-11-15
- **Route Addition**: Added `/happiness-bar-chart/:questionId` route for better navigation to specific question data.
- **HappinessInput Update**: Adjusted `HappinessInput` to support navigation to `/happiness-bar-chart/:questionId` route for enhanced dynamic routing.
- **Error Handling**: Improved routing logic for handling unmatched routes to ensure correct page display based on question types.
- **TypeScript Improvements**: Resolved type-checking issues with question type comparisons, improving stability.

### 2024-11-08
- **Added User Authentication**: Integrated Google authentication allowing users to log in with their Google accounts.
- **Role Management**: Admin users can now assign roles (admin, participant) to users upon login.
- **Admin Panel Features**: Admins can now manage roles, reset the word cloud, and view submission statistics.
- **Database Clear Functionality**: Added an option for admins to clear/reset the Firebase database through the admin panel.
- **Loader State**: Introduced a loading spinner during data fetching or database reset operations to improve user experience.
- **User Display Name Fix**: Ensured that the user’s full name from the Firebase database (`displayName`) is correctly displayed instead of a fallback 'User' name.

### 2024-10-31
- Updated question manager layout to improve user experience.

### 2024-10-30
- Added question manager page to allow users to add, edit, and delete questions.

### 2024-10-20
- Adjusted word count display for better clarity and layout.
- Updated happiness level UI for improved responsiveness.

### 2024-10-19
- Enhanced mobile responsiveness on happiness scale components.
- Modified background colors for word cloud to improve visual appeal.

### 2024-10-18
- Adjusted text and background colors to align with accessibility standards.
- Changed project name to VerbiVibe.

### 2024-10-15
- Added logos on various pages.
- Updated scale values for happiness input.

### 2024-10-14
- Added end-game button for quick navigation to the thank you page.
- Created admin page with options to reset the word cloud and other data.

### 2024-10-13
- Enhanced background color and added animations to word cloud elements.

### 2024-10-12
- Modified favicon for a better visual experience.
- Updated homepage layout and added QR code for easy access.

### 2024-10-10
- Fixed Firebase connection settings for enhanced data stability.
- Initial commits and setup for VerbiVibe project.

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m 'Add new feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License.

---

Thank you for using VerbiVibe! Feel free to contribute to its growth and share your feedback.
