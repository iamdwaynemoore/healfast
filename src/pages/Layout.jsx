

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Timer,
  Home,
  Utensils,
  User,
  Activity,
  Users // Added Users icon
} from
"lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger } from
"@/components/ui/sidebar";

const navigationItems = [
{
  title: "Dashboard",
  url: createPageUrl("Dashboard"),
  icon: Home
},
{
  title: "Start Fast",
  url: createPageUrl("StartFast"),
  icon: Timer
},
{
  title: "Active Timer",
  url: createPageUrl("ActiveTimer"),
  icon: Activity
},
{
  title: "Nutrition",
  url: createPageUrl("Nutrition"),
  icon: Utensils
},
{
  title: "Community", // Added Community
  url: createPageUrl("Community"),
  icon: Users
},
{
  title: "Profile",
  url: createPageUrl("Profile"),
  icon: User
}];


export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --background: 0 0% 0%; /* #000000 */
          --foreground: 0 0% 100%; /* #FFFFFF */
          
          --card: 220 13% 12%; /* #1A1D23 */
          --card-foreground: 0 0% 100%;

          --primary: 217 59% 39%; /* #2C5AA0 */
          --primary-foreground: 0 0% 100%;
          
          --accent: 195 38% 46%; /* #4A90A4 */
          --accent-foreground: 0 0% 100%;
          --accent-dark: 194 45% 37%; /* #357A8A */
          
          --highlight: 204 43% 59%; /* #7FB3D3 */
          
          --border: 220 13% 15%; /* #212529 */
          --ring: 217 59% 39%;
          
          --sidebar-background: 220 29% 7%; /* #0A0E15 */
        }
        
        body {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        .timer-progress-gradient {
          background: linear-gradient(90deg, hsl(var(--accent-dark)) 0%, hsl(var(--highlight)) 100%);
        }

        .gradient-text {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-background" data-theme="dark">
        <Sidebar className="bg-[hsl(var(--sidebar-background))] border-r border-border">
          <SidebarHeader className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8066a67bc_healfast-header-tr.png"
                alt="HealFast"
                className="w-32 h-auto" />

            </div>
            <p className="text-slate-300 mt-2 text-sm font-light">Mindful Fasting Journey</p>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) =>
                  <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                      asChild
                      data-active={location.pathname === item.url}
                      className="text-foreground/80 hover:bg-card/80 hover:text-primary transition-all duration-300 rounded-xl mb-1 data-[active=true]:bg-card data-[active=true]:text-primary">

                        <Link to={item.url} className="text-slate-300 mb-1 px-4 py-3 text-sm peer/menu-button flex w-full items-center gap-2 overflow-hidden outline-none ring-sidebar-ring focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8 hover:bg-card/80 hover:text-primary transition-all duration-300 rounded-xl data-[active=true]:bg-card data-[active=true]:text-primary gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-foreground/90 text-sm">Your Journey</p>
              <p className="text-slate-300 mt-1 text-xs">Transform through fasting</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-background">
          <header className="bg-sidebar-background/80 backdrop-blur-lg border-b border-border px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-card p-2 rounded-lg transition-colors duration-200 text-foreground/80" />
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8066a67bc_healfast-header-tr.png"
                alt="HealFast"
                className="h-6" />

            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>);

}

