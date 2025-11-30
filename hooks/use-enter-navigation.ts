'use client';

import type React from 'react';

import { useEffect, useRef } from 'react';

export function useEnterNavigation(formRef: React.RefObject<HTMLFormElement>) {
  const inputRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!formRef.current) return;

    // Get all focusable elements in the form
    const elements = formRef.current.querySelectorAll<HTMLElement>(
      'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])',
    );
    inputRefs.current = Array.from(elements);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();

        const currentElement = document.activeElement as HTMLElement;
        const currentIndex = inputRefs.current.indexOf(currentElement);

        // If we're on the last input, submit the form
        if (currentIndex === inputRefs.current.length - 1) {
          formRef.current?.requestSubmit();
          return;
        }

        // Otherwise, focus the next input
        if (currentIndex > -1 && currentIndex < inputRefs.current.length - 1) {
          inputRefs.current[currentIndex + 1].focus();
        }
      }
    };

    // Add event listener to each input
    inputRefs.current.forEach((input) => {
      input.addEventListener('keydown', handleKeyDown);
    });

    return () => {
      // Clean up event listeners
      inputRefs.current.forEach((input) => {
        input.removeEventListener('keydown', handleKeyDown);
      });
    };
  }, [formRef]);
}

