import { motion } from "framer-motion";
import { BarChart3, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

interface AttendanceData {
  [subjectId: string]: { total: number; attended: number };
}

interface ResultsSectionProps {
  subjects: Subject[];
  attendanceData: AttendanceData;
  leaveDays: number;
  onRecalculate: () => void;
  onBack?: () => void;
}

const ResultsSection = ({ subjects, attendanceData, leaveDays, onRecalculate, onBack }: ResultsSectionProps) => {
  const results = subjects.map((sub) => {
    const d = attendanceData[sub.id];
    const currentPct = (d.attended / d.total) * 100;
    const projectedTotal = d.total + leaveDays;
    const projectedPct = (d.attended / projectedTotal) * 100;
    const drop = currentPct - projectedPct;
    return { ...sub, currentPct, projectedPct, drop, projectedTotal };
  });

  const belowThreshold = results.filter((r) => r.projectedPct < 75);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-2">Impact Results</h2>
        <p className="text-muted-foreground">Here's how {leaveDays} working days of leave affect your attendance</p>
      </div>

      {/* Summary Banner */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`rounded-lg p-4 mb-6 flex items-center gap-3 ${
          belowThreshold.length > 0
            ? "bg-destructive/10 border border-destructive/30"
            : "bg-success/10 border border-success/30"
        }`}
      >
        {belowThreshold.length > 0 ? (
          <>
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
            <p className="text-sm font-medium">
              ⚠️ <span className="text-destructive font-bold">{belowThreshold.length}</span> subject{belowThreshold.length > 1 ? "s" : ""} will fall below 75%
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
            <p className="text-sm font-medium">✅ All subjects remain above 75%</p>
          </>
        )}
      </motion.div>

      <div className="space-y-4">
        {results.map((r, i) => {
          const dropColor = r.drop > 5 ? "text-destructive" : r.drop > 2 ? "text-warning" : "text-success";
          const barColor = r.projectedPct < 75 ? "bg-destructive" : "bg-success";

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-lg border border-border p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-heading font-semibold">{r.name}</h3>
                  <p className="text-xs text-muted-foreground">{r.id}</p>
                </div>
                <span className={`text-sm font-semibold ${dropColor}`}>
                  ↓ {r.drop.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Current</p>
                  <p className="font-heading font-bold text-lg">{r.currentPct.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Projected</p>
                  <p className={`font-heading font-bold text-lg ${r.projectedPct < 75 ? "text-destructive" : ""}`}>
                    {r.projectedPct.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Current</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(r.currentPct, 100)}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>After&nbsp;&nbsp;</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(r.projectedPct, 100)}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground font-semibold py-3 rounded-md hover:bg-muted transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back
          </button>
        )}
        <button
          onClick={onRecalculate}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground font-semibold py-3 rounded-md hover:bg-muted transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Recalculate
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsSection;
