// components/public/pendaftaran/StepperIndicator.tsx

"use client";

interface Step {
  label: string;
}

const STEPS: Step[] = [
  { label: "Tipe" },
  { label: "Kategori" },
  { label: "Data Diri" },
  { label: "Donasi" },
  { label: "Ringkasan" },
  { label: "Bayar" },
  { label: "Selesai" },
];

interface StepperIndicatorProps {
  currentStep: number; // 1–7
  totalSteps?: number; // default 7
}

export default function StepperIndicator({
  currentStep,
  totalSteps = 7,
}: StepperIndicatorProps) {
  const steps = STEPS.slice(0, totalSteps);

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex items-center min-w-max mx-auto px-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step item */}
              <div className="flex flex-col items-center gap-1.5">
                {/* Circle */}
                <div
                  className={[
                    "flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300 flex-shrink-0",
                    isDone
                      ? "w-8 h-8 bg-[#007A3D] text-white border-2 border-[#007A3D]"
                      : isActive
                        ? "w-9 h-9 bg-[#1A54C8] text-white border-2 border-[#1A54C8] ring-4 ring-[#1A54C8]/20 animate-pulse"
                        : "w-8 h-8 bg-[#E4E9F5] text-[#6B7A99] border-2 border-transparent",
                  ].join(" ")}
                >
                  {isDone ? (
                    /* Centang SVG */
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>

                {/* Label — tersembunyi di mobile kecuali step aktif */}
                <span
                  className={[
                    "text-[11px] font-bold whitespace-nowrap transition-colors duration-300",
                    isDone
                      ? "text-[#007A3D] hidden sm:block"
                      : isActive
                        ? "text-[#1A54C8]"
                        : "text-[#6B7A99] hidden sm:block",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {/* Garis penghubung — tidak ditampilkan setelah step terakhir */}
              {index < steps.length - 1 && (
                <div
                  className={[
                    "h-0.5 w-8 sm:w-12 mx-1 flex-shrink-0 transition-colors duration-300",
                    isDone ? "bg-[#1A54C8]" : "bg-[#E4E9F5]",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}