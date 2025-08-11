# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2024-12-19

### Fixed
- Fixed QRCode import error in QuestionManager component
- Updated qrcode.react import to use default export instead of named export
- Resolved TypeScript compilation errors related to QR code generation
- Improved presentation functionality with proper QR code display

### Changed
- Enhanced question display layout with smaller, more compact cards
- Improved grid responsiveness for better screen utilization
- Updated sidebar title color from white to dark gray for better readability
- Optimized CSS for better mobile experience

## [0.3.0] - 2024-12-19

### Added
- TailwindCSS integration for modern utility-first styling
- Playful and colorful design system with custom color palette
- Enhanced start presentation button with gradient animations and emojis
- Separate CHANGELOG.md file for better version tracking
- Custom TailwindCSS animations (bounce-slow, pulse-slow, wiggle)
- QR code functionality for presentation mode
- Real-time presentation synchronization

### Changed
- Updated start presentation button with TailwindCSS classes and playful design
- Improved mobile responsiveness across all components
- Enhanced user experience with smooth animations and transitions
- Modernized color scheme with gradient backgrounds
- Redesigned question cards for better visual hierarchy

### Fixed
- Removed borders from logo elements across all components
- Improved button accessibility and hover states
- Enhanced visual consistency across the application
- Fixed CSS vendor prefix warnings for line-clamp properties
- Resolved unused variable warnings in TypeScript
- Fixed useEffect dependency warnings in React components

### Security
- Updated dependencies to latest stable versions

## [0.2.0] - 2024-11-15

### Added
- Route Addition: Added `/happiness-bar-chart/:questionId` route for better navigation to specific question data
- HappinessInput Update: Adjusted `HappinessInput` to support navigation to `/happiness-bar-chart/:questionId` route for enhanced dynamic routing
- Error Handling: Improved routing logic for handling unmatched routes to ensure correct page display based on question types
- TypeScript Improvements: Resolved type-checking issues with question type comparisons, improving stability

### Changed
- Enhanced dashboard layout and styling for better presentation
- Improved mobile responsiveness across all components

## [0.1.8] - 2024-11-08

### Added
- User Authentication: Integrated Google authentication allowing users to log in with their Google accounts
- Role Management: Admin users can now assign roles (admin, participant) to users upon login
- Admin Panel Features: Admins can now manage roles, reset the word cloud, and view submission statistics
- Database Clear Functionality: Added an option for admins to clear/reset the Firebase database through the admin panel
- Loader State: Introduced a loading spinner during data fetching or database reset operations to improve user experience
- User Display Name Fix: Ensured that the user's full name from the Firebase database (`displayName`) is correctly displayed instead of a fallback 'User' name

### Changed
- Updated question manager layout to improve user experience
- Enhanced security with proper authentication checks

## [0.1.7] - 2024-10-31

### Changed
- Updated question manager layout to improve user experience

## [0.1.6] - 2024-10-30

### Added
- Question manager page to allow users to add, edit, and delete questions

## [0.1.5] - 2024-10-20

### Changed
- Adjusted word count display for better clarity and layout
- Updated happiness level UI for improved responsiveness

## [0.1.4] - 2024-10-19

### Changed
- Enhanced mobile responsiveness on happiness scale components
- Modified background colors for word cloud to improve visual appeal

## [0.1.3] - 2024-10-18

### Changed
- Adjusted text and background colors to align with accessibility standards
- Changed project name to VerbiVibe

## [0.1.2] - 2024-10-15

### Added
- Added logos on various pages
- Updated scale values for happiness input

## [0.1.1] - 2024-10-14

### Added
- Added end-game button for quick navigation to the thank you page
- Created admin page with options to reset the word cloud and other data

## [0.1.0] - 2024-10-13

### Added
- Enhanced background color and added animations to word cloud elements

### Changed
- Modified favicon for a better visual experience
- Updated homepage layout and added QR code for easy access

### Fixed
- Fixed Firebase connection settings for enhanced data stability
- Initial commits and setup for VerbiVibe project