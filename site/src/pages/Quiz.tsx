import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCw } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow';
import { products } from '../data/products';
import type { Product } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { QUIZ_ICONS } from '../data/images';
import { LinkButton } from '../components/Button';

type OptionVisual =
  | { kind: 'image'; src: string }
  | { kind: 'gradient'; from: string; to: string }
  | { kind: 'glyph'; symbol: string };

type Option = {
  value: string;
  label: string;
  sub?: string;
  visual: OptionVisual;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
  /** Optional weight per option to influence matching */
  weight?: number;
};

const QUESTIONS: Question[] = [
  {
    id: 'flavor',
    question: 'What flavor profile pulls you?',
    options: [
      { value: 'mint', label: 'MINT', sub: 'Cool, fresh, classic', visual: { kind: 'image', src: QUIZ_ICONS.fresh } },
      { value: 'fruit', label: 'FRUIT', sub: 'Berry, tropical, sweet', visual: { kind: 'gradient', from: '#F2A6C3', to: '#7B1818' } },
      { value: 'spice', label: 'SPICE', sub: 'Cinnamon, ginger, heat', visual: { kind: 'gradient', from: '#E89A1F', to: '#5C2010' } },
      { value: 'citrus', label: 'CITRUS', sub: 'Sharp, bright, herbal', visual: { kind: 'gradient', from: '#F2C200', to: '#A86A00' } },
    ],
  },
  {
    id: 'mint-feel',
    question: 'How do you take your mint?',
    options: [
      { value: 'fresh', label: 'FRESH', sub: 'Cool, herbal', visual: { kind: 'image', src: QUIZ_ICONS.fresh } },
      { value: 'icy', label: 'ICY', sub: 'Cold, frosted', visual: { kind: 'image', src: QUIZ_ICONS.icy } },
      { value: 'sharp', label: 'SHARP', sub: 'Strong, throat-y', visual: { kind: 'image', src: QUIZ_ICONS.sharp } },
    ],
  },
  {
    id: 'strength',
    question: 'How strong are we going?',
    options: [
      { value: 'light', label: 'LIGHT', sub: '2–3 mg', visual: { kind: 'glyph', symbol: '·' } },
      { value: 'regular', label: 'REGULAR', sub: '4–6 mg', visual: { kind: 'glyph', symbol: '··' } },
      { value: 'strong', label: 'STRONG', sub: '7–9 mg', visual: { kind: 'glyph', symbol: '···' } },
      { value: 'x-strong', label: 'X-STRONG', sub: '10+ mg', visual: { kind: 'glyph', symbol: '····' } },
    ],
  },
  {
    id: 'occasion',
    question: 'When will you use them?',
    options: [
      { value: 'rotation', label: 'ALL DAY', sub: 'Daily rotation', visual: { kind: 'glyph', symbol: '☀' } },
      { value: 'evening', label: 'EVENINGS', sub: 'After hours', visual: { kind: 'glyph', symbol: '☾' } },
      { value: 'focus', label: 'WORKING', sub: 'Focus tool', visual: { kind: 'glyph', symbol: '⊡' } },
      { value: 'social', label: 'SOCIAL', sub: 'Going out', visual: { kind: 'glyph', symbol: '◯' } },
    ],
  },
  {
    id: 'format',
    question: 'Pouch format preference?',
    options: [
      { value: 'slim', label: 'SLIM', sub: 'Discreet, narrow', visual: { kind: 'glyph', symbol: '|' } },
      { value: 'standard', label: 'STANDARD', sub: 'Classic, full', visual: { kind: 'glyph', symbol: '▮' } },
      { value: 'mini', label: 'MINI', sub: 'Tiny, short burn', visual: { kind: 'glyph', symbol: '▪' } },
      { value: 'any', label: 'NO PREFERENCE', sub: 'Surprise me', visual: { kind: 'glyph', symbol: '?' } },
    ],
  },
  {
    id: 'experience',
    question: 'Are you new to pouches?',
    options: [
      { value: 'new', label: 'FIRST TIME', sub: 'Brand new', visual: { kind: 'glyph', symbol: '01' } },
      { value: 'some', label: 'TRIED A FEW', sub: 'Curious', visual: { kind: 'glyph', symbol: '02' } },
      { value: 'pro', label: 'SEASONED', sub: 'Know the brands', visual: { kind: 'glyph', symbol: '03' } },
      { value: 'daily', label: 'DAILY USER', sub: 'All day, every day', visual: { kind: 'glyph', symbol: '04' } },
    ],
  },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const total = QUESTIONS.length;
  const done = step >= total;

  const matches = useMemo(() => (done ? matchProducts(answers) : []), [done, answers]);

  if (done) {
    return (
      <div className="bg-bg-primary">
        <div className="max-w-3xl mx-auto px-4 md:px-10 py-12 md:py-20">
          <div className="text-center mb-10">
            <Eyebrow className="mb-3 inline-flex items-center gap-3 justify-center">
              <span aria-hidden className="h-px w-8 bg-accent/50" />
              YOUR MATCHES · 60 SECONDS
              <span aria-hidden className="h-px w-8 bg-accent/50" />
            </Eyebrow>
            <h1 className="font-display italic text-white text-4xl md:text-6xl leading-tight">
              Three pouches you'll<br />actually love.
            </h1>
            <p className="mt-4 text-ink-secondary max-w-xl mx-auto">
              Based on your answers across {total} questions. Click any to read its full story.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {matches.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
          <div className="border-t border-edge-muted pt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setStep(0);
                setAnswers({});
              }}
              className="inline-flex items-center gap-2 h-11 px-5 border border-edge text-white text-mono-badge tracking-wider hover:border-white/40 transition"
            >
              <RotateCw size={14} /> RETAKE THE QUIZ
            </button>
            <LinkButton to="/shop" iconRight={<ArrowRight size={14} />} size="md">
              BROWSE ALL PRODUCTS
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  const cur = QUESTIONS[step];
  const sel = answers[cur.id];

  return (
    <div className="bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 md:px-10 py-10 md:py-16">
        {/* Progress strip */}
        <div className="mb-8 flex items-center justify-between">
          <Eyebrow>FLAVOR FINDER · {step + 1} OF {total}</Eyebrow>
          <span className="text-mono-badge text-ink-secondary">
            {Math.round(((step + 1) / total) * 100)}% COMPLETE
          </span>
        </div>
        <div className="flex items-center gap-1 mb-12">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`flex-1 h-px ${i <= step ? 'bg-accent' : 'bg-edge'}`} />
          ))}
        </div>

        <h2 className="font-display italic text-white text-3xl md:text-5xl text-center leading-[1.05] mb-10">
          {cur.question}
        </h2>

        <div className={`grid gap-3 ${cur.options.length > 3 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
          {cur.options.map((opt, idx) => {
            const selected = sel === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setAnswers({ ...answers, [cur.id]: opt.value })}
                className={`group relative text-left transition-all ease-pouch-out ${
                  selected ? '-translate-y-0.5' : ''
                }`}
              >
                <div
                  className={`relative aspect-square overflow-hidden border transition-all ${
                    selected
                      ? 'border-accent shadow-glow-accent-strong'
                      : 'border-edge group-hover:border-white/40'
                  }`}
                >
                  <OptionVisualSlot visual={opt.visual} selected={selected} />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/30 to-transparent" />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-sm text-[9px] font-mono text-white tracking-wider">
                    0{idx + 1}
                  </span>
                  {selected && (
                    <span className="absolute top-2 right-2 w-6 h-6 bg-accent text-accent-on flex items-center justify-center">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <div className={`text-mono-badge font-bold tracking-wider ${selected ? 'text-accent' : 'text-white'}`}>
                      {opt.label}
                    </div>
                    {opt.sub && (
                      <div className="text-[10px] font-mono text-ink-secondary mt-0.5">{opt.sub}</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-edge-muted flex items-center justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep(Math.max(0, step - 1))}
            className="inline-flex items-center gap-1.5 text-mono-badge text-white tracking-wider hover:text-accent transition disabled:opacity-30 disabled:hover:text-white"
          >
            <ArrowLeft size={13} /> BACK
          </button>
          <button
            disabled={!sel}
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 h-11 px-6 bg-accent text-accent-on font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-105 transition"
          >
            {step === total - 1 ? 'GET MY MATCHES' : 'CONTINUE'} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionVisualSlot({ visual, selected }: { visual: OptionVisual; selected: boolean }) {
  if (visual.kind === 'image') {
    return (
      <img
        src={visual.src}
        alt=""
        className={`w-full h-full object-cover transition-transform duration-slow ${
          selected ? 'scale-105' : 'scale-100'
        }`}
      />
    );
  }
  if (visual.kind === 'gradient') {
    return (
      <div
        className="w-full h-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${visual.from}, ${visual.to})`,
        }}
      />
    );
  }
  // glyph
  return (
    <div className="w-full h-full bg-bg-primary flex items-center justify-center surface-concrete">
      <span
        className={`font-display italic transition-all ${
          selected ? 'text-accent' : 'text-white/80'
        }`}
        style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1 }}
      >
        {visual.symbol}
      </span>
    </div>
  );
}

