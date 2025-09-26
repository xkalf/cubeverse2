import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import type React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { FileRouteTypes } from "@/routeTree.gen";

const adminNavigation: {
	title: string;
	route: FileRouteTypes["to"];
}[] = [
	{
		title: "Dashboard",
		route: "/admin",
	},
	{
		title: "Багш",
		route: "/admin/teacher",
	},
];

export function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="flex w-[220px] items-center gap-2 px-2 py-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
						<Settings className="h-4 w-4 text-primary-foreground" />
					</div>
					<div className="flex flex-col">
						<span className="font-semibold text-sm">Admin Panel</span>
						<span className="text-muted-foreground text-xs">Management</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{adminNavigation.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link to={item.route}>{item.title}</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
