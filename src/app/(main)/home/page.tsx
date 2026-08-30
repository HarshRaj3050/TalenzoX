"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

type UserProfile = {
  full_name?: string;
  email?: string;
  id?: string;
  [key: string]: unknown;
};

import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const { data } = await api.get("/getUser");
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        if (isMounted) {
          setUser(parsedData as UserProfile | null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (isMounted) {
          setUser(null);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Home page User from state:", user);
    }
  }, [user]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white dark:bg-background border-b-2 border-black hover:border-black transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

{
  /*
  
  <div>
      <h2>{user?.full_name ?? "No profile found"}</h2>
      <p>{user?.email ?? "No email available"}</p>
      <p>{user?.id ?? "No Id available"}</p>
  </div>  
  
*/
}
