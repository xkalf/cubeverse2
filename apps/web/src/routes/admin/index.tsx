import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, BookOpen, Settings, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-bold text-2xl tracking-tight">Dashboard</h2>
				<p className="text-muted-foreground">
					Welcome to the admin panel. Here's an overview of your system.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Total Teachers
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">12</div>
						<p className="text-muted-foreground text-xs">+2 from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Subjects</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">8</div>
						<p className="text-muted-foreground text-xs">+1 from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Active Sessions
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">24</div>
						<p className="text-muted-foreground text-xs">+4 from yesterday</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">System Status</CardTitle>
						<Settings className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl text-green-600">Online</div>
						<p className="text-muted-foreground text-xs">
							All systems operational
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
									<Users className="h-4 w-4 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="font-medium text-sm">New teacher registered</p>
									<p className="text-muted-foreground text-sm">
										John Smith joined the system
									</p>
								</div>
								<div className="ml-auto text-muted-foreground text-sm">
									2 hours ago
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
									<BookOpen className="h-4 w-4 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="font-medium text-sm">Subject updated</p>
									<p className="text-muted-foreground text-sm">
										Mathematics curriculum updated
									</p>
								</div>
								<div className="ml-auto text-muted-foreground text-sm">
									4 hours ago
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
									<Settings className="h-4 w-4 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="font-medium text-sm">System maintenance</p>
									<p className="text-muted-foreground text-sm">
										Database backup completed
									</p>
								</div>
								<div className="ml-auto text-muted-foreground text-sm">
									6 hours ago
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="grid gap-2">
							<div className="flex items-center justify-between rounded-lg border p-3">
								<span className="font-medium text-sm">Add New Teacher</span>
								<Users className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="flex items-center justify-between rounded-lg border p-3">
								<span className="font-medium text-sm">Manage Subjects</span>
								<BookOpen className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="flex items-center justify-between rounded-lg border p-3">
								<span className="font-medium text-sm">System Settings</span>
								<Settings className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="flex items-center justify-between rounded-lg border p-3">
								<span className="font-medium text-sm">View Analytics</span>
								<BarChart3 className="h-4 w-4 text-muted-foreground" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
