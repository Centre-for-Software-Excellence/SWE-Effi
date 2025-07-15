import { JSX, useEffect, useRef, useState } from 'react';

import { useMousePosition } from '@/hooks/use-mouse-position';
import { Github, Mail } from './icons';

const contacts = [
  {
    icon: Github,
    title: 'Github',
    link: 'https://github.com/Center-for-Software-Excellence/SWE-Lens',
    description: 'Follow us on GitHub for updates and contributions.',
  },
  {
    icon: Mail,
    title: 'Email',
    link: 'mailto:xxx@mail.com',
    description: 'Contact us via email for inquiries.',
  },
];

interface ContactCardProps {
  icon: (props: any) => JSX.Element;
  title: string;
  link: string;
  description?: string;
}

function ContactCard({
  icon,
  link = '#',
  title = 'Contact title',
  description = 'Contact description',
}: ContactCardProps) {
  const Icon = icon;
  const { mouseX, mouseY } = useMousePosition();
  const cardRef = useRef<HTMLDivElement>(null);
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateRelativePosition = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setRelativePosition({
          x: mouseX - rect.left,
          y: mouseY - rect.top,
        });
      }
    };

    updateRelativePosition();
  }, [mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-lg bg-accent ring-1 ring-foreground/40 transition-all duration-300 hover:ring-foreground dark:hover:ring-active"
    >
      <div
        className="absolute inset-0 z-10 bg-radial from-foreground/30 to-transparent opacity-0 transition-all duration-1000 group-hover:opacity-50 dark:from-active/50"
        style={{
          maskImage: `radial-gradient(240px at ${relativePosition.x}px ${relativePosition.y}px, white, transparent)`,
        }}
        aria-hidden
      />
      <a
        href={link}
        className="pointer-default relative z-10 flex flex-col items-center rounded-lg px-4 py-4 no-underline"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background ring-1 ring-muted-foreground/50 backdrop-blur-[2px] transition duration-300 group-hover:ring-foreground/70 dark:group-hover:ring-active/70">
          <Icon className="h-5 w-5 fill-foreground/50 transition-colors duration-300 group-hover:fill-foreground/70 dark:group-hover:fill-active/70" />
        </div>
        <span
          className="my-2 mt-4 h-px w-[90%] bg-gradient-to-r from-transparent via-muted-foreground/50 to-transparent group-hover:via-foreground dark:group-hover:via-active"
          aria-hidden
        />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </a>
    </div>
  );
}

export function ContactCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {contacts.map((contact, index) => (
        <ContactCard
          key={index}
          icon={contact.icon}
          title={contact.title}
          link={contact.link}
          description={contact.description}
        />
      ))}
    </div>
  );
}
