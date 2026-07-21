import React from "react";
import { Globe, BookOpen } from "@phosphor-icons/react";
import type { ChatCitation } from "../../api/chat";

interface ChatSourceCardsProps {
  citations: ChatCitation[];
}

export const ChatSourceCards: React.FC<ChatSourceCardsProps> = ({
  citations,
}) => {
  if (!citations || citations.length === 0) return null;

  // Group citations by source_id to avoid duplicating cards for the same source
  const uniqueCitations = Array.from(
    new Map(citations.map((c) => [c.source_id, c])).values()
  );

  return (
    <div className="flex flex-col gap-2 mb-4 w-full">
      <span className="text-xs font-bold text-text-main/60 pl-1">
        Nguồn tham khảo
      </span>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {uniqueCitations.map((citation) => {
          const isKnowledge = citation.source_type === "knowledge_source";
          const Icon = isKnowledge ? Globe : BookOpen;
          // Determine the citation number (1-based index based on original array)
          const citationNumber =
            citations.findIndex((c) => c.source_id === citation.source_id) + 1;

          return (
            <a
              key={citation.source_id}
              href={citation.url || "#"}
              target={citation.url ? "_blank" : "_self"}
              rel="noreferrer"
              className="snap-start shrink-0 w-[200px] bg-white border border-border-main/60 rounded-xl p-3 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
              onClick={(e) => {
                if (!citation.url) {
                  e.preventDefault();
                }
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-bg-surface-1 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-text-main/70" weight="duotone" />
                </div>
                <span className="text-[10px] font-bold text-text-main/60 truncate">
                  {isKnowledge
                    ? citation.url
                      ? new URL(citation.url).hostname.replace("www.", "")
                      : "Trang web"
                    : "Nhật ký của bạn"}
                </span>
              </div>
              <p className="text-sm font-bold text-text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {citation.title || "Nguồn dữ liệu"}
              </p>
              
              <div className="absolute top-2 right-2 w-5 h-5 bg-bg-surface-1 rounded-full flex items-center justify-center border border-border-main/50 shadow-sm">
                <span className="text-[10px] font-bold text-text-main">
                  {citationNumber}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
