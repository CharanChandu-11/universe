import { useForm } from "react-hook-form";

function AddTask(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  function addNewTask(taskObj) {
    props.setTasks([
      ...props.tasks,
      { id: Date.now(), name: taskObj.newTask, isEditing: false }
    ]);
    reset();
  }

  return (
    <div className="text-center">
      <h2>Add Task</h2>
      <form className="mt-5" onSubmit={handleSubmit(addNewTask)}>
        <input
          type="text"
          {...register("newTask", { required: true })}
          className="form-control bg-white border border-2  mb-4"
          placeholder="Add task here..."
        />
        {errors.newTask?.type === 'required' && (
          <p className="text-danger">Please enter a task</p>
        )}
        <button className="btn btn-warning" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTask;
