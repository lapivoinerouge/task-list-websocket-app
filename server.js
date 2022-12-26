const express = require('express');
const app = express();
const port = '8000';

const tasks = [];

const server = app.listen(port || 8000, () => {
    console.log('Server is running on port: 8000');
});

const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3000"
    }
});

io.on('connection', (socket) => {
    console.log('New client! Id: ' + socket.id);
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        console.log('New task: ' + task);
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', (taskId) => {
        console.log('Deleted task: ' + taskId);
        const idx = tasks.map(o => o.id).indexOf(taskId);
        tasks.splice(idx, 1);
        socket.broadcast.emit('removeTask', taskId);
    });
});

app.get('/', (req, res) => {
    res.json(tasks);
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});