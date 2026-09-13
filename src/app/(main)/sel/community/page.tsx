/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Star } from "lucide-react";
import { AppSidebar } from "@/app/(main)/_components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import GradientPurpleBackground from "@/components/background/gradient-purple";

interface CommentItem {
	id: string;
	author_name: string;
	body: string;
}

interface CommunityReport {
	id: string;
	author_name?: string;
	weather_label: string;
	emotion: string;
	emoji: string;
	intensity: number;
	note?: string;
	image_url?: string;
	created_at: string;
	likes: { count: number; likedByMe: boolean };
	comments: CommentItem[];
}

function relativeTime(value: string) {
	const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
	if (minutes < 60) return `${minutes}m ago`;
	if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
	return `${Math.floor(minutes / 1440)}d ago`;
}

export default function CommunityPage() {
	const [reports, setReports] = useState<CommunityReport[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1);
	const [busy, setBusy] = useState<string | null>(null);
	const [doubleClickLikeId, setDoubleClickLikeId] = useState<string | null>(null);
	const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
	const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
	const swipeStartX = useRef<number | null>(null);
	const lastImageTapAt = useRef(0);

	const loadFeed = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/sel/community");
			if (response.ok) setReports((await response.json()).reports || []);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { loadFeed(); }, []);
	useEffect(() => { setActiveIndex(0); }, [reports.length]);

	const advanceToNext = () => {
		setActiveIndex((current) => reports.length ? (current + 1) % reports.length : 0);
	};

	const advanceToPrevious = () => {
		setActiveIndex((current) => reports.length ? (current - 1 + reports.length) % reports.length : 0);
	};

	const toggleLike = async (reportId: string) => {
		if (busy) return;
		setBusy(reportId);
		try {
			const response = await fetch("/api/sel/community", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "like", report_id: reportId }),
			});
			if (response.ok) {
				const result = await response.json();
				setReports((current) => current.map((report) => report.id === reportId
					? { ...report, likes: { count: result.count, likedByMe: result.liked } }
					: report));
			}
		} finally {
			setBusy(null);
		}
	};

	const likeOnDoubleClick = async (report: CommunityReport) => {
		if (busy) return;
		setBusy(report.id);
		setDoubleClickLikeId(report.id);

		if (!report.likes.likedByMe) {
			setReports((current) => current.map((item) => item.id === report.id
				? { ...item, likes: { count: item.likes.count + 1, likedByMe: true } }
				: item));
			const response = await fetch("/api/sel/community", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "like", report_id: report.id }),
			});
			if (response.ok) {
				const result = await response.json();
				setReports((current) => current.map((item) => item.id === report.id
					? { ...item, likes: { count: result.count, likedByMe: result.liked } }
					: item));
			}
		}

		await new Promise((resolve) => setTimeout(resolve, 2000));
		setDoubleClickLikeId(null);
		setBusy(null);
		setSwipeDirection(1);
		advanceToNext();
	};

	const handleSwipeEnd = (endX: number) => {
		if (swipeStartX.current === null || !reports.length) return;
		const distance = endX - swipeStartX.current;
		swipeStartX.current = null;
		if (Math.abs(distance) < 60) return;
		if (distance < 0) {
			setSwipeDirection(1);
			advanceToNext();
		} else {
			setSwipeDirection(-1);
			advanceToPrevious();
		}
	};

	const handleImageTouchEnd = (event: React.TouchEvent, report: CommunityReport) => {
		if (swipeStartX.current === null || Math.abs(event.changedTouches[0].clientX - swipeStartX.current) >= 30) return;
		const now = Date.now();
		if (now - lastImageTapAt.current < 350) {
			event.preventDefault();
			lastImageTapAt.current = 0;
			void likeOnDoubleClick(report);
		} else {
			lastImageTapAt.current = now;
		}
	};

	const addComment = async (reportId: string) => {
		const body = commentDrafts[reportId]?.trim();
		if (!body || busy) return;
		setBusy(reportId);
		try {
			const response = await fetch("/api/sel/community", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "comment", report_id: reportId, body }),
			});
			if (response.ok) {
				const { comment } = await response.json();
				setReports((current) => current.map((report) => report.id === reportId
					? { ...report, comments: [...report.comments, comment] }
					: report));
				setCommentDrafts((current) => ({ ...current, [reportId]: "" }));
			}
		} finally {
			setBusy(null);
		}
	};

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="relative flex h-screen max-h-screen flex-col overflow-hidden bg-transparent">
				<GradientPurpleBackground />
				<header className="relative z-10 flex h-16 shrink-0 items-center gap-2 border-b-2 border-black bg-white px-4 dark:bg-background">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/home">TalenzoX</BreadcrumbLink></BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem><BreadcrumbLink href="/sel/practice">Practice</BreadcrumbLink></BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem><BreadcrumbPage>Student Feed</BreadcrumbPage></BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>

				<main className="relative z-10 flex min-h-0 flex-1 flex-col gap-5 overflow-hidden p-4 pb-[10px] sm:p-6 sm:pb-[10px]">
					<div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3">
						{loading ? (
							<div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground">Loading student posts...</div>
						) : reports.length === 0 ? (
							<div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed bg-card p-10 text-center"><div><div className="text-4xl">🌤️</div><p className="mt-3 font-semibold">The feed is ready for its first forecast.</p><p className="mt-1 text-sm text-muted-foreground">Post your feeling weather report and it will appear here.</p></div></div>
						) : (() => {
							const report = reports[activeIndex];
							return <>
								<div className="flex min-h-0 flex-1 items-center justify-center gap-3">
									<div className="hidden shrink-0 sm:block">
										<Button variant="outline" size="icon" aria-label="Previous post" className="rounded-full" onClick={() => { setSwipeDirection(-1); advanceToPrevious(); }}>
											<ChevronLeft className="h-5 w-5" />
										</Button>
									</div>
									<AnimatePresence mode="wait" initial={false} custom={swipeDirection}>
										<motion.article
											key={report.id}
											initial={{ opacity: 0, x: swipeDirection * 80, scale: 0.98 }}
											animate={{ opacity: 1, x: 0, scale: 1 }}
											exit={{ opacity: 0, x: swipeDirection * -80, scale: 0.98 }}
											transition={{ duration: 0.3, ease: "easeOut" }}
											onTouchStart={(event) => { swipeStartX.current = event.changedTouches[0].clientX; }}
											onTouchEnd={(event) => handleSwipeEnd(event.changedTouches[0].clientX)}
											onPointerDown={(event) => { if (event.pointerType !== "touch") swipeStartX.current = event.clientX; }}
											onPointerUp={(event) => { if (event.pointerType !== "touch") handleSwipeEnd(event.clientX); }}
											className="mx-auto h-full min-h-0 w-full max-w-[380px] flex-none overflow-y-auto rounded-2xl border-0 bg-card shadow-none overscroll-contain touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
										>
											<div className="flex items-center justify-between gap-3 border-b px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-2xl">{report.emoji}</span><div><p className="text-sm font-bold">{report.author_name || "Student"}</p><p className="text-xs text-muted-foreground">{relativeTime(report.created_at)} · {report.weather_label} · {report.emotion}</p></div></div><div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-3.5 w-3.5 ${star <= report.intensity ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}</div></div>
											{report.image_url && <div className="relative"><img src={report.image_url} alt="Student feeling weather attachment" onDoubleClick={() => void likeOnDoubleClick(report)} onTouchEnd={(event) => handleImageTouchEnd(event, report)} className="max-h-[28rem] w-full cursor-pointer select-none object-cover" />{doubleClickLikeId === report.id && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 1.15] }} transition={{ duration: 1.1 }} className="pointer-events-none absolute inset-0 flex items-center justify-center"><Heart className="h-24 w-24 fill-red-500 text-red-500 drop-shadow-lg" /></motion.div>}</div>}
											<div className="space-y-4 p-5">
												{report.note && <p className="text-[15px] leading-relaxed">{report.note}</p>}
												<div className="flex items-center gap-5"><button type="button" onClick={() => void toggleLike(report.id)} disabled={busy === report.id} className={`flex items-center gap-2 text-sm font-semibold transition-colors ${report.likes.likedByMe ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"}`}><Heart className={`h-5 w-5 ${report.likes.likedByMe ? "fill-current" : ""}`} />{report.likes.count} {report.likes.count === 1 ? "like" : "likes"}</button><button type="button" onClick={() => setOpenCommentsId((current) => current === report.id ? null : report.id)} className={`flex items-center gap-2 text-sm font-semibold ${openCommentsId === report.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`} aria-expanded={openCommentsId === report.id}><MessageCircle className="h-5 w-5" />{report.comments.length} {report.comments.length === 1 ? "comment" : "comments"}</button></div>
												{openCommentsId === report.id && <div className="space-y-2 border-t pt-3"><div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><MessageCircle className="h-4 w-4" />Encouragement</div>{report.comments.map((comment) => <p key={comment.id} className="rounded-lg bg-muted/50 px-3 py-2 text-sm"><span className="font-semibold">{comment.author_name}: </span>{comment.body}</p>)}<div className="flex gap-2"><input value={commentDrafts[report.id] || ""} onChange={(event) => setCommentDrafts((current) => ({ ...current, [report.id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") void addComment(report.id); }} maxLength={500} placeholder="Leave encouragement..." className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50" /><Button size="icon" aria-label="Send comment" onClick={() => void addComment(report.id)} disabled={busy === report.id || !commentDrafts[report.id]?.trim()}><Send className="h-4 w-4" /></Button></div></div>}
											</div>
										</motion.article>
									</AnimatePresence>
									<div className="hidden shrink-0 sm:block">
										<Button variant="outline" size="icon" aria-label="Next post" className="rounded-full" onClick={() => { setSwipeDirection(1); advanceToNext(); }}>
											<ChevronRight className="h-5 w-5" />
										</Button>
									</div>
								</div>
							</>;
						})()}
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
