import { useState, useRef, useEffect, ReactNode } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  id: string;
}

export default function Tooltip({ content, children, id }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible && triggerRef.current) {
      setPosition(triggerRef.current.getBoundingClientRect().top < 100 ? 'bottom' : 'top');
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  return (
    <span className="relative inline-flex items-center gap-1">
      {children}
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        aria-describedby={visible ? id : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
      >
        <Info size={14} aria-hidden="true" />
        <span className="sr-only">More information</span>
      </button>
      {visible && (
        <div
          id={id}
          role="tooltip"
          className={`absolute z-50 px-3 py-2 text-xs bg-neutral-900 dark:bg-neutral-700 text-white dark:text-neutral-100 rounded-md shadow-lg max-w-xs w-max ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 -translate-x-1/2`}
        >
          {content}
        </div>
      )}
    </span>
  );
}
