export function Hero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="h-36 sm:h-48 bg-gradient-to-r from-[#003366] to-sky-600" />
      <div className="absolute inset-0 flex items-center">
        <div className="px-4 sm:px-6 w-full flex items-center gap-3">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/90 flex items-center justify-center shadow text-[#003366]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path d="M12 2a7 7 0 00-7 7v3.586l-.707.707A1 1 0 005 15h14a1 1 0 00.707-1.707L19 12.586V9a7 7 0 00-7-7z" />
              <path d="M6 16a6 6 0 0012 0H6z" />
            </svg>
          </div>
          <div className="text-white">
            <h1 className="text-lg sm:text-2xl font-semibold leading-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-white/90 text-sm mt-0.5">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
