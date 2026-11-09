import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export default function MedicalDisclaimer({
  compact = false,
  className,
}: MedicalDisclaimerProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs",
          className
        )}
      >
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Clinical Disclaimer:</strong> DengueGuard provides automated triage guidance and health surveillance for educational support only. It does not replace certified clinical diagnosis or medical prescriptions. If you experience persistent vomiting, severe abdominal pain, or mucosal bleeding, visit an emergency medical department immediately.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-white p-5 shadow-xs",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
            Official Healthcare & Clinical Advisory
          </h4>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            DengueGuard is an assistive medical informatics tool developed for epidemiological awareness, clinical risk assessment, and hospital coordination. It does <strong className="underline">not</strong> formulate medical prescriptions or definitive clinical diagnoses. Individuals presenting warning symptoms (fever &gt; 103°F, severe retro-orbital pain, spontaneous bleeding, or platelet depletion) must seek immediate laboratory CBC verification and hospital evaluation.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-amber-800">
            <span>• Verified Guidelines: WHO / DGHS Bangladesh</span>
            <span>• Emergency National Care: 999 or 16263</span>
          </div>
        </div>
      </div>
    </div>
  );
}

