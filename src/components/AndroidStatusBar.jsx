import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar = () => {
  const [time, setTime] = useState('16:28');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-6 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700 select-none bg-white border-b border-slate-100 z-30">
      {/* Time */}
      <span className="font-mono font-bold tracking-tight text-slate-900">{time}</span>

      {/* Status Icons */}
      <div className="flex items-center gap-2 text-slate-600">
        <span className="text-[10px] font-black font-mono text-blue-600">4G</span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono font-medium">95%</span>
          <BatteryMedium className="w-4 h-4 text-slate-700" />
        </div>
      </div>
    </div>
  );
};
