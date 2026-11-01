"use client";

import Link from "next/link";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import { ShowcasePostList } from "@/app/(main)/showcase/_components/showcase-post-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function ShowcaseFeedPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-[#f7f8fc]">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-sm font-semibold text-slate-900">Showcase feed</h1>
        </header>
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Community posts</h2>
              <p className="mt-1 text-sm text-slate-500">
                See what everyone is sharing.
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/showcase/upload" />}
              className="rounded-full bg-slate-700 text-white hover:bg-slate-800"
            >
              Create a post
            </Button>
          </div>
          <section
            aria-label="All Showcase posts"
            className="space-y-3"
          >
            <ShowcasePostList />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
