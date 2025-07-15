import { useDailyAppPing } from '@/hooks/use-daily-app-ping'
import { CartPage } from '@/pages/cart'
import { HomePage } from '@/pages/home'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ScrollToTop } from './scrool-to-top'

export function Router(): React.JSX.Element {
  useDailyAppPing()

  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  )
}
