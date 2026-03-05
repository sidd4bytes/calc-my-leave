import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ArrowRight } from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

interface AttendanceData {
  [subjectId: string]: { total: number; attended: number };
}

interface AttendanceInputProps {
  subjects: Subject[];
  onNext: (data: AttendanceData) => void;
  onBack?: () => void;
  initialData?: AttendanceData;
}

const AttendanceInput = ({ subjects, onNext, onBack, initialData }: AttendanceInputProps) => {
  const [data, setData] = useState<AttendanceData>(
    initialData || Object.fromEntries(subjects.map((s) => [s.id, { total: 0, attended: 0 }]))
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateField = (id: string, field: "total" | "attended", value: string) => {
    const num = value === "" ? 0 : parseInt(value);
    if (isNaN(num) || num < 0) return;
    setData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: num },
    }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    for (const sub of subjects) {
      const d = data[sub.id];
      if (!d || d.total === 0) {
        newErrors[sub.id] = "Total classes must be greater than 0";
      } else if (d.attended > d.total) {
        newErrors[sub.id] = "Attended cannot exceed total classes";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-2">Enter Attendance</h2>
        <p className="text-muted-foreground">Provide current attendance data for each subject</p>
      </div>

      <div className="space-y-4">
        {subjects.map((sub) => {
          const d = data[sub.id] || { total: 0, attended: 0 };
          const pct = d.total > 0 ? ((d.attended / d.total) * 100).toFixed(1) : "—";

          return (
            <div key={sub.id} className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground">{sub.id}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-heading font-bold ${
                    pct !== "—" && parseFloat(pct) < 75 ? "text-destructive" : "text-success"
                  }`}>
                    {pct}{pct !== "—" ? "%" : ""}
                  </span>
                  <p className="text-xs text-muted-foreground">current</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Total Classes</label>
                  <input
                    type="number"
                    min={0}
                    value={d.total || ""}
                    onChange={(e) => updateField(sub.id, "total", e.target.value)}
                    placeholder="0"
                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Classes Attended</label>
                  <input
                    type="number"
                    min={0}
                    value={d.attended || ""}
                    onChange={(e) => updateField(sub.id, "attended", e.target.value)}
                    placeholder="0"
                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              {errors[sub.id] && <p className="text-destructive text-xs mt-2">{errors[sub.id]}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 bg-secondary text-foreground font-semibold py-3 px-6 rounded-md hover:bg-muted transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition-opacity"
        >
          Calculate Impact <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default AttendanceInput;
