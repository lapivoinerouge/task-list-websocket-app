import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import shortid from 'shortid';

const socket = io("http://localhost:8000");

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    socket.on('addTask', task => {
      addTask(task)
    });
      
    socket.on('removeTask', taskId => {
      removeTask(taskId, false)
    });

    socket.on('updateData', tasks => {
      updateTasks(tasks)
    });
    return () => socket.off('disconnect');
  }, []);

  const removeTask = (id, isOwn) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if (isOwn) {
      socket.emit('removeTask', id);
    }
  }

  const submitForm = (e) => {
    e.preventDefault();
    const task = { name: taskName, id: shortid()}
    addTask(task);
    socket.emit('addTask', task);
    setTaskName('');
  }

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  }

  const updateTasks = tasks => {
    setTasks(tasks);
  }
 
  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(t => <li key={t.id} className="task">{t.name}<button className="btn btn--red" onClick={e => removeTask(t.id, true)}>Remove</button></li>)}
        </ul>
        <form id="add-task-form" onSubmit={e => submitForm(e)}>
          <input className="text-input" value={taskName} onChange={e => setTaskName(e.target.value)} autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}

export default App;