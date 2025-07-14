import { HomePage } from '@/pages/home'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ScrollToTop } from './scrool-to-top'

export function Router(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  )
}
