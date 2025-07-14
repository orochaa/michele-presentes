interface Product {
  imgUrl: string
  name: string
}

interface Category {
  description: string
  price: number
  products: Product[]
}
