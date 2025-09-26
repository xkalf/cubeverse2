import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TeacherDetail } from "@/components/admin/teacher/teacher-detail";
import { TeacherForm } from "@/components/admin/teacher/teacher-form";
import { TeacherTable } from "@/components/admin/teacher/teacher-table";
import type { Teacher } from "@/components/admin/teacher/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/admin/teacher/")({
	component: TeacherListComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			orpc.teacher.getAll.queryOptions(),
		);
	},
});

function TeacherListComponent() {
	const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
	const [dialogMode, setDialogMode] = useState<
		"create" | "edit" | "view" | null
	>(null);

	const openDialog = (mode: "create" | "edit" | "view", teacher?: Teacher) => {
		setDialogMode(mode);
		setSelectedTeacher(teacher || null);
	};

	const closeDialog = () => {
		setDialogMode(null);
		setSelectedTeacher(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-2xl tracking-tight">Teachers</h2>
					<p className="text-muted-foreground">Manage teachers in the system</p>
				</div>
				<Dialog
					open={dialogMode === "create"}
					onOpenChange={(open) => !open && closeDialog()}
				>
					<DialogTrigger asChild>
						<Button onClick={() => openDialog("create")}>
							<Plus className="mr-2 h-4 w-4" />
							Add Teacher
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Teacher</DialogTitle>
						</DialogHeader>
						<TeacherForm onClose={closeDialog} isCreate />
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardContent className="p-0">
					<TeacherTable
						onView={(teacher) => openDialog("view", teacher)}
						onEdit={(teacher) => openDialog("edit", teacher)}
					/>
				</CardContent>
			</Card>

			{/* Edit Dialog */}
			<Dialog
				open={dialogMode === "edit"}
				onOpenChange={(open) => !open && closeDialog()}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Teacher</DialogTitle>
					</DialogHeader>
					{selectedTeacher && (
						<TeacherForm teacher={selectedTeacher} onClose={closeDialog} />
					)}
				</DialogContent>
			</Dialog>

			{/* View Dialog */}
			<Dialog
				open={dialogMode === "view"}
				onOpenChange={(open) => !open && closeDialog()}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Teacher Details</DialogTitle>
					</DialogHeader>
					{selectedTeacher && (
						<TeacherDetail teacher={selectedTeacher} onClose={closeDialog} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
