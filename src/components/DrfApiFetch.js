import axios from 'axios'
import React, { useState, useEffect } from 'react'

const DrfApiFetch = () => {

    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState([])
    const [editedTask, setEditedTask] = useState({ id: '', title: '' })
    const [id, setId] = useState(1)

    useEffect(() => {
        axios.get('http://127.0.0.1:3001/api/tasks/', {
            headers: {
                'Authorization': 'Token d12dfe753cbc8af74d43e674aba0188d404b6b30'
            }
        })
            .then(res => { setTasks(res.data) })
    }, [])

    const getTask = () => {
        axios.get(`http://127.0.0.1:3001/api/tasks/${id}`, {
            headers: {
                'Authorization': 'Token d12dfe753cbc8af74d43e674aba0188d404b6b30'
            }
        })
            .then(res => {
                setSelectedTask(res.data)
            })
    }

    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:3001/api/tasks/${id}/`, {
            headers: {
                'Authorization': 'Token d12dfe753cbc8af74d43e674aba0188d404b6b30'
            }
        })
            .then(res => {
                setTasks(tasks.filter(task => task.id !== id));
                setSelectedTask([]);
                if (editedTask.id === id) {　　　　　　　　　　　/*ここから3行追加*/
                    setEditedTask({ id: "", title: "" });
                }
            })
    }

    const newTask = (task) => {
        const data = {
            title: task.title
        }
        axios.post(`http://127.0.0.1:3001/api/tasks/`, data, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'd12dfe753cbc8af74d43e674aba0188d404b6b30'
            }
        })
            .then(res => { setTasks([...tasks, res.data]); setEditedTask({ id: '', title: '' }); }
            )
    }

    const handleInputChange = () => evt => {
        const value = evt.target.value;
        const name = evt.target.name;
        setEditedTask({ ...editedTask, [name]: value })
    }

    const editTask = (task) => {

        axios.put(`http://127.0.0.1:3001/api/tasks/${task.id}/`, task, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'd12dfe753cbc8af74d43e674aba0188d404b6b30'
            }
        })
            .then(res => {
                setTasks(tasks.map(task => (task.id === editedTask.id ? res.data : task)));
                setEditedTask({ id: '', title: '' })
            })
    }

    return (
        <div>
            <ul>
                {
                    tasks.map(task => <li key={task.id}>{task.title} {task.id}
                        <button onClick={() => deleteTask(task.id)}>
                            <i className='fas fa-trash-alt'></i>
                        </button>
                        <button onClick={() => setEditedTask(task)}>
                            <i className='fas fa-pen'></i>
                        </button>
                    </li>)

                }
            </ul>

            Set id<br />
            <input type='text' value={id} onChange={evt => { setId(evt.target.value) }} />
            <br />
            <button type='button' onClick={() => getTask()}>Get task</button>
            <h3>{selectedTask.title} {selectedTask.id}</h3>
            <input type='text' name='title' value={editedTask.title} onChange={handleInputChange()} placeholder='New task ?' required />
            {editedTask.id ?
                <button onClick={() => editTask(editedTask)}>Update</button> :
                <button onClick={() => newTask(editedTask)}>Create</button>}
        </div>
    )
}

export default DrfApiFetch
