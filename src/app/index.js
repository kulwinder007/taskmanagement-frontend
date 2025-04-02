import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TaskList from "@/components/TaskList";
import { fetchTasks, addTask, deleteTask } from "@/services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const task = await addTask(newTask);
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Task Manager</h1>
      <div className="flex gap-2 mb-4">
        <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task" />
        <Button onClick={handleAddTask}>Add</Button>
      </div>
      <TaskList tasks={tasks} onDelete={handleDeleteTask} />
      <Button onClick={() => router.push("/login")} className="mt-4">Logout</Button>
    </div>
  );
}
