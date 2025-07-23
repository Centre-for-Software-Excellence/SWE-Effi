import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { getBasePath } from '@/lib/utils/path';

export interface Collaborator {
  org: string;
  logo?: string;
}

export default function PartnersCard() {
  return (
    <section className="my-8 lg:px-8">
      <div className="flex w-full flex-wrap items-center justify-evenly gap-8 py-4 md:gap-12">
        <div className="flex h-16 w-24 items-center justify-center transition-transform hover:scale-105">
          <img
            src={getBasePath('logos/Huawei-logo.svg')}
            alt="Huawei"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>

        <span className="hidden h-16 w-[2px] bg-gradient-to-t from-transparent via-border to-transparent sm:inline" />
        <div className="flex h-24 w-24 items-center justify-center transition-transform hover:scale-105">
          <img
            src={getBasePath('logos/Queens-logo.svg')}
            alt="Queens University"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>
        <span className="hidden h-16 w-[2px] bg-gradient-to-t from-transparent via-border to-transparent sm:inline" />
        <div className="flex h-16 w-24 items-center justify-center transition-transform hover:scale-105">
          <img
            src={getBasePath('logos/KCL-logo.svg')}
            alt="KCL"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>
        <span className="hidden h-16 w-[2px] bg-gradient-to-t from-transparent via-border to-transparent sm:inline" />
        <div className="flex h-16 w-24 items-center justify-center transition-transform hover:scale-105">
          <img
            src={getBasePath('logos/CUHK-logo.svg')}
            alt="CUHK"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>
      </div>
    </section>
  );
}

export function CollaboratorsSection({
  collaborators = [
    {
      org: 'Huawei',
      logo: 'logos/Huawei-logo.svg',
    },
    {
      org: "Queen's University",
      logo: 'logos/Queens-logo.svg',
    },
    {
      org: "King's College London",
      logo: 'logos/KCL-logo.svg',
    },
    {
      org: 'The Chinese University of Hong Kong',
      logo: 'logos/CUHK-logo.svg',
    },
  ],
  collaboratorsTitle,
}: {
  collaborators?: any[];
  collaboratorsTitle: string;
}) {
  const items = collaborators;

  return (
    <section className="w-full py-20">
      <div className="mx-auto mb-12 max-w-6xl">
        <h6 className="relateive w-full rounded-lg pt-4 text-xl font-bold md:p-4 md:text-2xl">
          <span className="text-zinc-400 dark:text-active">Our </span>
          {collaboratorsTitle}
        </h6>
      </div>

      <div className="relative">
        <div
          className="scrollbar-hide overflow-x-hidden overflow-y-hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex w-full flex-wrap justify-between py-8">
            {items.map((collaborator, index) => (
              <CollaboratorCard
                key={`collaborator-${index}`}
                collaborator={collaborator}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CollaboratorCard({
  collaborator,
}: {
  collaborator: Collaborator;
}) {
  return (
    <div className="group flex h-full min-h-[160px] w-40 cursor-default flex-col items-center justify-between p-4 transition-all duration-300 hover:translate-y-[-2px] hover:scale-110">
      <div className="duraiton-300 mb-4 flex h-20 w-full items-center justify-center rounded bg-background p-3 transition-all dark:bg-gray-50">
        <img
          className="max-h-full max-w-full object-contain filter transition-all duration-300"
          src={getBasePath(collaborator.logo || '')}
          alt={`${collaborator.org} logo`}
        />
      </div>

      <div className="w-full text-center">
        <span>
          <span
            className={cn(
              `bg-gradient-to-r from-transparent via-foreground to-transparent bg-no-repeat pb-0.5 transition-[background-size,color] duration-500 group-hover:text-foreground`,
              'bg-[length:0%_1px] group-hover:bg-[length:100%_1px]',
              'bg-right-bottom group-hover:bg-left-bottom',
              'from-transparent via-foreground to-transparent',
            )}
          >
            <span className="text-sm font-medium text-muted-foreground">
              {collaborator.org}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
