"use client";

import {
  UserIcon,
  PackageIcon,
  HeartIcon,
  EditIcon,
  // MapPinIcon,
  // CreditCardIcon,
  // StarIcon,
  LockIcon,
  // BellIcon,
  // GlobeIcon,
  // HelpCircleIcon,
  RefreshCwIcon,
  MailIcon,
  BuildingIcon,
  UserPlusIcon,
  // Share2Icon,
  ChevronDownIcon,
  User2,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  //   SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible } from "@/components/ui/collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { siteConfig } from "@/config/site";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TokenData } from "@/lib/helpers/getUserDataFromToken";

const sidebarItems = (user: TokenData) => [
  {
    label: "My Account",
    items: [
      { title: "Profile", url: "/profile", icon: UserIcon },
      { title: "Order History", url: "/orders", icon: PackageIcon },
      { title: "Wishlist", url: "/wishlist", icon: HeartIcon },
      // { title: "Addresses", url: "/addresses", icon: MapPinIcon },
      // {
      //   title: "Payment Methods",
      //   url: "/payment-methods",
      //   icon: CreditCardIcon,
      // },
      // { title: "Reviews", url: "/reviews", icon: StarIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Security", url: "/security", icon: LockIcon },
      { title: "Edit Profile", url: "/edit-profile", icon: EditIcon },
      // { title: "Notifications", url: "/notifications", icon: BellIcon },
      // { title: "Language", url: "/language", icon: GlobeIcon },
    ],
  },
  {
    label: "Help & Support",
    items: [
      // { title: "FAQs", url: "/faqs", icon: HelpCircleIcon },
      { title: "Returns", url: "/returns", icon: RefreshCwIcon },
      { title: "Contact", url: "/contact", icon: MailIcon },
    ],
  },
  {
    label: `Partner with ${siteConfig.name}`,
    items: [
      ...(user?.store
        ? [
            {
              title: "Store Management",
              url: `/store/${user.store}/dashboard`,
              icon: BuildingIcon,
            },
          ]
        : []),
      {
        title: "Become a Partner",
        url: "/become-partner",
        icon: UserPlusIcon,
      },
      // {
      //   title: "Affiliate Program",
      //   url: "/affiliate-program",
      //   icon: Share2Icon,
      // },
    ],
  },
];

export function AppSidebar({ user }: { user: TokenData | null }) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/sign-out");
      if (response.status === 200) {
        router.push("/sign-in");
        router.refresh();
        toast.success("Logged out successfully");
        return;
      }
      toast.error("Logout failed. Please try again.");
    } catch (error) {
      return error;
    }
  };

  if (!user) {
    router.push("/sign-in");
    return;
  }

  return (
    <Sidebar
      // variant={`inset`}
      collapsible={`offcanvas`}
      // className="absolute top-[7rem]"
      className="fixed top-[7rem] h-[calc(100vh-7rem)]"
    >
      <SidebarHeader className="border-b border-border p-4 text-lg">
        <SidebarMenu>
          <SidebarMenuItem>
            Greetings, {user?.firstName || "User"}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems(user).map((section, i) => (
                <Collapsible key={i} defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <span>{section.label}</span>
                        <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item, j) => (
                        <SidebarMenuSubItem key={j}>
                          <SidebarMenuButton asChild>
                            <a href={item.url}>
                              <item.icon className="mr-2 h-4 w-4" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full justify-start p-2">
              <User2 /> {user?.firstName || "User"}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuItem onClick={handleLogout}>
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
