const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let numberOfRequests = 0;

server.use((req, res, next) => {
  numberOfRequests++;
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  console.log(`Número de Requisições Feitas: ${numberOfRequests}`);
  return next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project id already exists" });
  }

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(project => {
    if (project.id === id) {
      project.title = title;
    }
  });

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.push(title);

  return res.json(project);
});

server.listen(3000);
