import { categoriesEntries } from '@/lib/data/categories'
import { formatCurrency, scrollTo, slang, slangId } from '@/lib/format'

export function HomePage(): React.JSX.Element {
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
          <nav>
            {categoriesEntries.map(([categoryName]) => (
              <button
                key={categoryName}
                type="button"
                onClick={scrollTo(slangId(categoryName), { offset: 20 })}
                className="rounded-md px-3 text-sm font-medium text-white hover:text-zinc-200"
              >
                {categoryName}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-11/12 py-20">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-balance text-amber-500 sm:text-5xl md:text-6xl">
            Canecas Especiais para o Dia dos Pais
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Surpreenda seu pai com um presente único e personalizado.
          </p>
        </section>

        {categoriesEntries.map(([categoryName, category]) => (
          <section
            key={categoryName}
            id={slang(categoryName)}
            className="container mx-auto mb-16"
          >
            <div className="mb-6 text-pretty">
              <h3 className="mb-1 text-2xl font-bold text-amber-500 md:text-3xl">
                {categoryName} {formatCurrency(category.price)}
              </h3>
              <p className="text-zinc-600">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.products.map(product => (
                <div
                  key={product.name}
                  className="border-gold rounded-2xl border-2 p-1 shadow-lg transition-transform duration-300 hover:-translate-y-2"
                >
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="h-72 w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="bg-brown py-6">
        <div className="container mx-auto text-center text-white">
          <p className="text-balance">
            &copy; {new Date().getFullYear()} Michele Presentes. Todos os
            direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
