import { ChevronRight } from "lucide-react";

export default function MapWidget() {
  return (
    <div className="bg-white rounded-4xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-cardText text-sm">Inference Regions</h3>
        <button className="text-xs text-muted flex items-center gap-0.5">
          View <ChevronRight size={12} />
        </button>
      </div>
      <div className="relative w-full h-32 rounded-3xl bg-background overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-70">
          <path d="M10 60 Q40 20 70 50 T130 40 T190 55" stroke="#5E4B8B" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>
        <span className="absolute top-4 left-6 w-2.5 h-2.5 rounded-full bg-accentPink ring-4 ring-accentPink/20" />
        <span className="absolute bottom-6 right-10 w-2.5 h-2.5 rounded-full bg-sidebar ring-4 ring-sidebar/20" />
        <div className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-[10px] font-semibold text-sidebar">
          US
        </div>
      </div>
      <p className="text-xs text-muted mt-3">us-east-1, eu-west-2, ap-south-1</p>
    </div>
  );
}