import { Button } from "@/components/ui/button";

export default function TaskItem({ task, onDelete }) {
  return (
    <div className="p-4 flex justify-between border-b">
      {task.description}
      <Button onClick={() => onDelete(task.id)}>Delete</Button>
    </div>
  );
}
