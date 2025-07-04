export default function PartnersCard() {
  return (
    <section className="my-8">
      <div className="flex w-full flex-wrap items-center justify-evenly gap-8 py-4 md:gap-12">
        <div className="flex h-16 w-24 items-center justify-center transition-transform hover:scale-105">
          <img
            src="/logos/Huawei-logo.svg"
            alt="Huawei"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>
        <span className="hidden h-16 w-[2px] bg-border sm:inline" />
        <div className="flex h-16 w-24 items-center justify-center transition-transform hover:scale-105">
          <img
            src="/logos/KCL-logo.svg"
            alt="Huawei"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>
        <span className="hidden h-16 w-[2px] bg-border sm:inline" />
        <div className="flex h-16 w-24 items-center justify-center transition-transform hover:scale-105">
          <img
            src="/logos/CUHK-logo.svg"
            alt="Huawei"
            className="max-h-full max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </div>
      </div>
    </section>
  );
}
