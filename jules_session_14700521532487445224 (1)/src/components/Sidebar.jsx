import React, { useState } from 'react';
import { ChevronDown, Volume2, Download } from 'lucide-react';

const AdvancedParameters = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-6">
      <button 
        onClick={() => setShowAdvanced(!showAdvanced)} 
        className="w-full flex items-center justify-between group"
      >
        <span className="text-[10px] text-[#666] group-hover:text-[#f0f0f0] transition-colors uppercase tracking-widest font-bold">Advanced Parameters</span>
        <ChevronDown className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} size={16} />
      </button>
      
      {showAdvanced && (
        <div className="mt-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="p-4 bg-black/40 rounded border border-[#222]">
            <p className="text-[8px] text-[#444] uppercase mb-2">Stem Isolation</p>
            <div className="space-y-2">
              {['Vocals', 'Bass', 'Other'].map(stem => (
                <div key={stem} className="flex justify-between items-center">
                  <span className="text-[10px] text-[#666]">{stem}</span>
                  <Download size={12} className="text-[#333] cursor-not-allowed opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DiagnosticLog = ({ status, results, progress }) => {
  const [logs] = useState([
    { time: '00:00:01', message: 'System boot complete', type: 'info' },
    { time: '00:00:02', message: 'Engine: Spleeter v2.4 + Basic-Pitch v0.2.5', type: 'info' }
  ]);

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-6 h-[200px] overflow-y-auto">
      <p className="text-[10px] text-[#333] uppercase font-bold mb-4 flex items-center gap-2">
        <Volume2 size={12} /> Diagnostic Log
      </p>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <p key={index} className="text-[8px] text-[#222] tracking-tighter">
            [{log.time}] {log.message}
          </p>
        ))}
        {status !== 'idle' && results?.taskId && (
          <p className="text-[8px] text-[#2ecc71] tracking-tighter">
            [{new Date().toLocaleTimeString()}] Task ID: {results.taskId.slice(0,8)}
          </p>
        )}
        {progress?.message && (
          <p className="text-[8px] text-[#2ecc71] tracking-tighter">
            [{new Date().toLocaleTimeString()}] {progress.message.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ status, results, progress }) => {
  return (
    <div className="lg:col-span-4 space-y-6">
      <AdvancedParameters />
      <DiagnosticLog status={status} results={results} progress={progress} />
    </div>
  );
};

export default Sidebar;