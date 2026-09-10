import { useState } from "react";
import "./App.css";

const initialProjects = [
  {
    id: 1,
    name: "ARYONIX Website",
    category: "Web Development",
    progress: 92,
    status: "Completed",
    letter: "A",
  },
  {
    id: 2,
    name: "E-Commerce Platform",
    category: "Web Application",
    progress: 74,
    status: "In Progress",
    letter: "E",
  },
  {
    id: 3,
    name: "Portfolio Redesign",
    category: "UI / UX Design",
    progress: 48,
    status: "In Progress",
    letter: "P",
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    category: "React Application",
    progress: 28,
    status: "Planning",
    letter: "A",
  },
];

const activityItems = [
  {
    title: "ARYONIX Website",
    description: "Project successfully completed",
    time: "2 hours ago",
  },
  {
    title: "E-Commerce Platform",
    description: "Development milestone reached",
    time: "5 hours ago",
  },
  {
    title: "Portfolio Redesign",
    description: "New design concept uploaded",
    time: "Yesterday",
  },
  {
    title: "Analytics Dashboard",
    description: "Project planning started",
    time: "2 days ago",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [projects, setProjects] = useState(initialProjects);

  const [profileOpen, setProfileOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("Web Development");
  const [projectDescription, setProjectDescription] = useState("");

  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const openProjectModal = () => {
    setProjectModalOpen(true);
    setProfileOpen(false);
  };

  const closeProjectModal = () => {
    setProjectModalOpen(false);
    setProjectName("");
    setProjectType("Web Development");
    setProjectDescription("");
  };

  const handleCreateProject = (event) => {
    event.preventDefault();

    if (!projectName.trim()) {
      showToast("Please enter a project name.");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      category: projectType,
      progress: 0,
      status: "Planning",
      letter: projectName.trim().charAt(0).toUpperCase(),
    };

    setProjects((currentProjects) => [
      newProject,
      ...currentProjects,
    ]);

    closeProjectModal();
    setActivePage("Projects");

    showToast("New project created successfully.");
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setProfileOpen(false);
    setNotificationOpen(false);
  };

  const handleProfileAction = (action) => {
    setProfileOpen(false);

    if (action === "profile") {
      showToast("Profile opened.");
    }

    if (action === "settings") {
      setActivePage("Settings");
      showToast("Settings opened.");
    }

    if (action === "signout") {
      showToast("Signed out successfully.");
    }
  };

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="sidebar">

        <div className="sidebar-top">

          <div className="brand">
            <img
              src="/aryonixlogo.png"
              alt="ARYONIX"
              className="brand-logo"
            />

            <div className="brand-copy">
              <strong>ARYONIX</strong>
              <span>Digital Studio</span>
            </div>
          </div>

          <div className="workspace-label">
            WORKSPACE
          </div>

          <nav className="sidebar-nav">

            {[
              ["Overview", "⌂"],
              ["Projects", "▣"],
              ["Analytics", "◐"],
              ["Team", "♙"],
              ["Settings", "⚙"],
            ].map(([page, icon]) => (
              <button
                key={page}
                className={`nav-item ${
                  activePage === page ? "active" : ""
                }`}
                onClick={() => handleNavigation(page)}
              >
                <span className="nav-icon">{icon}</span>
                <span>{page}</span>
              </button>
            ))}

          </nav>

        </div>


        <div className="sidebar-bottom">

          {/* CTA */}

          <div className="upgrade-card">

            <div className="upgrade-star">
              ✦
            </div>

            <h3>
              Build something great.
            </h3>

            <p>
              Turn your next idea into a powerful digital experience.
            </p>

            <button
              type="button"
              onClick={openProjectModal}
            >
              Start Project →
            </button>

          </div>


          {/* User */}

          <div className="sidebar-user">

            <button
              type="button"
              className="sidebar-user-button"
              onClick={() => setProfileOpen(!profileOpen)}
            >

              <img
                src="/profile.jpg"
                alt="Aryan Mandavgode"
                className="avatar-image"
              />

              <div className="sidebar-user-info">
                <strong>Aryan Mandavgode</strong>
                <span>Administrator</span>
              </div>

              <span className="user-more">
                ⋯
              </span>

            </button>

          </div>

        </div>

      </aside>


      {/* =========================
          MAIN
      ========================== */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="breadcrumb">
            <span>Workspace</span>
            <b>/</b>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">

            <button
              type="button"
              className={`notification-button ${
                notificationOpen ? "selected" : ""
              }`}
              onClick={() =>
                setNotificationOpen(!notificationOpen)
              }
              aria-label="Notifications"
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <button
              type="button"
              className="top-profile-button"
              onClick={() => setProfileOpen(!profileOpen)}
            >

              <img
                src="/profile.jpg"
                alt="Aryan Mandavgode"
                className="avatar-image small"
              />

              <span>Aryan</span>

              <span className="chevron">
                ˅
              </span>

            </button>

          </div>


          {/* Notification dropdown */}

          {notificationOpen && (
            <div className="notification-panel">

              <div className="panel-heading">
                <strong>Notifications</strong>
                <span>3 new</span>
              </div>

              <div className="notification-item">
                <span className="notification-icon">✓</span>
                <div>
                  <strong>Project completed</strong>
                  <p>ARYONIX Website is now completed.</p>
                </div>
              </div>

              <div className="notification-item">
                <span className="notification-icon">↗</span>
                <div>
                  <strong>Milestone reached</strong>
                  <p>E-Commerce Platform reached 74%.</p>
                </div>
              </div>

              <div className="notification-item">
                <span className="notification-icon">+</span>
                <div>
                  <strong>New workspace activity</strong>
                  <p>Portfolio Redesign was updated.</p>
                </div>
              </div>

            </div>
          )}


          {/* Profile dropdown */}

          {profileOpen && (
            <div className="profile-menu">

              <div className="profile-menu-header">

                <img
                  src="/profile.jpg"
                  alt="Aryan Mandavgode"
                  className="avatar-image"
                />

                <div>
                  <strong>Aryan Mandavgode</strong>
                  <span>Administrator</span>
                </div>

              </div>

              <div className="profile-divider"></div>

              <button
                type="button"
                onClick={() => handleProfileAction("profile")}
              >
                <span>◉</span>
                My Profile
              </button>

              <button
                type="button"
                onClick={() => handleProfileAction("settings")}
              >
                <span>⚙</span>
                Account Settings
              </button>

              <div className="profile-divider"></div>

              <button
                type="button"
                className="logout-button"
                onClick={() => handleProfileAction("signout")}
              >
                <span>↪</span>
                Sign Out
              </button>

            </div>
          )}

        </header>


        {/* =========================
            PAGE CONTENT
        ========================== */}

        {activePage === "Overview" && (
          <OverviewPage
            projects={projects}
            onNewProject={openProjectModal}
            onViewProjects={() => setActivePage("Projects")}
          />
        )}

        {activePage === "Projects" && (
          <ProjectsPage
            projects={projects}
            onNewProject={openProjectModal}
          />
        )}

        {activePage === "Analytics" && (
          <AnalyticsPage />
        )}

        {activePage === "Team" && (
          <TeamPage />
        )}

        {activePage === "Settings" && (
          <SettingsPage />
        )}

      </main>


      {/* =========================
          PROJECT MODAL
      ========================== */}

      {projectModalOpen && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeProjectModal();
            }
          }}
        >

          <div className="project-modal">

            <div className="modal-header">

              <div>
                <span className="modal-eyebrow">
                  NEW PROJECT
                </span>

                <h2>
                  Start something great.
                </h2>

                <p>
                  Create a new project for your ARYONIX workspace.
                </p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeProjectModal}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleCreateProject}>

              <label>
                Project Name

                <input
                  type="text"
                  placeholder="e.g. Restaurant Website"
                  value={projectName}
                  onChange={(event) =>
                    setProjectName(event.target.value)
                  }
                  autoFocus
                />
              </label>


              <label>
                Project Type

                <select
                  value={projectType}
                  onChange={(event) =>
                    setProjectType(event.target.value)
                  }
                >
                  <option>Web Development</option>
                  <option>Web Application</option>
                  <option>UI / UX Design</option>
                  <option>React Application</option>
                  <option>E-Commerce</option>
                  <option>Digital Strategy</option>
                </select>

              </label>


              <label>
                Project Description

                <textarea
                  placeholder="Tell us briefly about the project..."
                  value={projectDescription}
                  onChange={(event) =>
                    setProjectDescription(event.target.value)
                  }
                  rows="4"
                />

              </label>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeProjectModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-button"
                >
                  Create Project →
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* =========================
          TOAST
      ========================== */}

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}

    </div>
  );
}


