import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/StepIndicator";
import LeaveDateSection from "@/components/LeaveDateSection";
import SubjectSelection from "@/components/SubjectSelection";
import AttendanceInput from "@/components/AttendanceInput";
import ResultsSection from "@/components/ResultsSection";

interface Subject {
  id: string;
  name: string;
}

interface AttendanceData {
  [subjectId: string]: { total: number; attended: number };
}

const STEPS = ["Leave Dates", "Subjects", "Attendance", "Results"];

const Index = () => {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveDays, setLeaveDays] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-2">
          Attendance Impact Calculator
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">
          See how planned leave affects your attendance
        </p>

        <StepIndicator currentStep={step} steps={STEPS} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <LeaveDateSection
              key="step1"
              initial={{ startDate, endDate }}
              onNext={(d) => {
                setStartDate(d.startDate);
                setEndDate(d.endDate);
                setLeaveDays(d.leaveDays);
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <SubjectSelection
              key="step2"
              initialSelected={selectedSubjects}
              onNext={(subs) => {
                setSelectedSubjects(subs);
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <AttendanceInput
              key="step3"
              subjects={selectedSubjects}
              initialData={attendanceData}
              onNext={(data) => {
                setAttendanceData(data);
                setStep(4);
              }}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <ResultsSection
              key="step4"
              subjects={selectedSubjects}
              attendanceData={attendanceData}
              leaveDays={leaveDays}
              onRecalculate={() => setStep(1)}
              onBack={() => setStep(3)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
