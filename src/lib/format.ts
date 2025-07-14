import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import type { MouseEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...className: ClassValue[]): string {
  return twMerge(clsx(...className))
}

export function formatCurrency(value: string | number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function slang(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
    .replace(/^-/, '')
}

export function slangId(str: string): string {
  return `#${slang(str)}`
}

export function scrollTo(
  id: string,
  options?: { offset?: number; behavior?: ScrollBehavior }
) {
  return (e: MouseEvent): void => {
    const element = document.querySelector(id)

    if (!element) {
      return
    }

    e.preventDefault()

    const { behavior = 'smooth', offset = 0 } = options ?? {}

    window.scroll({
      top: Math.round(
        element.getBoundingClientRect().top +
          document.documentElement.scrollTop -
          offset
      ),
      left: 0,
      behavior,
    })
    globalThis.history.pushState({}, '', id)
  }
}
