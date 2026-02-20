import React, { useEffect, useState, useRef } from "react";
import { FileText, Loader2, Check } from "lucide-react";

const steps = [
  "Parsing your resume",
  "Analyzing your experience",
  "Extracting your skills",
  "Generating recommendations",
];

const ATSChecker: React.FC = () => {
  const [phase, setPhase] = useState<"idle" | "processing" | "results">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    Content: true,
    Sections: false,
    "ATS Essentials": false,
    Tailoring: false,
  });
  const [view, setView] = useState<"original" | "feedback">("feedback");
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (phase !== "processing") return;

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((s) => Math.min(s + 1, steps.length));
    }, 1500);

    const finish = setTimeout(() => {
      clearInterval(interval);
      setPhase("results");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(finish);
    };
  }, [phase]);

  const onFileSelected = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setPhase("processing");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelected(f);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileSelected(f);
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      {phase === "idle" && (
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-gray-200 shadow-sm p-10 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Make a Mistake-Free Resume with Our AI Resume Fixer
            </h1>
            <p className="mt-3 text-gray-600">Upload your resume to get an instant ATS score and actionable feedback.</p>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mt-8 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="flex-1">
                <label className="block">
                  <div className="mx-auto max-w-xl">
                    <div className="relative">
                      <div className="rounded-md border-2 border-dashed border-gray-300 p-10 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FileText className="h-10 w-10 text-gray-400" />
                          <div className="text-lg font-medium text-gray-800">Drag and drop your PDF here</div>
                          <div className="text-sm text-gray-500">We’ll analyze formatting, keywords and ATS-compatibility.</div>
                          <div className="mt-4">
                            <button
                              onClick={() => fileInput.current?.click()}
                              className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow"
                            >
                              Upload Your Resume
                            </button>
                          </div>
                        </div>
                      </div>
                      <input ref={fileInput} onChange={handleFileInput} type="file" accept=".pdf" className="hidden" />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "processing" && (
        <div className="max-w-2xl mx-auto mt-16">
          <div className="rounded-lg border border-gray-200 shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800">Analyzing your resume</h2>
            <p className="text-gray-500 mt-2">This usually takes a few seconds — our AI is hard at work.</p>

            <div className="mt-6 text-left">
              {steps.map((s, i) => {
                const completed = i < stepIndex;
                const current = i === stepIndex;
                return (
                  <div key={s} className={`flex items-center gap-4 py-3 ${current ? "text-violet-600 font-medium" : "text-gray-600"}`}>
                    <div className="w-8 flex items-center justify-center">
                      {completed ? (
                        <Check className="text-green-500" />
                      ) : (
                        <Loader2 className={`h-4 w-4 ${current ? "animate-spin text-violet-500" : "text-gray-300"}`} />
                      )}
                    </div>
                    <div>{s}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {phase === "results" && (
        <div className="max-w-6xl mx-auto mt-8 md:mt-12">
          <div className="md:grid md:grid-cols-[300px_1fr] md:gap-8">
            <aside className="mb-6 md:mb-0">
              <div className="rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="text-sm text-gray-500">Your Score</div>
                <div className="flex items-baseline gap-3 mt-2">
                  <div className="text-4xl font-bold text-emerald-600">94</div>
                  <div className="text-gray-600">/100</div>
                </div>
                <div className="text-sm text-gray-500 mt-2">2 Issues found</div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="text-sm font-medium text-gray-800">Checks</div>
                <div className="mt-3 space-y-2">
                  {Object.keys(accordionOpen).map((k) => (
                    <div key={k} className="border border-gray-100 rounded-md overflow-hidden">
                      <button
                        onClick={() => setAccordionOpen((s) => ({ ...s, [k]: !s[k] }))}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700"
                      >
                        <span>{k}</span>
                        <span className="text-green-500">{accordionOpen[k] ? "▲" : "▼"}</span>
                      </button>
                      {accordionOpen[k] && (
                        <div className="px-3 pb-3 pt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2 py-1"><Check className="text-green-500" /> ATS Parse Rate</div>
                          <div className="flex items-center gap-2 py-1"><Check className="text-green-500" /> Quantifying Impact</div>
                          <div className="flex items-center gap-2 py-1"><Check className="text-green-500" /> Repetition</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <main>
              <div className="rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-md bg-gray-50 p-1">
                    <button
                      onClick={() => setView("original")}
                      className={`px-3 py-1 rounded-md text-sm ${view === "original" ? "bg-white shadow" : "text-gray-600"}`}
                    >
                      Original Resume
                    </button>
                    <button
                      onClick={() => setView("feedback")}
                      className={`px-3 py-1 rounded-md text-sm ${view === "feedback" ? "bg-white shadow" : "text-gray-600"}`}
                    >
                      Actionable Feedback
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">{fileName ?? "uploaded_resume.pdf"}</div>
                </div>

                <div className="mt-6">
                  <div className="rounded-md border border-gray-100 p-4">
                    <h3 className="text-lg font-semibold text-gray-800">ATS Parse Rate</h3>
                    <p className="text-sm text-gray-600 mt-1">How well an ATS can read and parse your document structure.</p>

                    <div className="mt-4">
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-3 bg-emerald-500 rounded-full w-full" />
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Parse Rate: 100%</div>
                    </div>

                    <div className="mt-6 bg-white rounded-md border border-gray-100 shadow-sm p-4">
                      <div className="text-xs text-gray-500 mb-2">Preview</div>
                      <div className="rounded-md bg-gray-50 p-4">
                        <div className="text-sm text-gray-800 font-medium">Jane Doe</div>
                        <div className="text-sm text-gray-600">Product Manager — janedoe@example.com — (555) 555-5555</div>
                        <div className="mt-3 text-sm text-gray-700">
                          • Led a cross-functional team to increase conversion by 35% through A/B testing and iterative
                          experimentation.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSChecker;
