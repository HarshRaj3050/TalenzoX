import Link from "next/link";
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
import {
  ArrowRight,
} from "lucide-react";

const practiceSections = [
  {
    title: "Discipline Manners",
    description:
      "Build focus, responsibility, patience, and respectful habits.",
    image: "/behaviour/practice/image1.png",
    action: "Start discipline practice",
    route: "/behaviour/practice/discipline-manners"
  },
  {
    title: "Dressing Sense",
    description:
      "Learn how to choose clean, comfortable, and suitable clothes.",
    image: "/behaviour/practice/image2.png",
    action: "Practice dressing choices",
    route: "/behaviour/practice/discipline-manners"
  },
  {
    title: "Emotions",
    description:
      "Recognize feelings and practice healthy ways to express them.",
    image: "/behaviour/practice/image5.png",
    action: "Explore emotions",
    route: "/behaviour/practice/discipline-manners"
  },
  {
    title: "Daily Routine",
    description:
      "Create helpful routines for mornings, school, play, and bedtime.",
    image: "/behaviour/practice/image3.png",
    action: "Build a daily routine",
    route: "/behaviour/practice/discipline-manners"
  },
  {
    title: "Table Manners",
    description: "Practice kind, clean, and confident behavior during meals.",
    image: "/behaviour/practice/image4.png",
    action: "Practice table manners",
    route: "/behaviour/practice/discipline-manners"
  },
];

export default function BehaviourPracticePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen flex-col bg-amber-50/40">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-amber-100 bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/home">TalenzoX</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/behaviour/practice">
                  Behaviour
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Practice</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 overflow-y-auto p-5 sm:p-8">
          <section
            className="min-h-56 rounded-3xl border border-amber-200 bg-cover bg-center shadow-sm sm:min-h-60"
            style={{ backgroundImage: "url(/behaviour/bahaviour_banner.png)" }}
            aria-label="Behaviour Practice"
          />

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Practice sections
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Pick one area and grow one small habit at a time.
                </p>
              </div>
              <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm sm:inline-flex">
                5 skill areas
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {practiceSections.map((section) => {
                return (
                  <article
                    key={section.title}
                    className="group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-amber-100 bg-cover bg-center p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
                    style={{ backgroundImage: `url(${section.image})` }}
                  >
                    <div className="absolute inset-0  transition-colors group-hover:bg-slate-950/50" />
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-white">
                        {section.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/90">
                        {section.description}
                      </p>
                    </div>
                    <Link
                      href={section.route}
                      className="relative z-10 mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors group-hover:text-amber-200"
                    >
                      {section.action}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
