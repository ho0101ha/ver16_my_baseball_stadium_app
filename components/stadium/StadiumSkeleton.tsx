export function StadiumSkeleton() {
    return (
      <div className="space-y-8 animate-pulse">
        {/* 曜日別グラフのスケルトン */}
        <div className="h-64 bg-white border border-slate-200 shadow-sm"></div>
        {/* 対戦相手統計のスケルトン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-48 bg-white border border-slate-200 shadow-sm"></div>
          <div className="h-48 bg-white border border-slate-200 shadow-sm"></div>
        </div>
        {/* リストのスケルトン */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white border border-slate-200 shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }
  