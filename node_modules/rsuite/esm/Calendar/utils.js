'use client';
import { DateUtils } from '../utils';

/**
 * Get aria-label for the date.
 * @param date - The date.
 * @param formatStr - The format string.
 * @param format - The format function.
 */
export function getAriaLabel(date, formatStr, format) {
  return format ? format(date, formatStr) : DateUtils.format(date, formatStr);
}