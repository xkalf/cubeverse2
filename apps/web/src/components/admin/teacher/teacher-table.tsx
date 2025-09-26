import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { orpc } from "@/utils/orpc";
import type { Teacher } from "./types";

interface TeacherTableProps {
	onView: (teacher: Teacher) => void;
	onEdit: (teacher: Teacher) => void;
}

export function TeacherTable({ onView, onEdit }: TeacherTableProps) {
	const queryClient = useQueryClient();
	const teachers = useQuery(orpc.teacher.getAll.queryOptions());

	const deleteMutation = useMutation(
		orpc.teacher.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.teacher.getAll.queryKey(),
				});
			},
		}),
	);

	const handleDelete = (id: number) => {
		if (confirm("Устгахдаа итгэлтэй байна уу.")) {
			deleteMutation.mutate({ id });
		}
	};

	if (teachers.isLoading) {
		return (
			<div className="flex justify-center py-8">
				<Loader2 className="h-6 w-6 animate-spin" />
			</div>
		);
	}

	if (teachers.data?.length === 0) {
		return (
			<p className="py-8 text-center text-muted-foreground">
				No teachers found. Create one to get started.
			</p>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>First Name</TableHead>
					<TableHead>Last Name</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{teachers.data?.map((teacher) => (
					<TableRow key={teacher.id}>
						<TableCell>{teacher.id}</TableCell>
						<TableCell>{teacher.firstname}</TableCell>
						<TableCell>{teacher.lastname}</TableCell>
						<TableCell className="text-right">
							<div className="flex justify-end space-x-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onView(teacher)}
								>
									<Eye className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(teacher)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDelete(teacher.id)}
									disabled={deleteMutation.isPending}
								>
									{deleteMutation.isPending ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
