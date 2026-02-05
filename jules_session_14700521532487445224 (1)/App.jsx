import React, { useState, Suspense, lazy } from 'react';
import { Upload, Activity, Download, Play, Sliders, ChevronDown, Music, Volume2, X } from 'lucide-react';
import { useAudioProcessor, ProcessingStatus } from './useAudioProcessor';
import MainConsole from './src/components/MainConsole';
import Sidebar from './src/components/Sidebar';

const MidiPianoRoll = lazy(() => import('./MidiPianoRoll'));

const App = () => {
  const { status, progress, results, error, processFile, startMidi, reset } = useAudioProcessor();
  const [sensitivity, setSensitivity] = useState(0.5);

  const handleUpload = (e) => { e.target.files[0] && processFile(e.target.files[0]); };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] font-mono selection:bg-[#2ecc71] selection:text-black p-4 md:p-8">
      {/* Concrete Gospel Header */}
      <header className="max-w-6xl mx-auto mb-12 border-b border-[#222] pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">DrumExtract <span className="text-[#666] not-italic font-light">Studio</span></h1>
          <p className="text-[10px] text-[#2ecc71] tracking-[0.4em] uppercase mt-1">Build While Bleeding // v2.0</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-[#444] uppercase">System Status</p>
          <p className={`text-xs ${status === 'error' ? 'text-red-500' : 'text-[#2ecc71]'}`}>{status.toUpperCase()}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Console */}
        <MainConsole
          status={status}
          progress={progress}
          results={results}
          error={error}
          onUpload={handleUpload}
          onStartMidi={startMidi}
          onReset={reset}
          sensitivity={sensitivity}
          setSensitivity={setSensitivity}
        />

        {/* Sidebar */}
        <Sidebar status={status} results={results} progress={progress} />
      </main>
    </div>
  );
};

export default App;
