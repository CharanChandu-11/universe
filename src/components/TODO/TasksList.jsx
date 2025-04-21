import { useState } from "react";

function TasksList({ tasks, setTasks }) {
  const [editValue, setEditValue] = useState("");

  function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  function toggleEdit(task) {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, isEditing: !t.isEditing } : t
    );
    setTasks(updatedTasks);
    setEditValue(task.name);
  }

  function saveEditedTask(id) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, name: editValue, isEditing: false } : task
    );
    setTasks(updatedTasks);
    setEditValue("");
  }

  return (
    <div className="text-center">
      <h2>Tasks List</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="d-flex justify-content-between align-items-center mb-3 "
        >
          {task.isEditing ? (
            <input
              type="text"
              className="form-control bg-white border border-2 mt-3 me-2"
              style={{ width: "60%" }}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          ) :    (
            <p className="fs-4 m-4 mt-2" style={{ width: "60%" }}>{task.name}</p>
          )}

          <div className="btn-group">
            {task.isEditing ? (
              <button
                className="btn btn-success btn-sm"
                onClick={() => saveEditedTask(task.id)}
              >
                Save
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => toggleEdit(task)}
              >
                Edit
              </button>
            )}
            <button
              className="btn btn-danger btn-sm ms-2"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TasksList;
