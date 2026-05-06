import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow';
import { totalProductCount } from '../data/products';

export default function NotFound() {
  return (
    <div className="bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 md:px-10 py-10 md:py-16 text-center">
        <div className="relative h-72 md:h-80 flex items-center justify-center">
          {/* outline 404 with tin replacing the 0 */}
          <div className="flex items-center gap-3 md:gap-6">
            <span className="font-display text-[180px] md:text-[260px] leading-none text-bg-secondary [-webkit-text-stroke:_2px_#CCFF00]">4</span>
            <Tin404 />
            <span className="font-display text-[180px] md:text-[260px] leading-none text-bg-secondary [-webkit-text-stroke:_2px_#CCFF00]">4</span>
          </div>
        </div>
        <Eyebrow className="mt-2 mb-4">ERROR · PAGE NOT FOUND</Eyebrow>
        <h1 className="font-display italic text-white text-4xl md:text-6xl leading-[0.95]">
          This pouch isn't<br />where you left it.
        </h1>
        <p className="mt-4 text-ink-secondary">
          The page you're looking for doesn't exist — maybe it moved, maybe it was never here. Try one of these instead:
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          {[
            ['MOST POPULAR', `Browse all ${totalProductCount} →`, 'Every Swedish brand we stock,\nin one searchable shelf.', '/shop', 'Shop all products'],
            ['BUILD ONE', 'Build a Box →', 'Mix any 6 pouches, save 15%.\nFree worldwide shipping.', '/build', 'Start building'],
            ['DON\'T KNOW WHERE TO START', 'Take the quiz →', '60 seconds, 6 questions.\nFind your match.', '/quiz', 'Open Flavor Finder'],
          ].map(([eyebrow, title, body, to, action]) => (
            <Link
              key={title}
              to={to}
              className="border border-edge rounded-card p-5 hover:border-accent/40 transition group"
            >
              <div className="text-mono-eyebrow text-accent">{eyebrow}</div>
              <div className="font-display italic text-white text-xl mt-2">{title}</div>
              <p className="mt-2 text-ink-secondary text-sm whitespace-pre-line leading-relaxed">{body}</p>
              <div className="mt-3 text-accent text-sm underline underline-offset-4">
                {action}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-center gap-6 text-mono-badge text-white">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-accent transition">
            <ArrowLeft size={12} /> BACK HOME
          </Link>
          <span className="text-accent">·</span>
          <Link to="/shop" className="inline-flex items-center gap-1 hover:text-accent transition">
            <Search size={12} /> SEARCH
          </Link>
          <span className="text-accent">·</span>
          <Link to="/help" className="hover:text-accent transition">CONTACT SUPPORT</Link>
        </div>
      </div>
    </div>
  );
}

function Tin404() {
  return (
    <div className="relative">
      <svg width="200" height="200" viewBox="0 0 200 200" className="md:w-[260px] md:h-[260px]">
        <ellipse cx="100" cy="80" rx="84" ry="22" fill="none" stroke="#CCFF00" strokeWidth="2" />
        <ellipse cx="100" cy="80" rx="84" ry="22" fill="#0A0A0A" opacity="0.6" />
        <path d="M16 80 L16 120 A84 22 0 0 0 184 120 L184 80" fill="none" stroke="#CCFF00" strokeWidth="2" />
        <ellipse cx="100" cy="120" rx="84" ry="22" fill="#151515" stroke="#CCFF00" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
}
