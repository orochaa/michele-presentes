/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/no-multi-comp */
import { cn } from '@/lib/format'
import { X } from 'lucide-react'
import { motion } from 'motion/react'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'

export interface ModalMethods {
  toggleModal: () => void
  openModal: (...data: unknown[]) => void
  closeModal: () => void
}

interface ModalContextValue {
  closeModal: () => void
  data: unknown[]
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function useModal(): RefObject<ModalMethods | null> {
  return useRef<ModalMethods>(null)
}

interface ModalRootProps {
  children: ReactNode
  disableBackgroundClose?: boolean
}

const ModalRoot = forwardRef<ModalMethods, ModalRootProps>((props, ref) => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<unknown[]>([])

  const toggleModal = useCallback(() => {
    setVisible(v => !v)
  }, [])

  const openModal = useCallback((...args: unknown[]) => {
    setVisible(true)
    setData(args)
  }, [])

  const closeModal = useCallback(() => {
    setVisible(false)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      toggleModal,
      openModal,
      closeModal,
    }),
    [toggleModal, openModal, closeModal]
  )

  const context = useMemo(() => ({ closeModal, data }), [closeModal, data])

  if (!visible) {
    return null
  }

  return createPortal(
    <ModalContext.Provider value={context}>
      <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center">
        <div
          role="button"
          tabIndex={0}
          className="absolute inset-0 bg-black/40"
          onClick={() => !props.disableBackgroundClose && closeModal()}
        />
        {props.children}
      </div>
    </ModalContext.Provider>,
    document.body
  )
})

interface ModalContentProps {
  className?: string
  children: ReactNode
}

function ModalContent(props: ModalContentProps): ReactNode {
  return (
    <motion.div
      initial={{ y: 25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className={cn(
        'relative z-10 max-w-11/12 rounded-xl border border-zinc-600 bg-white lg:w-fit lg:min-w-96',
        props.className
      )}
    >
      <div className="max-h-[80vh] overflow-auto">{props.children}</div>
    </motion.div>
  )
}

interface ModalCloseButtonProps {
  className?: string
}

function ModalCloseButton(props: ModalCloseButtonProps): ReactNode {
  const ctx = useContext(ModalContext)

  if (!ctx) {
    throw new Error('Modal.CloseButton must be used within Modal.Root')
  }

  return (
    <button
      type="button"
      onClick={ctx.closeModal}
      className={cn(
        'absolute top-4.5 right-4.5 z-10 text-zinc-600 transition hover:text-zinc-400 active:text-zinc-400',
        props.className
      )}
      title="Close modal"
    >
      <X className="size-6 shrink-0" />
    </button>
  )
}

interface ModalTitleProps {
  children: ReactNode
}

function ModalTitle(props: ModalTitleProps): ReactNode {
  return (
    <h2 className="border-b border-zinc-600 p-4 text-xl font-bold text-zinc-800">
      {props.children}
    </h2>
  )
}

interface ModalRenderProps {
  className?: string
  children: (...args: unknown[]) => ReactNode
}

function ModalRender(props: ModalRenderProps): ReactNode {
  const ctx = useContext(ModalContext)

  if (!ctx) {
    throw new Error('Modal.Render must be used within Modal.Root')
  }

  return props.children(...ctx.data)
}

export const Modal = {
  Root: ModalRoot,
  Content: ModalContent,
  CloseButton: ModalCloseButton,
  Title: ModalTitle,
  Render: ModalRender,
}
