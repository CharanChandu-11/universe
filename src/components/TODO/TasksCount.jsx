import React from 'react'

function TasksCount(props) {
  return (
    <div className='text-center'>
           <h2>Task Count</h2>
           <p className="fs-1">{props.tasks.length}</p>
    </div>
  )
}

export default TasksCount