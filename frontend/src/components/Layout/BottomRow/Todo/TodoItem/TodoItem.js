import { useRef, useState } from "react";
import useAuth from "../../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import useRefreshToken from "../../../../../hooks/useRefreshToken";
import useTasks from "../../../../../hooks/useTasks";
import TodoItemMenu from "./TodoItemMenu";

const TodoItem = ({ task }) => {
  const [errMsg, setErrMsg] = useState(null);
  const { auth } = useAuth();
  const { access_token } = auth;
  const axiosPrivate = useAxiosPrivate();
  const { setTasks } = useTasks();
  const [isTaskDone, setIsTaskDone] = useState(task.task_state?.is_completed);
  const [isTodoItemMenuOpen, setIsTodoItemMenuOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const taskRef = useRef();
  // functions or Methods
  const handleDoneTodo = async () => {
    setIsTaskDone(!isTaskDone);
    try {
      const res = await axiosPrivate.patch(
        `/tasks/${task.id}`,
        { ...task, is_completed: isTaskDone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          withCredentials: true,
        }
      );
      setTasks((prev) => ({ ...prev, allTasks: res.data?.tasks }));
    } catch (error) {
      if (!error.response) {
        setErrMsg("Network Error!");
      } else {
        console.log(error);
        setErrMsg(error.response.data?.msg);
      }
    }
  };

  const handleDeleteTask = async () => {
    try {
      const res = await axiosPrivate.delete(`/tasks/${task.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
      });
      setTasks((prev) => ({ ...prev, allTasks: res.data?.tasks }));
    } catch (error) {
      if (!error.response) {
        setErrMsg("Network Error!");
      } else {
        console.log(error);
        setErrMsg(error.response.data?.msg);
      }
    }
  };

  // Return
  return (
    <div className="flex group justify-between">
      <div className="flex gap-1">
        <input
          checked={isTaskDone}
          onChange={handleDoneTodo}
          type="checkbox"
          name="taskDone"
          id="taskDone"
          className="m-2"
        />
        <p
          className={
            `task-description my-1 outline-none ${
              isTaskDone && "text-white/50 line-through"
            } ${isEditable && "border-b"} ` + task.todoClass
          }
          contentEditable={isEditable}
          onDoubleClick={() => setIsEditable(true)}
          onBlur={() => setIsEditable(false)}
          ref={taskRef}
        >
          {task.description}
        </p>
      </div>
      <div
        className="last more invisible hover:cursor-pointer  group-hover:visible text-2xl  "
        // onClick={deleteTask}
      >
        <button
          className="relative self-center"
          onClick={() => setIsTodoItemMenuOpen(true)}
        >
          ...
          {isTodoItemMenuOpen && (
            <TodoItemMenu
              deleteTask={handleDeleteTask}
              setIsEditable={setIsEditable}
            />
          )}
        </button>
      </div>
    </div>
  );
};
export default TodoItem;
