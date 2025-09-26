import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<SidebarProvider>
			<div className="grid min-h-screen w-full grid-cols-[var(--sidebar-width-icon)_2fr] lg:grid-cols-[var(--sidebar-width)_2fr]">
				<AdminSidebar />
				<main className="h-full w-full min-w-0 pr-5">
					<Outlet />
				</main>
			</div>
		</SidebarProvider>
	);
}
