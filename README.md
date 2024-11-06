# VerbiVibe

VerbiVibe is a responsive web application designed for real-time word clouds and interactive happiness scale visualizations. It enables users to submit words that dynamically build a word cloud, as well as participate in happiness level surveys. This application is optimized for desktop, tablet, and mobile displays.

## Features

- **Real-Time Word Cloud**: Users can submit words, and the word cloud updates in real time based on frequency.
- **Happiness Level Survey**: Collects happiness levels from users with a dynamic, visually engaging scale.
- **Admin Panel**: Manage questions, reset the word cloud, and view submission statistics.
- **Question Manager**: Add, edit, and delete questions with an easy-to-use interface, organized in a 3x3 grid layout.
- **Mobile-Friendly Design**: Fully responsive layout across desktop, tablet, and mobile devices.

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
