# LearnLoop - The Student's Workplace

LearnLoop is a responsive web application designed as a one-stop workplace for students. It features a suite of tools to aid in learning, collaboration, and organization, from a real-time whiteboard to an AI-powered homework helper.

## Features

-   **Elegant & Responsive UI:** With Dark and Light theme options.
-   **Dashboard:** A central hub showing active friends, recent materials, and homework status.
-   **Collaborative WhiteBoard:** Touch-supported whiteboard with tools like pen, eraser, and text. Syncs with friends in real-time.
-   **Social Feed & Chat:** Find and add friends, and communicate via text and calls.
-   **AI Homework Helper:** A mini-Gemini trained to assist with questions from K-12 to university-level engineering.
-   **Quiz Section:** Test your knowledge in various fields and track your progress with a knowledge graph.
-   **To-Do List:** A task manager to add, schedule, and track tasks.

## Tech Stack

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **Backend:** Node.js, Express.js
-   **Database:** MySQL
-   **Real-time Communication:** Socket.IO

## Setup & Installation

Follow these instructions to get a local copy up and running.

### Prerequisites

-   Node.js and npm ([Download](https://nodejs.org/))
-   MySQL ([Download](https://dev.mysql.com/))
-   Git ([Download](https://git-scm.com/))

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/YourUsername/learnloop-student-workplace.git](https://github.com/YourUsername/learnloop-student-workplace.git)
    cd learnloop-student-workplace
    ```

2.  **Setup the Backend:**
    ```sh
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add your database credentials and secrets:
    ```env
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_DATABASE=learnloop
    JWT_SECRET=your_jwt_secret
    ```

3.  **Setup the Database:**
    -   Log in to your MySQL server as the root user.
    -   Run the commands in the `database.sql` file to create the database and tables.

4.  **Run the Application:**
    -   **Start the backend server:** From the `/backend` directory, run:
        ```sh
        npm start
        ```
    -   **Start the frontend:** Open the `frontend/index.html` file with a live server extension (like the one in VS Code).

---
*This project was designed by Gemini.*