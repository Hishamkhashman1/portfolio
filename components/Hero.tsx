import Image from "next/image";
import { profile } from "@/data/profile";
import { getStackIcon } from "@/data/stackIcons";
import NowBuildingStatus from "@/components/NowBuildingStatus";

export default function Hero() {
  const marqueeItems = [...profile.stack, ...profile.stack];

  return (
    <section
      id="top"
      className="relative flex flex-col overflow-x-clip pt-16 pb-12 sm:pb-16"
    >
      <div className="mt-5 w-full max-w-xl mx-auto sm:max-w-none sm:mx-0">
        <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div className="order-2 min-w-0 max-w-3xl text-center lg:order-1 lg:text-left">
            {/* <p className="text-sm font-mono uppercase tracking-[0.4em] text-electric">
              Hi, I&apos;m Hisham
            </p> */}
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-6xl lg:text-[4.5rem]">
              {profile.name}
            </h1>
            {/* <p className="mt-3 text-sm text-zinc-400">{profile.greeting}</p> */}
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-zinc-950 sm:text-2xl">
              {profile.title}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              {profile.summary}
            </p>
            <div className="mt-6 min-w-0">
              <div className="tech-stack-marquee">
                <div className="tech-stack-marquee__viewport">
                  <div className="tech-stack-marquee__track">
                    {marqueeItems.map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-mono text-zinc-700 shadow-sm"
                        aria-hidden={index >= profile.stack.length}
                      >
                        {getStackIcon(item) ? (
                          <i
                            className={`${getStackIcon(item)} text-sm`}
                            aria-hidden
                          />
                        ) : null}
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
              <a
                href="#projects"
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto"
              >
                View Projects
              </a>
              <a
                href={profile.links.cv}
                download
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-500 hover:text-zinc-950 sm:w-auto"
              >
                Download CV
              </a>
            </div>
            <NowBuildingStatus />
          </div>

          <div className="relative order-1 flex min-w-0 justify-center lg:order-2 lg:justify-end">
            <div className="absolute -inset-8 rounded-full bg-zinc-200/70 blur-3xl" />
            <div className="relative rounded-full border border-zinc-200 bg-white p-2 shadow-glow">
              <Image
                src="/hisham-photo.png"
                alt="Portrait of Hisham Khashman"
                width={320}
                height={320}
                sizes="(max-width: 1024px) 240px, 320px"
                className="h-44 w-44 rounded-full object-cover sm:h-52 sm:w-52"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
