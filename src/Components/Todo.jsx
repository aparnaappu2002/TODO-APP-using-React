import React, { useState, useRef, useEffect } from "react";
import "./Todo.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";

const Todo = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditID] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const addTodo = () => {
    // Trim the input to remove leading and trailing spaces
    const trimmedTodo = todo.trim();

    // Check if the trimmed input is empty
    if (!trimmedTodo) return; // Prevent adding empty todos or only whitespace

    // Check if the todo already exists (case-insensitive)
    const isDuplicate = todos.some(
      (t) => t.list.toLowerCase() === trimmedTodo.toLowerCase()
    );

    if (isDuplicate) {
      alert("Todo already exists!");
      return; // Prevent adding duplicates
    }

    if (editId) {
      const editTodo = todos.find((todo) => todo.id === editId);
      const updateTodo = todos.map((to) =>
        to.id === editTodo.id
          ? { ...to, list: trimmedTodo } // Update the existing todo
          : to
      );
      setTodos(updateTodo);
      setEditID(0);
      setTodo("");
    } else {
      setTodos([{ list: trimmedTodo, id: Date.now(), status: false }, ...todos]);
      setTodo(""); // Clear the input field
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Add confirmation before deletion
  const onDelete = (id, status) => {
    if (status) {
      alert("Cannot delete a completed todo!");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
    if (confirmDelete) {
      const updatedTodos = todos.filter((to) => to.id !== id);
      setTodos(updatedTodos);
    }
  };

  const onComplete = (id) => {
    const updatedTodos = todos.map((list) =>
      list.id === id ? { ...list, status: !list.status } : list
    );
    setTodos(updatedTodos);
  };

  const onEdit = (id, status) => {
    if (status) {
      alert("Cannot edit a completed todo!");
      return;
    }

    const editTodo = todos.find((to) => to.id === id);
    setTodo(editTodo.list);
    setEditID(editTodo.id);
  };

  return (
    <div className="container">
      <h2 className="head">TODO APP</h2>
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          value={todo}
          ref={inputRef}
          onChange={(event) => setTodo(event.target.value)}
          type="text"
          placeholder="Enter your Todo"
          className="form-control"
        />
        <button onClick={addTodo}>{editId ? "EDIT" : "ADD"}</button>
      </form>

      <div className="list">
        <ul>
          {todos.map((to) => (
            <li className="list-items" key={to.id}>
              <div className="list-item-list" id={to.status ? "list-item" : ""}>
                {to.list}
              </div>

              <span>
                <IoMdDoneAll
                  className="list-item-icons"
                  id="complete"
                  title="Complete"
                  onClick={() => onComplete(to.id)}
                />
                <FaEdit
                  className={`list-item-icons ${to.status ? "disabled" : ""}`}
                  id="edit"
                  title="Edit"
                  onClick={() => onEdit(to.id, to.status)}
                />
                <MdDelete
                  className={`list-item-icons ${to.status ? "disabled" : ""}`}
                  id="delete"
                  title="Delete"
                  onClick={() => onDelete(to.id, to.status)}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
