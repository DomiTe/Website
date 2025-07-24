// --- Three.js Classic Digital Rain Background Script ---
let scene, camera, renderer;
let characterMeshes = [];
// Using a combination of alphanumeric and common symbols for a "code" look
const characterPool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[{]}|;:',<.>/?`~";
const NUM_COLUMNS = 60; // Number of vertical streams of characters
const COLUMN_SPACING = 5; // Spacing between columns
const CHARACTER_SIZE = 2; // Size of each character (plane)
const FALL_SPEED_BASE = 0.5; // Base speed at which characters fall
const STREAM_LENGTH = 20; // Number of characters in each stream

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0A0A); // Dark background

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100); // Position camera to view the falling code

    // Renderer
    const canvas = document.getElementById('three-canvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create character streams
    const material = new THREE.MeshBasicMaterial({ color: 0x39FF14, transparent: true, blending: THREE.AdditiveBlending }); // Neon green with glow

    for (let i = 0; i < NUM_COLUMNS; i++) {
        const xPos = (i - NUM_COLUMNS / 2) * COLUMN_SPACING;
        const startY = (Math.random() * 200) - 100; // Random starting Y position for each stream
        const streamSpeed = FALL_SPEED_BASE + (Math.random() * 0.2 - 0.1); // Slightly varied speed

        for (let j = 0; j < STREAM_LENGTH; j++) {
            const charIndex = Math.floor(Math.random() * characterPool.length);
            const char = characterPool[charIndex];

            // Using a simple plane for each character for performance
            const geometry = new THREE.PlaneGeometry(CHARACTER_SIZE, CHARACTER_SIZE);
            const mesh = new THREE.Mesh(geometry, material.clone()); // Clone material to allow individual opacity

            mesh.position.set(xPos, startY - (j * CHARACTER_SIZE * 1.5), 0); // Spaced vertically
            mesh.userData = {
                char: char, // Store the character (though not visually rendered as text)
                speed: streamSpeed,
                initialY: startY - (j * CHARACTER_SIZE * 1.5),
                streamIndex: i,
                charIndexInStream: j
            };

            // Assign varying opacity to create the "tail" effect
            mesh.material.opacity = 0.1 + (j / STREAM_LENGTH) * 0.8; // Fades from faint to bright

            characterMeshes.push(mesh);
            scene.add(mesh);
        }
    }

    // Event Listener for responsiveness
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    characterMeshes.forEach(charMesh => {
        charMesh.position.y -= charMesh.userData.speed; // Move character downwards

        // If character goes off screen, reset it to the top
        if (charMesh.position.y < -window.innerHeight / 2 - CHARACTER_SIZE) {
            charMesh.position.y = window.innerHeight / 2 + CHARACTER_SIZE; // Reset to top
            // Optionally change character for a dynamic look
            charMesh.userData.char = characterPool[Math.floor(Math.random() * characterPool.length)];
        }

        // Simulate character "flickering" or changing
        if (Math.random() < 0.01) { // 1% chance to change character
            charMesh.userData.char = characterPool[Math.floor(Math.random() * characterPool.length)];
        }

        // Note: To actually render text characters, you would need a TextGeometry
        // or a texture atlas, which is more complex. For this example, we're
        // simulating the effect with moving planes.
        // If you want actual text, a library like 'troika-three-text' would be needed.
    });

    renderer.render(scene, camera);
}

// --- Website Content Functions ---

/**
 * Fetches system status data from the Java backend API and updates the UI.
 */
async function fetchSystemStatus() {
    const statusOutputDiv = document.getElementById('system-status-output');
    statusOutputDiv.innerHTML = '<p>Connecting to neural network...</p>'; // Loading message

    try {
        // IMPORTANT: Ensure your Spring Boot backend is running on http://localhost:8080
        const response = await fetch('http://localhost:8080/api/status');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse the JSON response

        // Format the data for display
        let outputHtml = '';
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                outputHtml += `<p><span class="text-neon-green">${key.toUpperCase()}:</span> ${data[key]}</p>`;
            }
        }
        statusOutputDiv.innerHTML = outputHtml; // Update the div with fetched data

    } catch (error) {
        console.error('Error fetching system status:', error);
        statusOutputDiv.innerHTML = '<p class="text-red-500">ERROR: Could not connect to backend. Is the server running? Check console for details.</p>';
    }
}

/**
 * Fetches "About Me" (CV TXT) data from the Java backend API and displays it.
 */
async function fetchAboutMe() {
    const aboutMeOutputDiv = document.getElementById('about-me-output');
    aboutMeOutputDiv.innerHTML = '<p>Retrieving personal data from secure archives...</p>'; // Loading message

    try {
        // Calls the /api/cv endpoint, expecting plain text
        const response = await fetch('http://localhost:8080/api/cv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Expecting plain text, not JSON
        const textContent = await response.text();

        // Use textContent and whitespace-pre-wrap to preserve formatting from the file
        aboutMeOutputDiv.textContent = textContent;

    } catch (error) {
        console.error('Error fetching about me data:', error);
        aboutMeOutputDiv.innerHTML = '<p class="text-red-500">ERROR: Could not retrieve personal data. Access denied.</p>';
    }
}

/**
 * Fetches "Projects" data from the Java backend API (now from GitHub) and updates the UI.
 */
async function fetchProjects() {
    const projectsOutputDiv = document.getElementById('projects-output');
    projectsOutputDiv.innerHTML = '<p>Scanning active contracts database...</p>'; // Loading message

    try {
        // Calls the /api/projects endpoint, which now fetches from GitHub
        const response = await fetch('http://localhost:8080/api/projects');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json(); // This will be an array of project objects from GitHub

        let projectsHtml = '';
        if (projects.length === 0) {
            projectsHtml = '<p>No active projects found. Initiate new contracts?</p>';
        } else {
            projects.forEach(project => {
                // Format last_updated for better readability (optional)
                const lastUpdated = project.last_updated ? new Date(project.last_updated).toLocaleDateString() : 'N/A';

                projectsHtml += `
                    <div class="border-b border-gray-700 pb-2">
                        <h4 class="text-xl font-bold text-neon-green">
                            Project: <a href="${project.url}" target="_blank" class="text-electric-blue hover:text-hot-pink no-underline">${project.title}</a>
                            <span class="text-gray-500 text-sm">// Language: ${project.language} // Last Update: ${lastUpdated}</span>
                        </h4>
                        <p class="text-base text-gray-400">
                            ${project.description}
                        </p>
                    </div>
                `;
            });
        }
        projectsOutputDiv.innerHTML = projectsHtml;

    } catch (error) {
        console.error('Error fetching projects data:', error);
        projectsOutputDiv.innerHTML = '<p class="text-red-500">ERROR: Could not retrieve project data from GitHub. Network anomaly detected or API rate limit reached.</p>';
    }
}

// --- DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background
    initThreeJS();
    animate(); // Start the 3D animation loop

    // Typing effect for headline
    const typingElement = document.querySelector('.typing-text');
    const textToType = typingElement.textContent;
    typingElement.textContent = ''; // Clear initial text
    let i = 0;
    const speed = 100; // Typing speed in milliseconds

    function typeWriter() {
        if (i < textToType.length) {
            typingElement.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Remove typing animation after full text is displayed
            typingElement.classList.remove('animate-typing');
            typingElement.style.borderRight = 'none';
        }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);

    // Fetch system status, about me, and projects on page load
    fetchSystemStatus();
    fetchAboutMe();
    fetchProjects();
});
