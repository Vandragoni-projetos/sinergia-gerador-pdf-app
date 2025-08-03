import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Palette, FileText, History, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Gerador",
    url: createPageUrl("Generator"),
    icon: Palette,
  },
  {
    title: "Projetos",
    url: createPageUrl("Projects"),
    icon: History,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <style>{`
          :root {
            --sidebar-background: rgba(26, 26, 26, 0.95);
            --sidebar-foreground: #f5f5f5;
            --sidebar-primary: #d4af37;
            --sidebar-primary-foreground: #1a1a1a;
            --sidebar-accent: rgba(212, 175, 55, 0.1);
            --sidebar-accent-foreground: #d4af37;
            --sidebar-border: rgba(212, 175, 55, 0.2);
          }
        `}</style>
        
        <Sidebar className="border-r border-amber-500/20 backdrop-blur-xl bg-black/90">
          <SidebarHeader className="border-b border-amber-500/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-black font-bold" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white tracking-tight">SinergIA</h2>
                <p className="text-xs text-amber-400 font-medium">Gerador de PDF</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-amber-400 uppercase tracking-wider px-3 py-3">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-amber-500/10 hover:text-amber-400 transition-all duration-300 rounded-xl px-4 py-3 group ${
                          location.pathname === item.url ? 'bg-amber-500/15 text-amber-400 shadow-md' : 'text-gray-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-4">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-black/40 backdrop-blur-xl border-b border-amber-500/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-amber-500/10 p-2 rounded-lg transition-colors duration-300 text-amber-400" />
              <h1 className="text-xl font-bold text-white">SinergIA</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}