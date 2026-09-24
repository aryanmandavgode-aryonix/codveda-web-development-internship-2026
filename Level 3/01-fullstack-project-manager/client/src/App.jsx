import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5001";
const API_PROJECTS = `${API_BASE_URL}/api/projects`;
const API_TASKS = `${API_BASE_URL}/api/tasks`;

const getConnectionErrorMessage = (
  fallbackMessage = "Unable to connect to ProjectFlow API. Please make sure the backend server is running."
) => fallbackMessage;

const getFriendlyErrorMessage = (error, fallbackMessage) => {
  const message = error instanceof Error ? error.message : String(error || "");

  if (
    message.includes("fetch") ||
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("load")
  ) {
    return getConnectionErrorMessage();
  }

  return message || fallbackMessage;
};

const emptyProject = {
  name: "",
  client: "",
  status: "Planning",
  priority: "Medium",
  dueDate: "",
  progress: 0,
};

const emptyTask = {
  title: "",
  project: "",
  priority: "Medium",
};

function App() {
  const [page, setPage] = useState("Overview");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [projectError, setProjectError] = useState("");
  const [taskError, setTaskError] = useState("");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [taskForm, setTaskForm] = useState(emptyTask);

  /* =========================
     FETCH PROJECTS
  ========================= */

  async function fetchProjects() {
    try {
      setLoadingProjects(true);
      setProjectError("");

      const response = await fetch(API_PROJECTS);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to load projects"
        );
      }

      const data = await response.json();

      const formattedProjects = Array.isArray(data)
        ? data.map((project) => ({
            ...project,
            id: String(project._id),
            status:
              project.status === "Active"
                ? "In progress"
                : project.status,
          }))
        : [];

      setProjects(formattedProjects);
    } catch (error) {
      console.error("PROJECT FETCH ERROR:", error);
      setProjectError(
        getFriendlyErrorMessage(error, "Failed to load projects")
      );
    } finally {
      setLoadingProjects(false);
    }
  }

  /* =========================
     FETCH TASKS
  ========================= */

  async function fetchTasks() {
    try {
      setLoadingTasks(true);
      setTaskError("");

      const response = await fetch(API_TASKS);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to load tasks");
      }

      const data = await response.json();

      const formattedTasks = Array.isArray(data)
        ? data.map((task) => ({
            ...task,
            id: String(task._id),

            projectId:
              typeof task.project === "object"
                ? String(task.project?._id || "")
                : String(task.project || ""),

            projectName:
              typeof task.project === "object"
                ? task.project?.name || "Unknown Project"
                : "Unknown Project",
          }))
        : [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error("TASK FETCH ERROR:", error);
      setTaskError(
        getFriendlyErrorMessage(error, "Failed to load tasks")
      );
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchProjects(), fetchTasks()]);
    };

    loadInitialData();
  }, []);

  /* =========================
     PROJECT MODAL
  ========================= */

  function openCreateProject() {
    setEditingProject(null);
    setProjectForm({ ...emptyProject });
    setProjectError("");
    setShowProjectModal(true);
  }

  function openEditProject(project) {
    setEditingProject(project);

    setProjectForm({
      name: project.name || "",
      client: project.client || "",
      status:
        project.status === "In progress"
          ? "Active"
          : project.status || "Planning",
      priority: project.priority || "Medium",
      dueDate: project.dueDate || "",
      progress: Number(project.progress || 0),
    });

    setProjectError("");
    setShowProjectModal(true);
  }

  /* =========================
     SAVE PROJECT
  ========================= */

  async function handleProjectSubmit(event) {
    event.preventDefault();

    try {
      setProjectError("");

      if (!projectForm.name.trim()) {
        throw new Error("Project name is required");
      }

      if (!projectForm.client.trim()) {
        throw new Error("Client name is required");
      }

      const url = editingProject
        ? `${API_PROJECTS}/${editingProject.id}`
        : API_PROJECTS;

      const response = await fetch(url, {
        method: editingProject ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: projectForm.name.trim(),
          client: projectForm.client.trim(),
          status: projectForm.status,
          priority: projectForm.priority,
          dueDate: projectForm.dueDate,
          progress: Number(projectForm.progress) || 0,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save project"
        );
      }

      await fetchProjects();

      setShowProjectModal(false);
      setEditingProject(null);
      setProjectForm({ ...emptyProject });
    } catch (error) {
      console.error("PROJECT SAVE ERROR:", error);
      setProjectError(
        getFriendlyErrorMessage(error, "Failed to save project")
      );
    }
  }

  /* =========================
     DELETE PROJECT
  ========================= */

  async function deleteProject(id) {
    if (!id) {
      setProjectError("Invalid project ID");
      return;
    }

    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_PROJECTS}/${String(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      await fetchProjects();
      await fetchTasks();
    } catch (error) {
      console.error("PROJECT DELETE ERROR:", error);
      setProjectError(
        getFriendlyErrorMessage(error, "Failed to delete project")
      );
    }
  }

  /* =========================
     TASK MODAL
  ========================= */

  function openCreateTask() {
    if (projects.length === 0) {
      setTaskError(
        "Create a project first before creating a task."
      );
      return;
    }

    setEditingTask(null);

    setTaskForm({
      title: "",
      project: String(projects[0].id),
      priority: "Medium",
    });

    setTaskError("");
    setShowTaskModal(true);
  }

  function openEditTask(task) {
    setEditingTask(task);

    setTaskForm({
      title: task.title || "",
      project: String(task.projectId || ""),
      priority: task.priority || "Medium",
    });

    setTaskError("");
    setShowTaskModal(true);
  }

  /* =========================
     SAVE TASK
  ========================= */

  async function handleTaskSubmit(event) {
    event.preventDefault();

    try {
      setTaskError("");

      const title = taskForm.title.trim();
      const projectId = String(taskForm.project || "");

      if (!title) {
        throw new Error("Task title is required");
      }

      if (!projectId) {
        throw new Error("Please select a project");
      }

      const selectedProject = projects.find(
        (project) => String(project.id) === projectId
      );

      if (!selectedProject) {
        throw new Error(
          "The selected project could not be found."
        );
      }

      const payload = {
        title,
        project: projectId,
        priority: taskForm.priority,
        completed: editingTask
          ? Boolean(editingTask.completed)
          : false,
      };

      const url = editingTask
        ? `${API_TASKS}/${String(editingTask.id)}`
        : API_TASKS;

      const response = await fetch(url, {
        method: editingTask ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          message: responseText,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create task"
        );
      }

      await fetchTasks();

      setShowTaskModal(false);
      setEditingTask(null);

      setTaskForm({
        title: "",
        project: projects[0]
          ? String(projects[0].id)
          : "",
        priority: "Medium",
      });

      setTaskError("");
    } catch (error) {
      console.error("TASK SAVE ERROR:", error);

      setTaskError(
        getFriendlyErrorMessage(error, "Failed to save task")
      );
    }
  }

  /* =========================
     TOGGLE TASK
  ========================= */

  async function toggleTask(task) {
    try {
      const response = await fetch(
        `${API_TASKS}/${String(task.id)}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: task.title,
            project: String(task.projectId),
            priority: task.priority,
            completed: !task.completed,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task"
        );
      }

      await fetchTasks();
    } catch (error) {
      console.error("TASK UPDATE ERROR:", error);
      setTaskError(
        getFriendlyErrorMessage(error, "Failed to update task")
      );
    }
  }

  /* =========================
     DELETE TASK
  ========================= */

  async function deleteTask(id) {
    if (!id) {
      setTaskError("Invalid task ID");
      return;
    }

    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_TASKS}/${String(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete task"
        );
      }

      await fetchTasks();
    } catch (error) {
      console.error("TASK DELETE ERROR:", error);
      setTaskError(
        getFriendlyErrorMessage(error, "Failed to delete task")
      );
    }
  }

  /* =========================
     TASK ROW
  ========================= */

  function TaskRow({ task }) {
    return (
      <div
        className={`task-row ${
          task.completed ? "completed" : ""
        }`}
      >
        <button
          type="button"
          className={`task-check ${
            task.completed ? "checked" : ""
          }`}
          onClick={() => toggleTask(task)}
        >
          {task.completed ? "✓" : ""}
        </button>

        <div className="task-main">
          <strong>{task.title}</strong>

          <span>
            {task.projectName} · {task.priority}
          </span>
        </div>

        <div className="task-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => openEditTask(task)}
          >
            Edit
          </button>

          <button
            type="button"
            className="icon-button danger-text"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     PROJECT ROW
  ========================= */

  function ProjectRow({ project }) {
    const normalizedStatus = String(project.status || "Planning")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return (
      <div className="project-row">
        <div className="project-row-main">
          <span className="project-dot" />

          <div>
            <strong>{project.name}</strong>
            <span>{project.client}</span>
          </div>
        </div>

        <span className={`status-badge ${normalizedStatus}`}>
          {project.status}
        </span>
      </div>
    );
  }

  /* =========================
     OVERVIEW
  ========================= */

  function Overview() {
    const activeProjects = projects.filter(
      (project) => project.status === "In progress"
    ).length;

    const completedProjects = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.completed
    ).length;
    const openTasks = tasks.filter(
      (task) => !task.completed
    ).length;

    return (
      <div className="page">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">WORKSPACE</p>

            <h2>Good to see you, Aryan.</h2>

            <p>
              Manage your projects, tasks and client work
              from one place.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openCreateTask}
          >
            + Add Task
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Projects</span>
            <strong>{projects.length}</strong>
          </div>

          <div className="stat-card">
            <span>Active Projects</span>
            <strong>{activeProjects}</strong>
          </div>

          <div className="stat-card">
            <span>Completed Projects</span>
            <strong>{completedProjects}</strong>
          </div>

          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Completed Tasks</span>
            <strong>{completedTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Open Tasks</span>
            <strong>{openTasks}</strong>
          </div>
        </div>

        <div className="content-grid">
          <section className="panel">
            <div className="panel-heading">
              <h3>Recent Projects</h3>

              <button
                type="button"
                className="text-button"
                onClick={() => setPage("Projects")}
              >
                View all
              </button>
            </div>

            {loadingProjects ? (
              <div className="empty-state">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                No projects yet.
              </div>
            ) : (
              projects.slice(0, 5).map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                />
              ))
            )}
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h3>Recent Tasks</h3>

              <button
                type="button"
                className="text-button"
                onClick={() => setPage("Tasks")}
              >
                View all
              </button>
            </div>

            {loadingTasks ? (
              <div className="empty-state">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                No tasks yet.
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                />
              ))
            )}
          </section>
        </div>
      </div>
    );
  }

  /* =========================
     PROJECTS PAGE
  ========================= */

  function ProjectsPage() {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">WORKSPACE</p>

            <h2>Projects</h2>

            <p>Manage your client projects.</p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openCreateProject}
          >
            + New Project
          </button>
        </div>

        {projectError && (
          <div className="error-state">
            {projectError}
          </div>
        )}

        {loadingProjects ? (
          <div className="panel">
            <div className="empty-state">
              Loading projects...
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              No projects yet.
            </div>
          </div>
        ) : (
          <div className="project-cards">
            {projects.map((project) => (
              <div
                className="project-card"
                key={project.id}
              >
                <div className="project-card-top">
                  <div>
                    <span className="project-client">
                      {project.client}
                    </span>

                    <h3>{project.name}</h3>
                  </div>

                  <span
                    className={`status-badge ${String(
                      project.status || "Planning"
                    )
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="project-meta">
                  <span>
                    Priority: {project.priority}
                  </span>

                  <span>
                    Due:{" "}
                    {project.dueDate || "Not set"}
                  </span>
                </div>

                <div className="progress-row">
                  <span>Progress</span>

                  <strong>
                    {project.progress || 0}%
                  </strong>
                </div>

                <div className="progress-bar">
                  <span
                    style={{
                      width: `${project.progress || 0}%`,
                    }}
                  />
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      openEditProject(project)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() =>
                      deleteProject(project.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* =========================
     TASKS PAGE
  ========================= */

  function TasksPage() {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">WORKSPACE</p>

            <h2>Tasks</h2>

            <p>
              Manage tasks connected to your projects.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openCreateTask}
          >
            + New Task
          </button>
        </div>

        {taskError && (
          <div className="error-state">
            {taskError}
          </div>
        )}

        <section className="panel">
          <div className="panel-heading">
            <h3>All Tasks</h3>
          </div>

          {loadingTasks ? (
            <div className="empty-state">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              No tasks yet.
            </div>
          ) : (
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
              />
            ))
          )}
        </section>
      </div>
    );
  }

  /* =========================
     TEAM
  ========================= */

  function TeamPage() {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">WORKSPACE</p>

            <h2>Team</h2>

            <p>ProjectFlow team members.</p>
          </div>
        </div>

        <section className="panel">
          <div className="team-card">
            <img
              src="/profile.jpg"
              alt="Aryan Mandavgode"
            />

            <div>
              <h3>Aryan Mandavgode</h3>

              <p>
                Founder & Full Stack Developer
              </p>

              <span>Administrator</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* =========================
     SETTINGS
  ========================= */

  function SettingsPage() {
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">SYSTEM</p>

            <h2>Settings</h2>

            <p>ProjectFlow configuration.</p>
          </div>
        </div>

        <section className="panel">
          <div className="setting-row">
            <div>
              <strong>Backend</strong>
              <p>Express + Node.js</p>
            </div>

            <span className="online-badge">
              Connected
            </span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Database</strong>
              <p>MongoDB Atlas</p>
            </div>

            <span className="online-badge">
              Connected
            </span>
          </div>
        </section>
      </div>
    );
  }

  function renderPage() {
    if (page === "Projects") {
      return <ProjectsPage />;
    }

    if (page === "Tasks") {
      return <TasksPage />;
    }

    if (page === "Team") {
      return <TeamPage />;
    }

    if (page === "Settings") {
      return <SettingsPage />;
    }

    return <Overview />;
  }

  return (
    <div className="app-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <img
            src="/aryonixlogo.png"
            alt="ARYONIX"
          />
        </div>

        <nav className="side-nav">
          {[
            "Overview",
            "Projects",
            "Tasks",
            "Team",
            "Settings",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className={`nav-item ${
                page === item ? "active" : ""
              }`}
              onClick={() => setPage(item)}
            >
              <span className="nav-dot" />
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <img
            src="/profile.jpg"
            alt="Aryan"
          />

          <div>
            <strong>Aryan Mandavgode</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              PROJECTFLOW
            </p>

            <h1>{page}</h1>
          </div>

          <div className="top-actions">
            <button
              type="button"
              className="primary-button"
              onClick={openCreateProject}
            >
              + New Project
            </button>

            <img
              className="top-avatar"
              src="/profile.jpg"
              alt="Aryan"
            />
          </div>
        </header>

        {renderPage()}
      </main>

      {/* PROJECT MODAL */}

      {showProjectModal && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  PROJECT
                </p>

                <h2>
                  {editingProject
                    ? "Edit Project"
                    : "Create Project"}
                </h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setShowProjectModal(false)
                }
              >
                ×
              </button>
            </div>

            {projectError && (
              <div className="error-state">
                {projectError}
              </div>
            )}

            <form onSubmit={handleProjectSubmit}>

              <label>
                Project Name

                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(event) =>
                    setProjectForm({
                      ...projectForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="ARYONIX Website"
                />
              </label>

              <label>
                Client

                <input
                  type="text"
                  value={projectForm.client}
                  onChange={(event) =>
                    setProjectForm({
                      ...projectForm,
                      client: event.target.value,
                    })
                  }
                  placeholder="Client name"
                />
              </label>

              <div className="form-grid">

                <label>
                  Status

                  <select
                    value={projectForm.status}
                    onChange={(event) =>
                      setProjectForm({
                        ...projectForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option value="Planning">
                      Planning
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </label>

                <label>
                  Priority

                  <select
                    value={projectForm.priority}
                    onChange={(event) =>
                      setProjectForm({
                        ...projectForm,
                        priority: event.target.value,
                      })
                    }
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>
                </label>

              </div>

              <label>
                Due Date

                <input
                  type="date"
                  value={projectForm.dueDate}
                  onChange={(event) =>
                    setProjectForm({
                      ...projectForm,
                      dueDate: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Progress

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={projectForm.progress}
                  onChange={(event) =>
                    setProjectForm({
                      ...projectForm,
                      progress: event.target.value,
                    })
                  }
                />
              </label>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowProjectModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* TASK MODAL */}

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  TASK
                </p>

                <h2>
                  {editingTask
                    ? "Edit Task"
                    : "Create Task"}
                </h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => {
                  setShowTaskModal(false);
                  setTaskError("");
                }}
              >
                ×
              </button>
            </div>

            {taskError && (
              <div className="error-state">
                {taskError}
              </div>
            )}

            <form onSubmit={handleTaskSubmit}>

              <label>
                Task Title

                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(event) =>
                    setTaskForm({
                      ...taskForm,
                      title: event.target.value,
                    })
                  }
                  placeholder="Design landing page"
                  autoFocus
                />
              </label>

              <label>
                Project

                <select
                  value={taskForm.project}
                  onChange={(event) =>
                    setTaskForm({
                      ...taskForm,
                      project: event.target.value,
                    })
                  }
                >
                  <option value="">
                    Select a project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Priority

                <select
                  value={taskForm.priority}
                  onChange={(event) =>
                    setTaskForm({
                      ...taskForm,
                      priority: event.target.value,
                    })
                  }
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </label>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setShowTaskModal(false);
                    setTaskError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingTask
                    ? "Save Changes"
                    : "Create Task"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;