import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";

interface LeaveDateSectionProps {
  onNext: (data: { startDate: string; endDate: string; leaveDays: number }) => void;
  initial?: { startDate: string; endDate: string };
}

function countWorkdays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

const LeaveDateSection = ({ onNext, initial }: LeaveDateSectionProps) => {
  const [startDate, setStartDate] = useState(initial?.startDate || "");
  const [endDate, setEndDate] = useState(initial?.endDate || "");
  const [error, setError] = useState("");

  const leaveDays = startDate && endDate && !error ? countWorkdays(startDate, endDate) : 0;

  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date");
    } else {
      setError("");
    }
  }, [startDate, endDate]);

  const canProceed = startDate && endDate && !error && leaveDays > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-2">Select Leave Dates</h2>
        <p className="text-muted-foreground">Choose the start and end dates of your planned leave</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Leave Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Leave End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-input border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {canProceed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary/10 rounded-md p-4 text-center"
          >
            <span className="text-3xl font-heading font-bold text-primary">{leaveDays}</span>
            <p className="text-sm text-muted-foreground mt-1">working days of leave</p>
          </motion.div>
        )}

        <button
          disabled={!canProceed}
          onClick={() => onNext({ startDate, endDate, leaveDays })}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-md disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default LeaveDateSection;
