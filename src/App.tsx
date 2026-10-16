import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from 'react';
import { Route, Routes } from 'react-router';
import { RequireAuth } from './components/auth/RequireAuth';
import { Layout } from './components/layout/Layout';
import { PageLoader } from './components/ui/Loading';
import { Toaster } from './components/ui/Toaster';
import { CartPage } from './pages/CartPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';
import { WishlistPage } from './pages/WishlistPage';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { useCatalogStore } from './store/catalogStore';

/** Loads a page's named export on demand. */
function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => load().then((module) => ({ default: module[name] })));
}

// Account, checkout and admin pages carry the form libraries, so they load on demand to keep browsing fast.
const AccountPage = page(() => import('./pages/AccountPage'), 'AccountPage');
const CheckoutPage = page(() => import('./pages/CheckoutPage'), 'CheckoutPage');
const LoginPage = page(() => import('./pages/LoginPage'), 'LoginPage');
const OrderConfirmationPage = page(() => import('./pages/OrderConfirmationPage'), 'OrderConfirmationPage');
const RegisterPage = page(() => import('./pages/RegisterPage'), 'RegisterPage');
const AdminLayout = page(() => import('./components/admin/AdminLayout'), 'AdminLayout');
const AdminLoginPage = page(() => import('./pages/admin/AdminLoginPage'), 'AdminLoginPage');
const DashboardPage = page(() => import('./pages/admin/DashboardPage'), 'DashboardPage');
const AdminProductsPage = page(() => import('./pages/admin/ProductsPage'), 'ProductsPage');
const ProductFormPage = page(() => import('./pages/admin/ProductFormPage'), 'ProductFormPage');
const AdminOrdersPage = page(() => import('./pages/admin/OrdersPage'), 'OrdersPage');
const AdminOrderDetailPage = page(() => import('./pages/admin/OrderDetailPage'), 'OrderDetailPage');

const signedIn = (element: ReactNode) => <RequireAuth>{element}</RequireAuth>;

/** Loads the signed-in user and the catalog once, and keeps the saved bag in step with live prices and stock. */
function useBootstrap() {
  const initAuth = useAuthStore((s) => s.init);
  const loadCatalog = useCatalogStore((s) => s.load);
  const products = useCatalogStore((s) => s.products);
  const catalogReady = useCatalogStore((s) => s.status === 'ready');
  const syncCart = useCartStore((s) => s.syncWithCatalog);

  useEffect(() => {
    void initAuth();
    void loadCatalog();
  }, [initAuth, loadCatalog]);

  useEffect(() => {
    if (catalogReady) syncCart(products);
  }, [catalogReady, products, syncCart]);
}

export default function App() {
  useBootstrap();

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="checkout" element={signedIn(<CheckoutPage />)} />
          <Route path="order/:orderId" element={signedIn(<OrderConfirmationPage />)} />
          <Route path="account" element={signedIn(<AccountPage />)} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="admin/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLoginPage />
            </Suspense>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAuth admin>
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
