import { getBasePath } from '@/lib/utils/path';

export interface Collaborator {
  org: string;
  logo?: string;
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
      org: 'The Chinese University of Hong Kong, Shenzhen',
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
        <span className="text-sm font-medium text-muted-foreground">
          {collaborator.org}
        </span>
      </div>
    </div>
  );
}
