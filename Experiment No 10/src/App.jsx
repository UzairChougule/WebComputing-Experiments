import React, { useState } from "react";
import {Container,Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState({});

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!studentName || !projectTitle || !description) {
      alert("Please fill in all fields.");
      return;
    }
    const newProject = {
      id: Date.now(),
      studentName,
      projectTitle,
      description,
      feedback: [],
    };
    setProjects([...projects, newProject]);
    setStudentName("");
    setProjectTitle("");
    setDescription("");
  };

  const handleAddFeedback = (id, rating, comment) => {
    if (!rating || !comment) {
      alert("Please provide both rating and comment.");
      return;
    }
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              feedback: [...p.feedback, { rating: Number(rating), comment }],
            }
          : p
      )
    );
    setFeedback({ ...feedback, [id]: { rating: "", comment: "" } });
  };

  const averageRating = (feedbackArr) => {
    if (feedbackArr.length === 0) return "No ratings yet";
    const sum = feedbackArr.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbackArr.length).toFixed(1);
  };

  return (
    <Container className="py-4">
      <h2 className="text-center text-primary mb-4">
        Mini Project Peer Review Platform
      </h2>

      <Card className="mb-5 shadow-sm">
        <Card.Body>
          <Card.Title>Submit Your Mini Project</Card.Title>
          <Form onSubmit={handleAddProject}>
            <Form.Group className="mb-3">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Short Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your project briefly"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Project
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        {projects.length === 0 ? (
          <Col>
            <p className="text-center text-muted">
              No projects yet. Submit the first one!
            </p>
          </Col>
        ) : (
          projects.map((project) => (
            <Col md={6} key={project.id} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{project.projectTitle}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    by {project.studentName}
                  </Card.Subtitle>
                  <Card.Text>{project.description}</Card.Text>

                  <p>
                    <strong>Average Rating:</strong>{" "}
                    <span className="text-warning">
                      {averageRating(project.feedback)}
                    </span>
                  </p>

                  <Form
                    className="border-top pt-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddFeedback(
                        project.id,
                        feedback[project.id]?.rating,
                        feedback[project.id]?.comment
                      );
                    }}
                  >
                    <Form.Label>Give Feedback</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="number"
                        placeholder="Rating (1-5)"
                        min="1"
                        max="5"
                        value={feedback[project.id]?.rating || ""}
                        onChange={(e) =>
                          setFeedback({
                            ...feedback,
                            [project.id]: {
                              ...feedback[project.id],
                              rating: e.target.value,
                            },
                          })
                        }
                        style={{ maxWidth: "120px" }}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Comment..."
                        value={feedback[project.id]?.comment || ""}
                        onChange={(e) =>
                          setFeedback({
                            ...feedback,
                            [project.id]: {
                              ...feedback[project.id],
                              comment: e.target.value,
                            },
                          })
                        }
                      />
                      <Button type="submit" variant="success">
                        Submit
                      </Button>
                    </InputGroup>
                  </Form>

                  {project.feedback.length > 0 && (
                    <ListGroup variant="flush" className="mt-3">
                      <ListGroup.Item active>
                        Feedback Received
                      </ListGroup.Item>
                      {project.feedback.map((f, idx) => (
                        <ListGroup.Item key={idx}>
                          {f.rating}/5 — {f.comment}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
