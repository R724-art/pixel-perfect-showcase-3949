import { createFileRoute } from "@tanstack/react-router";
import { FileUp, FileText, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_workspace/upload")({
  head: () => ({ meta: [{ title: "Upload Resumes | Archivum" }, { name: "description", content: "Select PDF resumes for your candidate archive." }, { property: "og:title", content: "Upload Resumes | Archivum" }, { property: "og:description", content: "Select PDF resumes for your candidate archive." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: UploadPage,
});

type SelectedFile = { id: string; file: File };

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | File[]) => {
    const all = Array.from(incoming);
    const accepted = all.filter((file) => file.type === "application/pdf" || (file.type === "" && file.name.toLowerCase().endsWith(".pdf")));
    setFileError(accepted.length === all.length ? "" : "This file is not supported. Please upload a digitally generated PDF resume.");
    setFiles((current) => {
      const next = accepted.filter((file) => !current.some((item) => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified));
      return [...current, ...next.map((file, index) => ({ id: `${file.name}-${file.lastModified}-${current.length + index}`, file }))];
    });
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) addFiles(event.currentTarget.files);
    event.currentTarget.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return <div className="mx-auto max-w-4xl space-y-6">
    <div><p className="font-mono text-[9px] uppercase text-accent">Resume intake</p><h1 className="mt-1 text-2xl font-semibold">Upload Resumes</h1><p className="mt-2 text-sm text-muted-foreground">Upload digitally generated PDF resumes to add candidates to your database.</p></div>
    <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple onChange={onChange} className="sr-only" aria-label="Choose PDF resumes" />
    <div onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }} onDrop={onDrop} className={`grid min-h-64 place-items-center border border-dashed px-5 py-10 text-center transition-colors ${dragging ? "border-accent bg-accent-soft" : "border-border bg-surface/40"}`}>
      <div className="max-w-md"><span className="mx-auto grid size-12 place-items-center rounded-md bg-secondary"><FileUp size={22} aria-hidden="true" /></span><h2 className="mt-4 text-lg font-semibold">Upload PDF</h2><p className="mt-1 text-sm text-muted-foreground">Drag &amp; drop resumes here, or choose files to browse.</p><Button className="mt-4" onClick={() => inputRef.current?.click()}><FileUp size={15} />Choose PDF files</Button><p className="mt-3 font-mono text-[10px] uppercase text-muted-foreground">PDF files only · multiple files supported</p></div>
    </div>
    {fileError && <p role="alert" className="border-l-2 border-destructive px-3 py-2 text-sm text-destructive">{fileError}</p>}
    {files.length > 0 && <section aria-labelledby="selected-files-title" className="border-y border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border py-3"><div><h2 id="selected-files-title" className="text-sm font-semibold">Selected files</h2><p className="mt-1 text-xs text-muted-foreground">{files.length} {files.length === 1 ? "file" : "files"}</p></div><Button variant="outline" size="sm" onClick={() => setFiles([])}>Clear list</Button></div>
      <ul className="divide-y divide-border">{files.map(({ id, file }) => <li key={id} className="flex min-w-0 items-center gap-3 py-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary"><FileText size={16} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{file.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{formatSize(file.size)}</span></span><span className="shrink-0 text-xs text-muted-foreground">Waiting · not uploaded</span><Button variant="ghost" size="icon" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((item) => item.id !== id))}><X size={15} /></Button></li>)}</ul>
    </section>}
    <p className="text-xs leading-5 text-muted-foreground">The upload service is not connected. Files are only selected in this page; no upload or resume processing has occurred. The connected service will validate that PDFs contain selectable text.</p>
  </div>;
}