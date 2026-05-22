import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type NodeType = "folder" | "file";

type TreeNode = {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
};

const THEME_ROOT = "wp-content/themes/";

const TREE: TreeNode[] = [
  { id: "twentytwentyfour", name: "twentytwentyfour", type: "folder" },
  {
    id: "storefront-child",
    name: "storefront-child",
    type: "folder",
    children: [
      { id: "style.css", name: "style.css", type: "file" },
      { id: "functions.php", name: "functions.php", type: "file" },
      { id: "screenshot.png", name: "screenshot.png", type: "file" },
    ],
  },
];

const AUTO_DEMO_STEPS: { expand?: string; select: string }[] = [
  { select: "twentytwentyfour" },
  { expand: "storefront-child", select: "storefront-child" },
  { select: "style.css" },
  { select: "functions.php" },
  { select: "screenshot.png" },
  { select: "storefront-child" },
];

const DEMO_STEP_MS = 1400;

function FolderGlyph() {
  return (
    <svg
      className="size-3 shrink-0"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 3.5h3.5L5.5 2h5v7.5H1V3.5z"
        stroke="#64748B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 5.5h10" stroke="#64748B" strokeLinecap="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <span
      className="size-2 shrink-0 rounded-[4px] bg-[#fbbf24]"
      aria-hidden
    />
  );
}

function FileIcon() {
  return (
    <span
      className="size-2 shrink-0 rounded-[4px] bg-[#cbd5e1]"
      aria-hidden
    />
  );
}

function SyncCheck() {
  return (
    <svg className="size-2.5 shrink-0" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M8.5 2.5L4 7 1.5 4.5"
        stroke="#10B981"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.833"
      />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`size-2.5 shrink-0 text-[#94a3b8] transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 2l4 3-4 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type HeroThemeExplorerProps = {
  className?: string;
};

export default function HeroThemeExplorer({
  className = "",
}: HeroThemeExplorerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(["storefront-child"]),
  );
  const [selectedId, setSelectedId] = useState("style.css");
  const userInteractedRef = useRef(false);
  const demoIndexRef = useRef(0);

  const toggleFolder = useCallback((id: string) => {
    userInteractedRef.current = true;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelectedId(id);
  }, []);

  const selectNode = useCallback((id: string) => {
    userInteractedRef.current = true;
    setSelectedId(id);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setExpanded(new Set(["storefront-child"]));
      setSelectedId("style.css");
      return;
    }

    let cancelled = false;
    let timeoutId = 0;

    const tick = () => {
      if (cancelled || userInteractedRef.current) return;

      const step = AUTO_DEMO_STEPS[demoIndexRef.current % AUTO_DEMO_STEPS.length];
      demoIndexRef.current += 1;

      if (step.expand) {
        setExpanded((prev) => new Set(prev).add(step.expand!));
      }
      setSelectedId(step.select);

      timeoutId = window.setTimeout(tick, DEMO_STEP_MS);
    };

    timeoutId = window.setTimeout(tick, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion]);

  const renderFolder = (node: TreeNode, depth = 0) => {
    const isOpen = expanded.has(node.id);
    const isSelected = selectedId === node.id;
    const hasChildren = (node.children?.length ?? 0) > 0;

    return (
      <div key={node.id} className="flex w-full flex-col gap-1">
        <button
          type="button"
          onClick={() => {
            if (hasChildren) toggleFolder(node.id);
            else selectNode(node.id);
          }}
          className={`flex h-5 w-full items-center gap-1.5 rounded-[4px] py-0.5 pr-1.5 text-left transition-colors duration-150 ${
            isSelected ? "bg-[#eff6ff]" : "hover:bg-[#f8fafc]"
          }`}
          style={{ paddingLeft: 6 + depth * 10 }}
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-selected={isSelected}
        >
          {hasChildren ? <Chevron open={isOpen} /> : <span className="w-2.5 shrink-0" />}
          <FolderIcon />
          <span className="font-mock text-[12px] font-medium leading-4 text-[#334155]">
            {node.name}
          </span>
        </button>

        {hasChildren && isOpen && (
          <div className="flex flex-col gap-1">
            {node.children!.map((child) => renderFile(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderFile = (node: TreeNode, depth: number) => {
    const isSelected = selectedId === node.id;

    return (
      <button
        key={node.id}
        type="button"
        onClick={() => selectNode(node.id)}
        className={`flex h-5 w-full items-center justify-between rounded-[4px] py-0.5 pr-1.5 transition-colors duration-150 ${
          isSelected ? "bg-[#eff6ff]" : "hover:bg-[#f8fafc]"
        }`}
        style={{ paddingLeft: 6 + depth * 10 }}
        aria-selected={isSelected}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="w-2.5 shrink-0" />
          <FileIcon />
          <span className="truncate font-mock text-[12px] leading-4 text-[#334155]">
            {node.name}
          </span>
        </span>
        <SyncCheck />
      </button>
    );
  };

  return (
    <div
      className={`absolute flex flex-col overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white ${className}`}
      data-name="Theme Explorer"
      role="tree"
      aria-label="WordPress theme files"
    >
      <div className="flex h-4 shrink-0 items-center gap-1.5 px-3 pt-3">
        <FolderGlyph />
        <p className="font-mock text-[12px] leading-4 text-[#64748b]">
          {THEME_ROOT}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2 pt-2 [scrollbar-width:thin]">
        <div className="flex flex-col gap-1">
          {TREE.map((node) => renderFolder(node))}
        </div>
      </div>

      <div className="mx-3 mb-3 shrink-0 rounded-[6px] border border-[#e5e7eb] bg-[#ecfdf5] px-[9px] py-[9px]">
        <div className="flex items-center gap-1">
          <svg className="size-3 shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M11 6H9.76C9.54148 5.99953 9.32883 6.07065 9.15456 6.20248C8.98029 6.33431 8.854 6.5196 8.795 6.73L7.62 10.91C7.61243 10.936 7.59664 10.9588 7.575 10.975C7.55336 10.9912 7.52705 11 7.5 11C7.47295 11 7.44664 10.9912 7.425 10.975C7.40336 10.9588 7.38757 10.936 7.38 10.91L4.62 1.09C4.61243 1.06404 4.59664 1.04123 4.575 1.025C4.55336 1.00877 4.52705 1 4.5 1C4.47295 1 4.44664 1.00877 4.425 1.025C4.40336 1.04123 4.38757 1.06404 4.38 1.09L3.205 5.27C3.14623 5.47958 3.02069 5.66426 2.84743 5.79601C2.67417 5.92776 2.46266 5.99938 2.245 6H1"
              stroke="#065F46"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-mock text-[11px] font-medium leading-4 tracking-wide text-[#065f46]">
            Uptime
          </p>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="font-mock text-[11px] leading-4 tracking-wide text-[#065f46]">
            All sites up · last 24h
          </p>
          <p className="font-terminal text-[11px] leading-4 text-[#065f46]">
            99.98%
          </p>
        </div>
      </div>
    </div>
  );
}