/* =====================================================
   OVERVIEW PAGE
===================================================== */

function OverviewPage({
  projects,
  onNewProject,
  onViewProjects,
}) {
  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            GOOD MORNING
          </span>

          <h1>
            Welcome back, Aryan.
          </h1>

          <h2>
            Here's your overview.
          </h2>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onNewProject}
        >
          + New Project
        </button>

      </div>


      {/* STATS */}

      <div className="stats-grid">

        <StatCard
          title="Total Projects"
          value="24"
          change="↑ 12.5%"
          description="vs last month"
          icon="▣"
        />

        <StatCard
          title="Active Projects"
          value="08"
          change="↑ 8.2%"
          description="vs last month"
          icon="●"
          highlight
        />

        <StatCard
          title="Completed"
          value="16"
          change="↑ 18.4%"
          description="vs last month"
          icon="✓"
        />

        <StatCard
          title="Team Members"
          value="12"
          change="+2"
          description="new this month"
          icon="♙"
        />

      </div>


      {/* CONTENT GRID */}

      <div className="dashboard-grid">

        {/* PROJECTS */}

        <section className="dashboard-card projects-card">

          <div className="card-header">

            <div>
              <span className="card-eyebrow">
                PROJECTS
              </span>

              <h3>
                Recent Projects
              </h3>
            </div>

            <button
              type="button"
              className="view-button"
              onClick={onViewProjects}
            >
              View All →
            </button>

          </div>


          <div className="project-list">

            {projects.slice(0, 4).map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
              />
            ))}

          </div>

        </section>


        {/* ACTIVITY */}

        <section className="dashboard-card activity-card">

          <div className="card-header">

            <div>
              <span className="card-eyebrow">
                ACTIVITY
              </span>

              <h3>
                Recent Activity
              </h3>
            </div>

            <button
              type="button"
              className="more-button"
            >
              •••
            </button>

          </div>


          <div className="activity-list">

            {activityItems.map((item, index) => (
              <div
                className="activity-item"
                key={index}
              >

                <span className="activity-dot"></span>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <span>{item.time}</span>
                </div>

              </div>
            ))}

          </div>

        </section>

      </div>

    </div>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  change,
  description,
  icon,
  highlight = false,
}) {
  return (
    <div className={`stat-card ${highlight ? "highlight" : ""}`}>

      <div className="stat-top">

        <span>
          {title}
        </span>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <strong className="stat-value">
        {value}
      </strong>

      <div className="stat-change">

        <span>
          {change}
        </span>

        <small>
          {description}
        </small>

      </div>

    </div>
  );
}


