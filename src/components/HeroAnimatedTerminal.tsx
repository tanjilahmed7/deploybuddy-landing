import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type OutputTone = "muted" | "success";

type HistoryLine =
  | { kind: "banner"; text: string }
  | { kind: "prompt"; command: string }
  | { kind: "output"; text: string; tone?: OutputTone };

const PROMPT = "$";
const HOST = "root@prod-1";

const CHAR_MS = 34;
const LINE_MS = 110;
const PAUSE_AFTER_COMMAND_MS = 380;
const PAUSE_BEFORE_LOOP_MS = 2600;

const SCRIPT: {
  command: string;
  outputs: { text: string; tone?: OutputTone }[];
}[] = [
  {
    command: "wp plugin list --status=active",
    outputs: [
      { text: "+ wordpress-seo 21.6" },
      { text: "+ woocommerce 9.4.2" },
      { text: "+ redis-cache 2.5.4" },
    ],
  },
  {
    command: "docker compose ps",
    outputs: [
      { text: "wp_acme    Up 3 hours" },
      { text: "nginx_acme Up 3 hours" },
      { text: "db_acme    Up 3 hours (healthy)", tone: "success" },
    ],
  },
  {
    command: "deploy site acme",
    outputs: [
      { text: "→ Provisioning droplet (sfo3)…" },
      { text: "→ Pulling wordpress:6.4 + mariadb:11" },
      { text: "✓ Site live — https://acme.deploybuddy.app", tone: "success" },
    ],
  },
];

const STATIC_LINES: HistoryLine[] = [
  { kind: "banner", text: HOST },
  ...SCRIPT.flatMap((step) => [
    { kind: "prompt" as const, command: step.command },
    ...step.outputs.map(
      (o) =>
        ({
          kind: "output" as const,
          text: o.text,
          tone: o.tone,
        }) satisfies HistoryLine,
    ),
  ]),
];

function toneClass(tone: OutputTone = "muted"): string {
  return tone === "success" ? "text-[#34d399]" : "text-[#94a3b8]";
}

function delay(ms: number, cancelled: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (!cancelled()) resolve();
    }, ms);
  });
}

type HeroAnimatedTerminalProps = {
  className?: string;
};

function Cursor({ active }: { active: boolean }) {
  return (
    <span
      className={`ml-px inline-block h-[12px] w-[6px] shrink-0 bg-[#34d399] opacity-90 ${
        active ? "animate-pulse" : "opacity-0"
      }`}
      aria-hidden
    />
  );
}

export default function HeroAnimatedTerminal({
  className = "",
}: HeroAnimatedTerminalProps) {
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<HistoryLine[]>([]);
  const [typedCommand, setTypedCommand] = useState<string | null>(null);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typedCommand]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setLines(STATIC_LINES);
      setTypedCommand(null);
      setShowCursor(false);
      return;
    }

    let cancelled = false;

    const typeCommand = async (command: string) => {
      setTypedCommand("");
      for (let i = 0; i < command.length; i++) {
        if (cancelled) return;
        setTypedCommand(command.slice(0, i + 1));
        await delay(CHAR_MS, () => cancelled);
      }
    };

    const runCycle = async () => {
      while (!cancelled) {
        setLines([{ kind: "banner", text: HOST }]);
        setTypedCommand(null);
        setShowCursor(true);
        await delay(500, () => cancelled);

        for (const step of SCRIPT) {
          if (cancelled) return;

          await typeCommand(step.command);
          if (cancelled) return;

          setLines((prev) => [
            ...prev,
            { kind: "prompt", command: step.command },
          ]);
          setTypedCommand(null);
          await delay(PAUSE_AFTER_COMMAND_MS, () => cancelled);

          for (const output of step.outputs) {
            if (cancelled) return;
            setLines((prev) => [
              ...prev,
              {
                kind: "output",
                text: output.text,
                tone: output.tone,
              },
            ]);
            await delay(LINE_MS, () => cancelled);
          }

          await delay(280, () => cancelled);
        }

        setTypedCommand(null);
        await delay(PAUSE_BEFORE_LOOP_MS, () => cancelled);

        if (cancelled) return;
        setLines([]);
      }
    };

    runCycle();

    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className={`pointer-events-none absolute flex flex-col overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-[#020617] ${className}`}
      data-name="Animated Terminal"
      role="img"
      aria-label="Animated DeployBuddy terminal showing plugin list, Docker status, and site deploy"
    >
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 [scrollbar-width:thin]"
      >
        <div className="flex flex-col gap-[2px]">
          {lines.map((line, i) => {
            if (line.kind === "banner") {
              return (
                <p
                  key={`${i}-b`}
                  className="font-terminal text-[11px] leading-[17.875px] text-[#94a3b8]"
                >
                  {line.text}
                </p>
              );
            }
            if (line.kind === "prompt") {
              return (
                <p
                  key={`${i}-p`}
                  className="font-terminal text-[11px] leading-[17.875px] whitespace-pre-wrap break-words"
                >
                  <span className="text-[#34d399]">{PROMPT}</span>
                  <span className="text-[#cbd5e1]"> {line.command}</span>
                </p>
              );
            }
            return (
              <p
                key={`${i}-o`}
                className={`font-terminal text-[11px] leading-[17.875px] whitespace-pre-wrap break-words ${toneClass(line.tone)}`}
              >
                {line.text}
              </p>
            );
          })}

          {typedCommand !== null && (
            <p className="font-terminal text-[11px] leading-[17.875px] whitespace-pre-wrap break-words">
              <span className="text-[#34d399]">{PROMPT}</span>
              <span className="text-[#cbd5e1]"> {typedCommand}</span>
              <Cursor active={showCursor} />
            </p>
          )}

          {typedCommand === null && showCursor && !prefersReducedMotion && (
            <p className="font-terminal text-[11px] leading-[17.875px]">
              <span className="text-[#34d399]">{PROMPT}</span>
              <span className="text-[#cbd5e1]"> </span>
              <Cursor active />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
