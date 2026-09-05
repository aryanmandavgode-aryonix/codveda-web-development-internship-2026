// =========================
// DOM ELEMENTS
// =========================

const projectType = document.getElementById("projectType");
const projectSuggestion = document.getElementById("projectSuggestion");

const serviceModal = document.getElementById("serviceModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");
const modalProjectBtn = document.getElementById("modalProjectBtn");

const successModal = document.getElementById("successModal");
const successClose = document.getElementById("successClose");

const projectForm = document.getElementById("projectForm");

const navContactBtn = document.getElementById("navContactBtn");
const heroStartBtn = document.getElementById("heroStartBtn");

const learnMoreButtons = document.querySelectorAll(".learn-more");


// =========================
// SERVICE DATA
// =========================

const serviceDetails = {
    "Web Development": {
        title: "Web Development",
        description:
            "We create fast, responsive and modern websites using clean front-end technologies. Every website is designed to work smoothly across desktop, tablet and mobile devices."
    },

    "UI/UX Design": {
        title: "UI/UX Design",
        description:
            "We design intuitive digital interfaces with strong visual hierarchy, thoughtful interactions and a focus on creating simple and enjoyable user experiences."
    },

    "Web Applications": {
        title: "Web Applications",
        description:
            "We build interactive web applications that help businesses manage workflows, solve problems and create better digital experiences for their users."
    }
};


// =========================
// PROJECT SUGGESTIONS
// =========================

const projectSuggestions = {
    website:
        "Recommendation: A responsive business website is a great starting point for presenting your services, building credibility and generating new enquiries.",

    portfolio:
        "Recommendation: A personal portfolio can showcase your skills, projects and experience while giving potential clients or employers a clear view of your work.",

    webapp:
        "Recommendation: A web application is ideal when you need interactive features, user accounts, dashboards or custom business functionality.",

    ecommerce:
        "Recommendation: An e-commerce website is suitable for businesses that want to showcase products, accept online orders and manage their digital storefront."
};


// =========================
// MODAL FUNCTIONS
// =========================

function openModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}


function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}


// =========================
// SCROLL TO CONTACT
// =========================

function scrollToContact() {
    const contactSection = document.getElementById("contact");

    contactSection.scrollIntoView({
        behavior: "smooth"
    });

    closeModal(serviceModal);
}


// =========================
// PROJECT TYPE SELECTOR
// =========================

projectType.addEventListener("change", function () {

    const selectedType = projectType.value;

    if (selectedType && projectSuggestions[selectedType]) {
        projectSuggestion.textContent =
            projectSuggestions[selectedType];
    } else {
        projectSuggestion.textContent =
            "Choose a project type to see a recommendation.";
    }
});


// =========================
// SERVICE MODAL
// =========================

learnMoreButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const serviceName = button.dataset.service;
        const service = serviceDetails[serviceName];

        if (!service) {
            return;
        }

        modalTitle.textContent = service.title;
        modalDescription.textContent = service.description;

        openModal(serviceModal);
    });
});


// =========================
// PROJECT BUTTONS
// =========================

navContactBtn.addEventListener("click", scrollToContact);

heroStartBtn.addEventListener("click", scrollToContact);

modalProjectBtn.addEventListener("click", scrollToContact);


// =========================
// CLOSE MODALS
// =========================

modalClose.addEventListener("click", function () {
    closeModal(serviceModal);
});


successClose.addEventListener("click", function () {
    closeModal(successModal);
});


// =========================
// FORM VALIDATION HELPERS
// =========================

function setError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}


function clearErrors() {
    setError("nameError", "");
    setError("emailError", "");
    setError("projectError", "");
    setError("messageError", "");
}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// =========================
// FORM VALIDATION
// =========================

projectForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const project = document.getElementById("project").value;
    const message = document.getElementById("message").value.trim();

    let isValid = true;


    // Name validation
    if (name.length < 2) {
        setError(
            "nameError",
            "Please enter your name."
        );

        isValid = false;
    }


    // Email validation
    if (!isValidEmail(email)) {
        setError(
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // Project validation
    if (!project) {
        setError(
            "projectError",
            "Please select a project type."
        );

        isValid = false;
    }


    // Message validation
    if (message.length < 10) {
        setError(
            "messageError",
            "Please describe your project in at least 10 characters."
        );

        isValid = false;
    }


    // Successful submission
    if (isValid) {

        projectForm.reset();

        projectSuggestion.textContent =
            "Choose a project type to see a recommendation.";

        openModal(successModal);
    }
});


// =========================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =========================

serviceModal.addEventListener("click", function (event) {

    if (event.target === serviceModal) {
        closeModal(serviceModal);
    }
});


successModal.addEventListener("click", function (event) {

    if (event.target === successModal) {
        closeModal(successModal);
    }
});


// =========================
// ESCAPE KEY
// =========================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeModal(serviceModal);
        closeModal(successModal);
    }
});