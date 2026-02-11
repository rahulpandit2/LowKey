"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";

interface HelpPost {
  id: string;
  author: string;
  preview: string;
  responseCount: number;
  status: "active" | "resolved" | "escalated";
  timestamp: string;
  priority: "low" | "medium" | "high";
}

export default function HelpChannelOversight() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "resolved" | "escalated">("all");
  const [helpPosts] = useState<HelpPost[]>([
    {
      id: "help_1",
      author: "Anonymous",
      preview: "Struggling with work-life balance after promotion. Need advice on setting boundaries...",
      responseCount: 7,
      status: "active",
      timestamp: "1 hour ago",
      priority: "medium",
    },
    {
      id: "help_2",
      author: "Anonymous",
      preview: "Career transition anxiety - leaving stable job for startup opportunity...",
      responseCount: 12,
      status: "resolved",
      timestamp: "3 hours ago",
      priority: "low",
    },
    {
      id: "help_3",
      author: "Anonymous",
      preview: "Dealing with imposter syndrome in new leadership role. Feeling overwhelmed...",
      responseCount: 3,
      status: "escalated",
      timestamp: "5 hours ago",
      priority: "high",
    },
    {
      id: "help_4",
      author: "Anonymous",
      preview: "How to handle difficult conversation with team member about performance...",
      responseCount: 9,
      status: "active",
      timestamp: "8 hours ago",
      priority: "medium",
    },
  ]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const filteredPosts =
    filter === "all" ? helpPosts : helpPosts.filter((post) => post.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary";
      case "resolved":
        return "text-success";
      case "escalated":
        return "text-warning";
      default:
        return "text-zinc-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-zinc-500";
      default:
        return "text-zinc-500";
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto text-center text-zinc-500">Loading oversight...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-background border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Help Channel Oversight</h2>
          <p className="text-sm text-zinc-500">
            Monitor anonymous support posts and ensure quality responses
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/[0.05] pb-4">
          {["all", "active", "resolved", "escalated"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`text-xs uppercase tracking-widest px-4 py-2 rounded-sm transition-colors ${
                filter === status
                  ? "bg-primary/10 text-primary" :"text-zinc-500 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Help Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-6 border border-white/[0.05] rounded-sm bg-card hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon name="ShieldCheckIcon" size={20} className="text-zinc-600" />
                  <span className="text-sm text-zinc-400">{post.author}</span>
                  <span className="text-xs text-zinc-600">·</span>
                  <span className="text-xs text-zinc-600">{post.timestamp}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs uppercase tracking-widest ${getPriorityColor(
                      post.priority
                    )}`}
                  >
                    {post.priority} priority
                  </span>
                  <span
                    className={`px-2 py-1 text-xs uppercase tracking-widest rounded-sm ${
                      post.status === "active" ?"bg-primary/10 text-primary"
                        : post.status === "resolved" ?"bg-success/10 text-success" :"bg-warning/10 text-warning"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>

              <p className="text-white mb-4 leading-relaxed">{post.preview}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Icon name="ChatBubbleLeftRightIcon" size={16} className="text-zinc-600" />
                  <span className="text-sm text-zinc-500">{post.responseCount} responses</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-xs uppercase tracking-widest text-white hover:bg-white/5 transition-colors rounded-sm">
                    View Thread
                  </button>
                  {post.status === "active" && (
                    <button className="px-4 py-2 text-xs uppercase tracking-widest text-warning hover:bg-warning/10 transition-colors rounded-sm">
                      Escalate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}