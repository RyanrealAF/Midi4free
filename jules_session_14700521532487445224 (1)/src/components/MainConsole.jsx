import React from 'react';
import { Activity, Download, Play, X } from 'lucide-react';
import WaveformVisualizer from '../WaveformVisualizer';

const ProcessingPhase = ({ progress }) => (
  <div className="h-[400px] flex flex-col items-center justify-center">
    <div className="relative w-48 h-48 mb-8">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <polygon points="50,10 90,80 10,80" fill="none" stroke="#222" strokeWidth="2" />
        <polygon points="50,10 90,80 10,80" fill="none" stroke="#2ecc71" strokeWidth="2" strokeDasharray="260" strokeDashoffset={260 - (progress.percent * 2.6)} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black italic">{progress.percent}%</span>
      </div>
    </div>
    <p className="text-xs text-[#2ecc71] animate-pulse uppercase tracking-widest">{progress.message}</p>
  </div>
);

const PreviewPhase = ({ results, sensitivity, setSensitivity, onStartMidi }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="bg-black/40 p-6 rounded border border-[#222]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-[#666] uppercase tracking-widest">Isolated Drum Stream</span>
        <Play size={16} className="text-[#2ecc71] cursor-pointer" />
      </div>
      <div className="h-24"><WaveformVisualizer url={results.drumUrl} /></div>
    </div>

    <div className="bg-[#1a1a1a] p-8 rounded-xl border border-[#222]">
      <label className="flex items-center gap-2 text-[10px] text-[#666] uppercase tracking-[0.2em] mb-6">
        <span className="inline-block w-3 h-3 bg-[#2ecc71] rounded-full mr-2"></span>
        Extraction Sensitivity: {Math.round(sensitivity * 100)}%
      </label>
      <input 
        type="range" 
        min="0.1" 
        max="0.9" 
        step="0.05" 
        value={sensitivity} 
        onChange={(e) => setSensitivity(parseFloat(e.target.value))}
        className="w-full accent-[#2ecc71] bg-black h-1 appearance-none rounded" 
      />
      <div className="flex justify-between text-[8px] text-[#333] mt-2 font-bold">
        <span>CLEAN (STRICT)</span>
        <span>BUSY (GHOST NOTES)</span>
      </div>
    </div>

    <button 
      onClick={() => onStartMidi(sensitivity, sensitivity * 0.6)}
      className="w-full py-4 bg-[#2ecc71] text-black font-black uppercase italic tracking-tighter hover:bg-[#27ae60] transition-all transform hover:scale-[1.01] active:scale-[0.99]"
    >
      Initiate MIDI Extraction
    </button>
  </div>
);

const CompletePhase = ({ results, onReset }) => (
  <div className="space-y-8 animate-in zoom-in-95 duration-500">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-black italic uppercase">Extraction Ready</h3>
      <Activity size={24} className="text-[#2ecc71]" />
    </div>
    
    <div className="h-48 border border-[#222] bg-black/40 rounded-lg overflow-hidden">
      <Suspense fallback={<div className="h-full flex items-center justify-center text-[10px] text-[#333]">Rendering MIDI...</div>}>
        <MidiPianoRoll url={results.midiUrl} />
      </Suspense>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <a href={results.midiUrl} download className="flex items-center justify-center gap-2 py-4 bg-[#f0f0f0] text-black font-black uppercase italic text-sm hover:bg-white transition-colors">
        <Download size={18} /> Download MIDI
      </a>
      <a href={results.drumUrl} download className="flex items-center justify-center gap-2 py-4 border border-[#333] text-[#f0f0f0] font-black uppercase italic text-sm hover:bg-[#222] transition-colors">
        <span className="inline-block w-3 h-3 bg-[#2ecc71] rounded-full mr-2"></span>
        Export Audio
      </a>
    </div>

    <button onClick={onReset} className="w-full py-2 text-[10px] text-[#444] hover:text-[#2ecc71] transition-colors uppercase tracking-widest">Start New Session</button>
  </div>
);

const ErrorPhase = ({ error, onReset }) => (
  <div className="bg-red-950/20 border border-red-900 p-6 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-red-500 font-black italic">EXCEPTION DETECTED</span>
      <X size={16} className="text-red-500 cursor-pointer" onClick={onReset} />
    </div>
    <p className="text-xs text-red-400 font-mono">{error}</p>
    <button onClick={onReset} className="mt-4 px-4 py-2 bg-red-500 text-black text-[10px] font-black uppercase">Initialize Recovery</button>
  </div>
);

const UploadPhase = ({ onUpload }) => (
  <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-[#222] rounded-xl hover:border-[#2ecc71] transition-colors group">
    <label className="cursor-pointer flex flex-col items-center">
      <span className="inline-block w-12 h-12 border-2 border-[#222] rounded-full flex items-center justify-center mb-4 group-hover:border-[#2ecc71] transition-colors">
        <svg className="w-6 h-6 text-[#333] group-hover:text-[#2ecc71] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </span>
      <span className="text-sm text-[#666] group-hover:text-[#f0f0f0]">Drop Audio Stem (WAV/MP3)</span>
      <input type="file" className="hidden" onChange={(e) => onUpload(e.target.files[0])} />
    </label>
  </div>
);

const MainConsole = ({ 
  status, 
  progress, 
  results, 
  error, 
  onUpload, 
  onStartMidi, 
  onReset, 
  sensitivity, 
  setSensitivity 
}) => {
  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#222] to-transparent"></div>
      
      {status === 'idle' && <UploadPhase onUpload={onUpload} />}
      {status === 'processing' && <ProcessingPhase progress={progress} />}
      {status === 'awaiting_midi' && (
        <PreviewPhase 
          results={results} 
          sensitivity={sensitivity} 
          setSensitivity={setSensitivity} 
          onStartMidi={onStartMidi} 
        />
      )}
      {status === 'complete' && <CompletePhase results={results} onReset={onReset} />}
      {error && <ErrorPhase error={error} onReset={onReset} />}
    </div>
  );
};

export default MainConsole;