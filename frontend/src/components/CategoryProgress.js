'use client';

export default function CategoryProgress({ category, spent, limit }) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  
  return (
    <div className="space-y-2 p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 hover:bg-white transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">{category}</span>
        <span className="text-xs font-black text-slate-900">
          ₹{spent.toLocaleString()} <span className="text-slate-300 font-bold ml-1">/ ₹{limit.toLocaleString()}</span>
        </span>
      </div>
      
      <div className="h-2 w-full bg-white rounded-full overflow-hidden ring-1 ring-slate-100 p-[1px]">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            percentage > 90 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
            percentage > 70 ? 'bg-amber-400' :
            'bg-blue-600'
          }`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      <div className="flex justify-end pr-1">
        <span className={`text-[9px] font-black ${percentage > 100 ? 'text-red-500' : 'text-slate-400'}`}>
          {percentage.toFixed(0)}% Utilized
        </span>
      </div>
    </div>
  );
}
