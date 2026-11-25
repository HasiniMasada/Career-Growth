
// ========================================
// CAREER GROWTH - COMPLETE JAVASCRIPT
// ========================================

// GET USERS FROM LOCAL STORAGE
function getUsers() {
    return JSON.parse(localStorage.getItem("careerGrowthUsers")) || [];
}

// SAVE USERS
function saveUsers(users) {
    localStorage.setItem("careerGrowthUsers", JSON.stringify(users));
}

// GET CURRENT USER
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("careerGrowthCurrentUser"));
}

// SAVE CURRENT USER
function setCurrentUser(user) {
    localStorage.setItem("careerGrowthCurrentUser", JSON.stringify(user));
}


// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.add("hidden");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }

    // Start typing animation on home page
    if (pageId === "homePage") {
        startTypingAnimation();
    } else {
        stopTypingAnimation();
    }
}


// ENTER CAREER GROWTH
function enterCareerGrowth() {
    showPage("homePage");
}


// ========================================
// TYPING ANIMATION
// ========================================

let typingTimer = null;

function stopTypingAnimation() {
    if (typingTimer !== null) {
        clearTimeout(typingTimer);
        typingTimer = null;
    }
}

function startTypingAnimation() {

    stopTypingAnimation();

    const typingElement = document.getElementById("typingText");

    if (!typingElement) return;

    const words = [
        "✨ Your Future!",
        "🚀 Your Career!",
        "💡 Your Skills!",
        "🌟 Your Success!"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {

        const currentWord = words[wordIndex];

        if (!deleting) {

            charIndex++;

            typingElement.textContent =
                currentWord.substring(0, charIndex);

            if (charIndex === currentWord.length) {

                deleting = true;

                typingTimer = setTimeout(typeEffect, 1200);

                return;
            }

        } else {

            charIndex--;

            typingElement.textContent =
                currentWord.substring(0, charIndex);

            if (charIndex === 0) {

                deleting = false;

                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        typingTimer = setTimeout(
            typeEffect,
            deleting ? 50 : 100
        );
    }

    typeEffect();
}


// ========================================
// LOGIN AND REGISTER NAVIGATION
// ========================================

function showAuth(type) {

    showPage("authPage");

    document.getElementById("loginForm").classList.add("hidden");

    document.getElementById("registerForm").classList.add("hidden");

    if (type === "login") {

        document.getElementById("loginForm").classList.remove("hidden");

    } else {

        document.getElementById("registerForm").classList.remove("hidden");

    }
}


// ========================================
// REGISTER USER
// ========================================

function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();

    const username = document.getElementById("registerUsername").value.trim();

    const email = document.getElementById("registerEmail").value.trim();

    const password = document.getElementById("registerPassword").value;

    let users = getUsers();

    const usernameExists = users.some(function(user) {

        return user.username.toLowerCase() === username.toLowerCase();

    });

    if (usernameExists) {

        alert("This username already exists. Please choose another username.");

        return;
    }

    const emailExists = users.some(function(user) {

        return user.email.toLowerCase() === email.toLowerCase();

    });

    if (emailExists) {

        alert("This email is already registered. Please login.");

        return;
    }

    const newUser = {

        name: name,
        username: username,
        email: email,
        password: password,

        phone: "",
        about: "",

        skills: [],
        projects: []

    };

    users.push(newUser);

    saveUsers(users);

    alert("Account created successfully! Please login.");

    event.target.reset();

    showAuth("login");
}


// ========================================
// LOGIN USER
// ========================================

function loginUser(event) {

    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();

    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(function(item) {

        return item.username.toLowerCase() === username.toLowerCase()
            && item.password === password;

    });

    if (!user) {

        alert("Invalid username or password. Please try again.");

        return;
    }

    setCurrentUser(user);

    alert("Login successful! Welcome to Career Growth.");

    event.target.reset();

    openDashboard();
}


// ========================================
// OPEN DASHBOARD
// ========================================

function openDashboard() {

    const user = getCurrentUser();

    if (!user) {

        showAuth("login");

        return;
    }

    document.getElementById("sidebarUsername").textContent = user.name;

    loadProfile();

    displaySkills();

    displayProjects();

    updateResume();

    showPage("dashboardPage");

    showDashboardSection("overview");
}


// ========================================
// DASHBOARD NAVIGATION
// ========================================

function showDashboardSection(sectionName) {

    const sections = document.querySelectorAll(".dashboard-section");

    sections.forEach(function(section) {

        section.classList.add("hidden");

    });

    const selectedSection = document.getElementById(sectionName + "Section");

    if (selectedSection) {

        selectedSection.classList.remove("hidden");

    }

    if (sectionName === "resume") {

        updateResume();

    }
}


// ========================================
// UPDATE CURRENT USER
// ========================================

function updateCurrentUser(updatedUser) {

    const users = getUsers();

    const index = users.findIndex(function(user) {

        return user.username === updatedUser.username;

    });

    if (index !== -1) {

        users[index] = updatedUser;

        saveUsers(users);

        setCurrentUser(updatedUser);

    }
}


// ========================================
// LOAD PROFILE
// ========================================

function loadProfile() {

    const user = getCurrentUser();

    if (!user) return;

    document.getElementById("profileName").value = user.name || "";

    document.getElementById("profileEmail").value = user.email || "";

    document.getElementById("profilePhone").value = user.phone || "";

    document.getElementById("profileAbout").value = user.about || "";

}


// ========================================
// SAVE PROFILE
// ========================================

function saveProfile(event) {

    event.preventDefault();

    const user = getCurrentUser();

    if (!user) return;

    const newEmail = document.getElementById("profileEmail").value.trim();

    const users = getUsers();

    const emailExists = users.some(function(item) {

        return item.email.toLowerCase() === newEmail.toLowerCase()
            && item.username !== user.username;

    });

    if (emailExists) {

        alert("This email is already used by another account.");

        return;
    }

    user.name = document.getElementById("profileName").value.trim();

    user.email = newEmail;

    user.phone = document.getElementById("profilePhone").value.trim();

    user.about = document.getElementById("profileAbout").value.trim();

    updateCurrentUser(user);

    document.getElementById("sidebarUsername").textContent = user.name;

    alert("Profile saved successfully!");

    updateResume();
}


// ========================================
// ADD SKILL
// ========================================

function addSkill(event) {

    event.preventDefault();

    const user = getCurrentUser();

    const skillInput = document.getElementById("skillInput");

    const skill = skillInput.value.trim();

    if (!user || skill === "") return;

    if (!user.skills) {

        user.skills = [];

    }

    const alreadyExists = user.skills.some(function(item) {

        return item.toLowerCase() === skill.toLowerCase();

    });

    if (alreadyExists) {

        alert("This skill is already added.");

        return;
    }

    user.skills.push(skill);

    updateCurrentUser(user);

    skillInput.value = "";

    displaySkills();

    updateResume();
}


// ========================================
// DISPLAY SKILLS
// ========================================

function displaySkills() {

    const user = getCurrentUser();

    const skillsList = document.getElementById("skillsList");

    if (!user || !skillsList) return;

    skillsList.innerHTML = "";

    if (!user.skills || user.skills.length === 0) {

        skillsList.innerHTML =
            "<p>No skills added yet. Add your first skill.</p>";

        return;
    }

    user.skills.forEach(function(skill, index) {

        const item = document.createElement("div");

        item.className = "item-card";

        const name = document.createElement("h3");

        name.textContent = "💡 " + skill;

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Remove";

        deleteButton.onclick = function() {

            deleteSkill(index);

        };

        item.appendChild(name);

        item.appendChild(deleteButton);

        skillsList.appendChild(item);

    });
}


// ========================================
// DELETE SKILL
// ========================================

function deleteSkill(index) {

    const user = getCurrentUser();

    if (!user) return;

    user.skills.splice(index, 1);

    updateCurrentUser(user);

    displaySkills();

    updateResume();
}


// ========================================
// ADD PROJECT
// ========================================

function addProject(event) {

    event.preventDefault();

    const user = getCurrentUser();

    if (!user) return;

    const title = document.getElementById("projectTitle").value.trim();

    const description = document.getElementById("projectDescription").value.trim();

    const link = document.getElementById("projectLink").value.trim();

    if (!user.projects) {

        user.projects = [];

    }

    user.projects.push({

        title: title,

        description: description,

        link: link

    });

    updateCurrentUser(user);

    event.target.reset();

    displayProjects();

    updateResume();

    alert("Project added successfully!");
}


// ========================================
// DISPLAY PROJECTS
// ========================================

function displayProjects() {

    const user = getCurrentUser();

    const projectsList = document.getElementById("projectsList");

    if (!user || !projectsList) return;

    projectsList.innerHTML = "";

    if (!user.projects || user.projects.length === 0) {

        projectsList.innerHTML =
            "<p>No projects added yet. Add your first project.</p>";

        return;
    }

    user.projects.forEach(function(project, index) {

        const card = document.createElement("div");

        card.className = "item-card";

        const title = document.createElement("h3");

        title.textContent = "📁 " + project.title;

        const description = document.createElement("p");

        description.textContent = project.description;

        card.appendChild(title);

        card.appendChild(description);

        if (project.link) {

            const link = document.createElement("a");

            link.href = project.link;

            link.textContent = "View Project";

            link.target = "_blank";

            link.rel = "noopener noreferrer";

            card.appendChild(link);

        }

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Remove Project";

        deleteButton.onclick = function() {

            deleteProject(index);

        };

        card.appendChild(deleteButton);

        projectsList.appendChild(card);

    });
}


// ========================================
// DELETE PROJECT
// ========================================

function deleteProject(index) {

    const user = getCurrentUser();

    if (!user) return;

    user.projects.splice(index, 1);

    updateCurrentUser(user);

    displayProjects();

    updateResume();
}


// ========================================
// UPDATE DIGITAL RESUME
// ========================================

function updateResume() {

    const user = getCurrentUser();

    const resumePreview = document.getElementById("resumePreview");

    if (!user || !resumePreview) return;

    const skills = user.skills || [];

    const projects = user.projects || [];

    resumePreview.innerHTML = "";

    const name = document.createElement("h2");

    name.textContent = user.name || "Your Name";

    resumePreview.appendChild(name);

    const email = document.createElement("p");

    email.textContent = "Email: " + (user.email || "Not added");

    resumePreview.appendChild(email);

    const phone = document.createElement("p");

    phone.textContent = "Phone: " + (user.phone || "Not added");

    resumePreview.appendChild(phone);

    const aboutHeading = document.createElement("h3");

    aboutHeading.textContent = "About Me";

    resumePreview.appendChild(aboutHeading);

    const about = document.createElement("p");

    about.textContent = user.about || "No description added yet.";

    resumePreview.appendChild(about);

    const skillsHeading = document.createElement("h3");

    skillsHeading.textContent = "Skills";

    resumePreview.appendChild(skillsHeading);

    const skillsText = document.createElement("p");

    skillsText.textContent = skills.length
        ? skills.join(" • ")
        : "No skills added yet.";

    resumePreview.appendChild(skillsText);

    const projectsHeading = document.createElement("h3");

    projectsHeading.textContent = "Projects";

    resumePreview.appendChild(projectsHeading);

    if (projects.length === 0) {

        const noProjects = document.createElement("p");

        noProjects.textContent = "No projects added yet.";

        resumePreview.appendChild(noProjects);

    } else {

        projects.forEach(function(project) {

            const projectTitle = document.createElement("h4");

            projectTitle.textContent = project.title;

            const projectDescription = document.createElement("p");

            projectDescription.textContent = project.description;

            resumePreview.appendChild(projectTitle);

            resumePreview.appendChild(projectDescription);

        });

    }
}


// ========================================
// PRINT RESUME
// ========================================

function printResume() {

    updateResume();

    window.print();
}


// ========================================
// RECRUITER PAGE
// ========================================

function openRecruiterFromHome() {

    showPage("recruiterPage");

    searchCandidates();
}


// ========================================
// SEARCH CANDIDATES
// ========================================

function searchCandidates() {

    const searchInput = document.getElementById("recruiterSearch");

    const candidateList = document.getElementById("candidateList");

    if (!candidateList) return;

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const users = getUsers();

    candidateList.innerHTML = "";

    const matchingUsers = users.filter(function(user) {

        return user.name.toLowerCase().includes(searchText)
            || user.username.toLowerCase().includes(searchText)
            || user.email.toLowerCase().includes(searchText);

    });

    if (matchingUsers.length === 0) {

        const emptyCard = document.createElement("div");

        emptyCard.className = "candidate-card";

        const message = document.createElement("p");

        message.textContent = "No candidates found.";

        emptyCard.appendChild(message);

        candidateList.appendChild(emptyCard);

        return;
    }

    matchingUsers.forEach(function(user) {

        const card = document.createElement("div");

        card.className = "candidate-card";

        const name = document.createElement("h2");

        name.textContent = user.name;

        const username = document.createElement("p");

        username.textContent = "Username: " + user.username;

        const email = document.createElement("p");

        email.textContent = "Email: " + user.email;

        const about = document.createElement("p");

        about.textContent = "About: " + (user.about || "Not provided");

        const skills = document.createElement("p");

        skills.textContent = "Skills: " +
            ((user.skills && user.skills.length)
                ? user.skills.join(", ")
                : "Not added");

        card.appendChild(name);

        card.appendChild(username);

        card.appendChild(email);

        card.appendChild(about);

        card.appendChild(skills);

        candidateList.appendChild(card);

    });
}


// ========================================
// LOGOUT
// ========================================

function logoutUser() {

    localStorage.removeItem("careerGrowthCurrentUser");

    alert("You have logged out successfully.");

    showPage("homePage");
}


// ========================================
// INITIAL PAGE
// ========================================

document.addEventListener("DOMContentLoaded", function() {

    const currentUser = getCurrentUser();

    if (currentUser) {

        openDashboard();

    } else {

        showPage("welcomePage");

    }

});
