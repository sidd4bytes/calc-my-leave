import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, RefreshCw } from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

interface SubjectSelectionProps {
  onNext: (subjects: Subject[]) => void;
  onBack?: () => void;
  initialSelected?: Subject[];
}

const MOCK_SUBJECTS: Subject[] = [
  { id: "CS101", name: "Data Structures" },
  { id: "MA102", name: "Engineering Mathematics" },
  { id: "PH103", name: "Applied Physics" },
  { id: "CS104", name: "Database Management" },
  { id: "EC105", name: "Digital Electronics" },
  { id: "ME106", name: "Engineering Mechanics" },
];

const SubjectSelection = ({ onNext, onBack, initialSelected }: SubjectSelectionProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected?.map((s) => s.id) || []));

  const fetchSubjects = () => {
    setLoading(true);
    setFetchError(false);
    // Mock API call
    setTimeout(() => {
      setSubjects(MOCK_SUBJECTS);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const toggleSubject = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === subjects.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(subjects.map((s) => s.id)));
    }
  };

  const allSelected = subjects.length > 0 && selected.size === subjects.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-2">Select Subjects</h2>
        <p className="text-muted-foreground">Choose the subjects you want to analyze</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-5 animate-pulse">
              <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Failed to load subjects</p>
          <button onClick={fetchSubjects} className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-4 py-2 rounded-md">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleAll}
              className="text-sm font-medium text-primary hover:underline"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => {
              const isSelected = selected.has(sub.id);
              return (
                <motion.button
                  key={sub.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleSubject(sub.id)}
                  className={`text-left bg-card rounded-lg border p-5 transition-all ${
                    isSelected
                      ? "border-primary glow-primary"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
                    }`}>
                      {isSelected && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.id}</p>
                    </div>
                  </div>
                </motion.button>
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
              disabled={selected.size === 0}
              onClick={() => onNext(subjects.filter((s) => selected.has(s.id)))}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-md disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Confirm Selection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SubjectSelection;
