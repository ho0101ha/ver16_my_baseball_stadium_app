import { auth } from '@/lib/auth';
import Link from 'next/link'
import MobileMenu from './MobileMenu';

 export async function Navber() {
     const session = await auth();
      const isLoggedIn = !!session?.user;
  return (
    <nav className="bg-slate-900 px-6 py-4 sticky top-0 z-40 shadow-lg">
    <header className="max-w-6xl mx-auto flex justify-between items-center">
      {/* ロゴ */}
      <Link href="/" className="text-white font-black text-2xl italic tracking-tighter">
        ⚾️ BASEBALL-LOG
      </Link>

      {/* PC・タブレット版メニュー (md以上で表示) */}
      <div className="hidden md:flex items-center space-x-8 text-s font-black uppercase tracking-widest text-slate-50">
        <Link href="/" className="hover:underline transition-all">ダッシュボード</Link>
        <Link href="/map" className="hover:underline transition-all">マップ</Link>
        
        {isLoggedIn && (
          <Link 
            href="/account" 
            className="bg-blue-600 text-white px-4 py-2 rounded-l hover:bg-blue-500 transition-all italic text-s"
          >
            設定ページ
          </Link>
        )}
      </div>

      {/* モバイル版メニュー (md未満で表示) */}
      <MobileMenu isLoggedIn={isLoggedIn} />
    </header>
  </nav>
  )
}

export default Navber