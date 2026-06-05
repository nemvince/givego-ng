"use client";

import { useEffect, useRef } from "react";

export function useWizardFocus(step: number) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStepRef = useRef(step);

  useEffect(() => {
    if (prevStepRef.current !== step) {
      headingRef.current?.focus();
      prevStepRef.current = step;
    }
  }, [step]);

  return headingRef;
}
