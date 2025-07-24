# // PROTOCOL_V.0.1

Welcome, net-runner, to a retro-futuristic web interface. This project combines a dynamic frontend with a robust Java Spring Boot backend to deliver real-time system data, personal profiles, and live project updates, all against a backdrop of iconic digital rain.

## // FEATURES_OVERVIEW

* **Dynamic System Status:** Real-time updates on system operational status, version, server load, and critical messages, fetched directly from the backend.

* **Personal Data Profile (CV):** Access a cyberpunk-themed text-based CV, loaded dynamically from the backend, fitting the aesthetic of a secure data log.

* **GitHub Project Integration:** Displays your public GitHub repositories, including project titles, descriptions, languages, and last update times, seamlessly pulled via the backend.

* **Classic Digital Rain Background:** An immersive 3D animation powered by `three.js` that simulates the iconic falling code, giving the page a true Matrix-like feel.

* **Retro Typing Effect:** The main headline features a classic terminal-style typing animation.

* **Responsive Design:** Optimized for viewing across various devices (desktop, tablet, mobile).

## // TECHNOLOGIES_USED

### Frontend:

* **HTML5:** Structure of the web page.

* **CSS3 (Tailwind CSS):** Modern utility-first CSS framework for rapid styling and responsive design.

* **JavaScript:** Core interactivity and data fetching.

* **Three.js:** JavaScript 3D library for rendering the dynamic background.

### Backend:

* **Java 17+**

* **Spring Boot:** Framework for building the RESTful API.

* **Maven:** Project automation and dependency management.

* **GitHub API:** Used by the backend to fetch project data.

## // SETUP_AND_INSTALLATION

To get this project up and running on your local machine, follow these steps:

### Prerequisites:

* **Java Development Kit (JDK) 17 or higher:** Required for the Spring Boot backend.

* **Visual Studio Code (VS Code):** Recommended IDE for development.

  * Ensure you have the "Extension Pack for Java" by Microsoft installed in VS Code.

For detailed installation instructions for JDK and VS Code on Ubuntu, please refer to the [Setting Up Java Backend and Frontend on Ubuntu with VS Code](https://www.google.com/search?q=https://gemini.google.com/app/ubuntu-vscode-java-guide) Canvas.

### Backend Setup (`cyberpunk-backend-java`):

1. **Generate Spring Boot Project:**

   * Go to [Spring Initializr](https://start.spring.io/).

   * Configure as a **Maven Project**, **Java**, **Spring Boot (latest stable)**.

   * **Group:** `com.cyberpunk` (or your preference)

   * **Artifact:** `neoncity` (or your preference)

   * **Dependencies:** Add `Spring Web`.

   * Generate and download the `.zip` file.

   * Unzip the project to your desired directory (e.g., `~/projects/neoncity-backend`).

2. **Add Backend Code:**

   * Open the unzipped project in VS Code (`File > Open Folder...`).

   * Navigate to `src/main/java/com/cyberpunk/neoncity/` (adjust `com.cyberpunk.neoncity` to your group/artifact).

   * **`NeonCityApplication.java`**: Replace its content with the code from the `NeonCityApplication.java` section of the `cyberpunk-backend-java` Canvas.

   * **`SystemStatusController.java`**: Create this file in the same directory and paste the content from the `SystemStatusController.java` section of the `cyberpunk-backend-java` Canvas.

     * **IMPORTANT:** In `SystemStatusController.java`, update the `githubUsername` variable in the `getGithubProjects()` method to your actual GitHub username (e.g., `String githubUsername = "YourGitHubUsername";`).

3. **Create `cv.txt`:**

   * In your Spring Boot project, navigate to `src/main/resources`.

   * Create a new file named `cv.txt` in this directory.

   * Populate `cv.txt` with your cyberpunk-themed CV content (e.g., as provided in the `cyberpunk-cv-txt` Canvas).

4. **Run the Backend:**

   * Open `NeonCityApplication.java` in VS Code.

   * Click the "Run" button above the `main` method.

   * Verify in the VS Code terminal that the application starts on port `8080`.

### Frontend Setup (`index.html` and `script.js`):

1. **Download Files:**

   * Save the `index.html` content (from the `cyberpunk-website` Canvas) as `index.html` in a new directory (e.g., `~/projects/neoncity-frontend`).

   * Save the `script.js` content (from the `cyberpunk-script-js` Canvas) as `script.js` in the *same directory* as `index.html`.

2. **Run the Frontend:**

   * Open `index.html` directly in your web browser (e.g., by double-clicking the file or dragging it into a browser window).

## // USAGE

Once both the backend and frontend are running:

* The "SYSTEM STATUS REPORT" section will automatically display data from your Spring Boot backend.

* The "ABOUT ME" section will load your `cv.txt` content.

* The "PROJECTS" section will display your public GitHub repositories.

* The background will feature the classic Matrix digital rain effect.

* Click "REFRESH STATUS" to update the system data.

## // LICENSE

This project is open-source and available under the MIT License
