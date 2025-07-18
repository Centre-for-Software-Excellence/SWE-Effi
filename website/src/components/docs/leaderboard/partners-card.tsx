import { getBasePath } from '@/lib/utils/path';

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