/**
 * Score every product against the answers. Higher score = better match.
 * Returns the top 3.
 */
function matchProducts(answers: Record<string, string>): Product[] {
  const scored = products.map((p) => {
    let score = 0;
    if (answers.flavor && p.flavorFamily === answers.flavor) score += 4;
    if (answers.flavor === 'mint' && p.flavorFamily === 'mint') score += 1;
    if (answers.strength && p.strengthTier === answers.strength) score += 3;
    if (answers.format && (answers.format === 'any' || p.format === answers.format)) score += 1;
    if (answers.experience === 'new' && p.strengthTier === 'light') score += 2;
    if (answers.experience === 'new' && p.strengthTier === 'regular') score += 1;
    if (answers.experience === 'daily' && (p.strengthTier === 'strong' || p.strengthTier === 'x-strong')) score += 2;
    if (answers.experience === 'pro' && p.bestseller) score += 1;
    if (answers['mint-feel'] === 'icy' && /mint|spearmint|polar|freeze|ice/i.test(p.flavor)) score += 2;
    if (answers['mint-feel'] === 'sharp' && p.strengthTier === 'x-strong') score += 1;
    if (p.bestseller) score += 0.5;
    score += p.rating * 0.2;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3).map((x) => x.p);
  // Ensure at least 3 — fall back to bestsellers if scoring tied or pool too narrow
  if (top.length < 3) {
    const fallback = products.filter((p) => p.bestseller).slice(0, 3 - top.length);
    return [...top, ...fallback].slice(0, 3);
  }
  return top;
}
