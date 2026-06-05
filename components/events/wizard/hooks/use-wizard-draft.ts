"use client";

import { useCallback, useRef } from "react";
import type { EventWizardData } from "../schemas/event-wizard";

const STORAGE_KEY = "event-wizard-draft";
const TTL_MS = 24 * 60 * 60 * 1000;

type WizardDraft = {
  step: number;
  data: Partial<EventWizardData>;
  savedAt: string;
};

export function useWizardDraft() {
  const isResuming = useRef(false);

  const saveDraft = useCallback(
    (step: number, data: Partial<EventWizardData>) => {
      const draft: WizardDraft = {
        step,
        data,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    },
    []
  );

  const loadDraft = useCallback((): WizardDraft | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const draft: WizardDraft = JSON.parse(raw);
      const age = Date.now() - new Date(draft.savedAt).getTime();
      if (age > TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      if (draft.data.startDate) {
        draft.data.startDate = new Date(draft.data.startDate);
      }
      if (draft.data.endDate) {
        draft.data.endDate = new Date(draft.data.endDate);
      }
      return draft;
    } catch {
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { saveDraft, loadDraft, clearDraft, isResuming };
}
