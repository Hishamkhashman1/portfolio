import { profile } from "@/data/profile";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { Mail } from "lucide-react";

export default function ContactSection() {
  const contactMethods = [
    {
      label: "Email",
      href: `mailto:${profile.email}`,
      icon: Mail,
      external: false
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/525551065958",
      icon: FaWhatsapp,
      external: true
    },
    {
      label: "GitHub",
      href: profile.links.github,
      icon: FaGithub,
      external: true
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hishamkhashman/",
      icon: FaLinkedinIn,
      external: true
    }
  ];

  return (
    <section
      id="contact"
      className="mt-10 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-950 sm:text-4xl">
            Let&apos;s Connect.
          </h2>
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-2xl lg:flex-1 lg:justify-self-end">
          {contactMethods.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="group flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 text-left transition duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
              aria-label={label}
            >
              <Icon className="h-4 w-4 shrink-0 text-zinc-700 transition-opacity duration-200 group-hover:opacity-70" />
              <span className="text-sm font-medium text-zinc-800 transition-colors duration-200 group-hover:text-zinc-950">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
