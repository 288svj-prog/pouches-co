import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import BrandsIndex from './pages/BrandsIndex';
import BrandPLP from './pages/BrandPLP';
import PDP from './pages/PDP';
import BYO from './pages/BYO';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Quiz from './pages/Quiz';
import Drops from './pages/Drops';
import CategoryPLP from './pages/CategoryPLP';
import NotFound from './pages/NotFound';
import { About, Help, Journal } from './pages/Static';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/drops" element={<Drops />} />
          <Route path="/brands" element={<BrandsIndex />} />
          <Route path="/brands/:slug" element={<BrandPLP />} />
          <Route path="/products/:slug" element={<PDP />} />
          <Route path="/build" element={<BYO />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<Account />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flavors" element={<Shop />} />
          <Route path="/flavors/:value" element={<CategoryPLP kind="flavor" />} />
          <Route path="/strength" element={<Shop />} />
          <Route path="/strength/:value" element={<CategoryPLP kind="strength" />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help/:topic" element={<Help />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/wholesale" element={<Help />} />
          <Route path="/press" element={<Help />} />
          <Route path="/affiliate" element={<Help />} />
          <Route path="/reviews" element={<Help />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
