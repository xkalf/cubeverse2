import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";

type SidebarContext = {
	state: "open" | "closed";
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}
	return context;
}

const SidebarProvider = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		defaultOpen?: boolean;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
	}
>(
	(
		{
			defaultOpen = true,
			open: openProp,
			onOpenChange: setOpenProp,
			className,
			style,
			children,
			...props
		},
		ref,
	) => {
		const [openMobile, setOpenMobile] = React.useState(false);
		const [_open, _setOpen] = React.useState(defaultOpen);
		const open = openProp ?? _open;
		const setOpen = React.useCallback(
			(value: boolean | ((value: boolean) => boolean)) => {
				const openState = typeof value === "function" ? value(open) : value;
				if (setOpenProp) {
					setOpenProp(openState);
				} else {
					_setOpen(openState);
				}
				document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
			},
			[setOpenProp, open],
		);

		const toggleSidebar = React.useCallback(() => {
			return setOpen((open) => !open);
		}, [setOpen]);

		const state = open ? "open" : "closed";
		const isMobile = false; // Simplified for this implementation

		const contextValue = React.useMemo<SidebarContext>(
			() => ({
				state,
				open,
				setOpen,
				isMobile,
				openMobile,
				setOpenMobile,
				toggleSidebar,
			}),
			[
				state,
				open,
				setOpen,
				isMobile,
				openMobile,
				setOpenMobile,
				toggleSidebar,
			],
		);

		return (
			<SidebarContext.Provider value={contextValue}>
				<div
					style={
						{
							"--sidebar-width": SIDEBAR_WIDTH,
							"--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
							...style,
						} as React.CSSProperties
					}
					className={cn(
						"group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
						className,
					)}
					ref={ref}
					{...props}
				>
					{children}
				</div>
			</SidebarContext.Provider>
		);
	},
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		side?: "left" | "right";
		variant?: "sidebar" | "floating" | "inset";
		collapsible?: "offcanvas" | "icon" | "none";
	}
>(
	(
		{
			side = "left",
			variant = "sidebar",
			collapsible = "offcanvas",
			className,
			children,
			...props
		},
		ref,
	) => {
		const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

		if (collapsible === "none") {
			return (
				<div
					className={cn(
						"flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
						className,
					)}
					ref={ref}
					{...props}
				>
					{children}
				</div>
			);
		}

		if (isMobile) {
			return (
				<div className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in lg:hidden">
					<div
						ref={ref}
						data-state={openMobile ? "open" : "closed"}
						className={cn(
							"fixed inset-y-0 z-60 h-full w-[--sidebar-width-mobile] bg-sidebar p-0 text-sidebar-foreground shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500",
							side === "left" &&
								"data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left left-0",
							side === "right" &&
								"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right right-0",
							className,
						)}
						{...props}
					>
						{children}
					</div>
				</div>
			);
		}

		return (
			<div
				ref={ref}
				className="group peer hidden text-sidebar-foreground lg:block"
				data-state={state}
				data-collapsible={state === "closed" ? collapsible : ""}
				data-variant={variant}
				data-side={side}
			>
				<div
					className={cn(
						"relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
						"group-data-[collapsible=offcanvas]:w-0",
						"group-data-[side=right]:rotate-180",
						variant === "floating" || variant === "inset"
							? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
							: "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
					)}
				/>
				<div
					className={cn(
						"fixed inset-y-0 z-40 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear lg:flex",
						side === "left" &&
							"left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
						side === "right" &&
							"right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
						variant === "inset" && "bg-sidebar",
						className,
					)}
					{...props}
				>
					<div
						data-sidebar="sidebar"
						className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:mt-2 group-data-[variant=floating]:mr-2 group-data-[variant=floating]:ml-2 group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
					>
						{children}
					</div>
				</div>
			</div>
		);
	},
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
	React.ElementRef<typeof Button>,
	React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			ref={ref}
			data-sidebar="trigger"
			variant="ghost"
			size="icon"
			className={cn("h-7 w-7", className)}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebar();
			}}
			{...props}
		>
			<PanelLeft />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	);
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarInset = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<main
			ref={ref}
			className={cn(
				"relative z-0 flex min-h-svh flex-1 flex-col bg-background",
				"peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] lg:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 lg:peer-data-[variant=inset]:m-2 lg:peer-data-[variant=inset]:ml-0 lg:peer-data-[variant=inset]:rounded-xl lg:peer-data-[variant=inset]:shadow",
				className,
			)}
			{...props}
		/>
	);
});
SidebarInset.displayName = "SidebarInset";

const SidebarHeader = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar="header"
			className={cn("flex flex-col gap-2 p-2", className)}
			{...props}
		/>
	);
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar="content"
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
				className,
			)}
			{...props}
		/>
	);
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar="group"
			className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
			{...props}
		/>
	);
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> & {
		asChild?: boolean;
	}
>(({ className, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			ref={ref}
			data-sidebar="group-label"
			className={cn(
				"flex h-8 shrink-0 items-center rounded-md px-2 font-medium text-sidebar-foreground/70 text-xs outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
				"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
				className,
			)}
			{...props}
		/>
	);
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar="group-content"
			className={cn("w-full text-sm", className)}
			{...props}
		/>
	);
});
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
	return (
		<ul
			ref={ref}
			data-sidebar="menu"
			className={cn("flex w-full min-w-0 flex-col gap-1", className)}
			{...props}
		/>
	);
});
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
	return (
		<li
			ref={ref}
			data-sidebar="menu-item"
			className={cn("group/menu-item relative", className)}
			{...props}
		/>
	);
});
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
	"peer/menu-button group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				outline:
					"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
			},
			size: {
				default: "h-8 text-sm",
				sm: "h-7 text-xs",
				lg: "group-data-[collapsible=icon]:!size-8 h-12 text-sm",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const SidebarMenuButton = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<"button"> & {
		asChild?: boolean;
		isActive?: boolean;
		tooltip?: string | React.ComponentProps<any>;
	} & VariantProps<typeof sidebarMenuButtonVariants>
>(
	(
		{
			asChild = false,
			isActive = false,
			variant = "default",
			size = "default",
			tooltip,
			className,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";

		return (
			<Comp
				ref={ref}
				data-sidebar="menu-button"
				data-size={size}
				data-active={isActive}
				className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
				{...props}
			/>
		);
	},
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
};