/* =====================================================
   PROJECT ROW
===================================================== */

function ProjectRow({ project }) {
  return (
    <div className="project-row">

      <div className="project-letter">
        {project.letter}
      </div>

      <div className="project-info">

        <strong>
          {project.name}
        </strong>

        <span>
          {project.category}
        </span>

      </div>

      <div className="project-progress">

        <div className="progress-label">
          <span>{project.progress}%</span>
          <small>{project.status}</small>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${project.progress}%`,
            }}
          ></div>
        </div>

      </div>

    </div>
  );
}


/* =====================================================
   PROJECTS PAGE
===================================================== */

function ProjectsPage({
  projects,
  onNewProject,
}) {
  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            WORKSPACE
          </span>

          <h1>
            Projects
          </h1>

          <h2>
            Manage your digital projects.
          </h2>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onNewProject}
        >
          + New Project
        </button>

      </div>


      <div className="full-card">

        <div className="project-grid">

          {projects.map((project) => (
            <div
              className="project-box"
              key={project.id}
            >

              <div className="project-box-top">

                <div className="project-letter">
                  {project.letter}
                </div>

                <span className="project-status">
                  {project.status}
                </span>

              </div>

              <h3>
                {project.name}
              </h3>

              <p>
                {project.category}
              </p>

              <div className="project-box-progress">

                <div className="progress-label">
                  <span>Progress</span>
                  <strong>{project.progress}%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  ></div>
                </div>

              </div>

              <button
                type="button"
                className="outline-button"
              >
                Open Project →
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   ANALYTICS
===================================================== */

function AnalyticsPage() {
  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            PERFORMANCE
          </span>

          <h1>
            Analytics
          </h1>

          <h2>
            Track your workspace performance.
          </h2>
        </div>

      </div>


      <div className="analytics-grid">

        <div className="analytics-card">
          <span>Total Projects</span>
          <strong>24</strong>
          <small>↑ 12.5% this month</small>
        </div>

        <div className="analytics-card">
          <span>Completion Rate</span>
          <strong>67%</strong>
          <small>↑ 18.4% this month</small>
        </div>

        <div className="analytics-card">
          <span>Team Productivity</span>
          <strong>89%</strong>
          <small>↑ 8.2% this month</small>
        </div>

      </div>


      <div className="full-card chart-card">

        <div className="card-header">

          <div>
            <span className="card-eyebrow">
              PERFORMANCE
            </span>

            <h3>
              Project Growth
            </h3>
          </div>

          <span className="chart-period">
            Last 6 months
          </span>

        </div>

        <div className="fake-chart">

          <div className="chart-bars">
            <span style={{ height: "35%" }}></span>
            <span style={{ height: "48%" }}></span>
            <span style={{ height: "42%" }}></span>
            <span style={{ height: "65%" }}></span>
            <span style={{ height: "76%" }}></span>
            <span style={{ height: "92%" }}></span>
          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   TEAM
===================================================== */

function TeamPage() {
  const members = [
    ["AM", "Aryan Mandavgode", "Administrator"],
    ["AD", "Aarav Deshmukh", "UI / UX Designer"],
    ["RS", "Riya Sharma", "Frontend Developer"],
    ["VK", "Ved Kulkarni", "Backend Developer"],
  ];

  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            WORKSPACE
          </span>

          <h1>
            Team
          </h1>

          <h2>
            Your project team members.
          </h2>
        </div>

      </div>


      <div className="team-grid">

        {members.map(([initials, name, role]) => (
          <div
            className="team-card"
            key={name}
          >

            {name === "Aryan Mandavgode" ? (
              <img
                src="/profile.jpg"
                alt={name}
                className="team-avatar"
              />
            ) : (
              <div className="team-avatar initials">
                {initials}
              </div>
            )}

            <strong>
              {name}
            </strong>

            <span>
              {role}
            </span>

            <button type="button">
              View Profile
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}


/* =====================================================
   SETTINGS
===================================================== */

function SettingsPage() {
  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            ACCOUNT
          </span>

          <h1>
            Settings
          </h1>

          <h2>
            Manage your workspace preferences.
          </h2>
        </div>

      </div>


      <div className="settings-card">

        <div className="settings-section">

          <h3>
            Profile
          </h3>

          <p>
            Manage your personal workspace information.
          </p>

          <div className="settings-profile">

            <img
              src="/profile.jpg"
              alt="Aryan Mandavgode"
              className="settings-avatar"
            />

            <div>
              <strong>
                Aryan Mandavgode
              </strong>

              <span>
                Administrator
              </span>
            </div>

          </div>

        </div>


        <div className="settings-divider"></div>


        <div className="settings-section">

          <h3>
            Workspace
          </h3>

          <p>
            ARYONIX Digital Studio
          </p>

          <label className="setting-toggle">
            <input
              type="checkbox"
              defaultChecked
            />
            <span></span>
            Email notifications
          </label>

        </div>

      </div>

    </div>
  );
}


export default App;