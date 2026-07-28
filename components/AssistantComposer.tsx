"use client";

type AssistantComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isPending: boolean;
};

export default function AssistantComposer({
  value,
  onChange,
  onSubmit,
  isPending
}: AssistantComposerProps) {
  return (
    <form
      className="w-full max-w-2xl"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className="flex items-center gap-3 rounded-full border border-zinc-200/70 bg-white px-4 py-2.5 shadow-[0_10px_30px_-24px_rgba(15,17,21,0.12)]">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Message"
          disabled={isPending}
          className="min-w-0 flex-1 bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            <path d="M4 12h13.17l-4.59-4.59L14 6l7 7-7 7-1.41-1.41L17.17 13H4z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
