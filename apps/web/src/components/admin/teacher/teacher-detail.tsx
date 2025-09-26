import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Teacher } from "./types";

interface TeacherDetailProps {
	teacher: Teacher;
	onClose: () => void;
}

export function TeacherDetail({ teacher, onClose }: TeacherDetailProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>ID</Label>
				<p className="text-sm">{teacher.id}</p>
			</div>
			<div className="space-y-2">
				<Label>First Name</Label>
				<p className="text-sm">{teacher.firstname}</p>
			</div>
			<div className="space-y-2">
				<Label>Last Name</Label>
				<p className="text-sm">{teacher.lastname}</p>
			</div>
			<div className="flex justify-end">
				<Button onClick={onClose}>Close</Button>
			</div>
		</div>
	);
}
