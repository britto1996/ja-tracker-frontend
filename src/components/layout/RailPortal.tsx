'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function LeftRail({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.getElementById('left-rail')), []);
  if (!el) return null;
  return createPortal(children, el);
}
