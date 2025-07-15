import { Button } from '@/components/button'
import { Modal, useModal } from '@/components/modal'
import { useCart } from '@/context/cart-provider'
import { formatCurrency } from '@/lib/format'
import { ExternalLink, Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

export function CartPage(): React.JSX.Element {
  const { addCartEvent, cart } = useCart()

  const whatsAppModal = useModal()

  const navigate = useNavigate()

  const totalOrder = useMemo(() => {
    let total = 0

    for (const item of cart) {
      total += item.total
    }

    return total
  }, [cart])

  const goToWhatsAppLink = useMemo((): string => {
    let msg = 'Olá, Michele Presentes!\nGostaria de fazer um pedido:\n\n'
    let total = 0

    for (const item of cart) {
      total += item.total
      msg += [
        `*${item.count} - ${item.product.name}*`,
        `Preço unitário: ${formatCurrency(item.price)}`,
        `Total: ${formatCurrency(item.total)}\n\n`,
      ].join('\n')
    }

    msg += `Total: ${formatCurrency(total)}`

    const phone = '5554984312998'
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURI(msg)}`

    return url
  }, [cart])

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/')
    }
  }, [cart, navigate])

  return (
    <div className="min-h-svh">
      <header className="bg-brown shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <img
              src="/img/logo.jpeg"
              alt="Logo"
              className="size-12 shrink-0 rounded-full border-2 border-white"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-11/12 py-20">
        <div className="container mx-auto">
          <h2 className="mb-1 text-2xl font-bold text-amber-500">
            Pedido: {formatCurrency(totalOrder)}
          </h2>
          <ul className="flex flex-col gap-2">
            {cart.map(({ product, price, count, total }, index) => (
              <li
                key={product.name}
                className="flex items-center gap-4 rounded bg-zinc-50 p-2 shadow-sm"
              >
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="h-32 rounded-sm object-cover shadow"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col text-pretty">
                    <p className="text-lg font-semibold">
                      {count} - {product.name}
                    </p>
                    <p>
                      <span className="font-semibold">Preço unitário:</span>{' '}
                      {formatCurrency(price)}
                    </p>
                    <p>
                      <span className="font-semibold">Total:</span>{' '}
                      {formatCurrency(total)}
                    </p>
                  </div>
                  <div className="flex w-fit items-center gap-3 rounded-xs border border-zinc-200 bg-zinc-100 p-1.5 shadow">
                    <button
                      type="button"
                      className="rounded-xs p-0.5 text-red-500 active:bg-zinc-200"
                      title="Remover"
                      onClick={() =>
                        addCartEvent({ type: 'REMOVE', index: index })
                      }
                    >
                      {count === 1 ? (
                        <Trash2 className="size-5 shrink-0" />
                      ) : (
                        <Minus className="size-5 shrink-0" />
                      )}
                    </button>
                    <span>{count}</span>
                    <button
                      type="button"
                      className="rounded-xs p-0.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
                      title="Adicionar"
                      disabled={count >= 10}
                      onClick={() =>
                        addCartEvent({
                          type: 'ADD',
                          item: {
                            product,
                            price,
                          },
                        })
                      }
                    >
                      <Plus className="size-5 shrink-0" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="container mx-auto mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button variant="cancel" onClick={async () => navigate('/')}>
            Continuar Escolhendo
          </Button>
          <Button
            variant="confirm"
            onClick={() => whatsAppModal.current?.openModal()}
          >
            Confirmar Pedido
          </Button>
        </div>
      </main>

      <Modal.Root ref={whatsAppModal}>
        <Modal.Content className="flex max-w-lg items-start">
          <Modal.Title>ATENÇÃO</Modal.Title>
          <Modal.CloseButton />
          <div className="px-6 py-4">
            <p>
              Ao clicar no botão <b>&quot;Continuar&quot;</b>, você será
              redirecionado para o WhatsApp do Cantinho do Açaí, com uma
              mensagem pré-escrita contendo todos os detalhes do seu pedido.
              Basta enviá-la para finalizar seu pedido! 😁
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="cancel"
                onClick={() => whatsAppModal.current?.closeModal()}
              >
                Cancelar
              </Button>
              <Button
                variant="confirm"
                className="items-start border-zinc-300 bg-green-500"
                onClick={() => window.open(goToWhatsAppLink, '_blank')}
              >
                <ExternalLink className="size-5" />
                Continuar
              </Button>
            </div>
          </div>
        </Modal.Content>
      </Modal.Root>
    </div>
  )
}
