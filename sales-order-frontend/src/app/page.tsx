'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSalesOrders, clearCurrentOrder } from '@/redux/slices/salesOrderSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import OrdersTable from '@/components/orders/OrdersTable';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orders, loading, error } = useAppSelector((state) => state.salesOrders);

  useEffect(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  const handleAddNew = () => {
    dispatch(clearCurrentOrder());
    router.push(ROUTES.NEW_ORDER);
  };

  const handleOrderClick = (orderId: number) => {
    router.push(ROUTES.EDIT_ORDER(orderId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <ErrorMessage
          title="Error Loading Orders"
          message={error}
          onRetry={() => dispatch(fetchSalesOrders())}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card
          title="Sales Order Management"
          subtitle="Manage and track all your sales orders in one place"
          actions={<Button onClick={handleAddNew} size="lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Order
          </Button>}
          className="mb-6" children={undefined}        >
          {/* Empty - Actions in header */}
        </Card>

        {/* Orders Table */}
        <Card>
          <OrdersTable orders={orders} onOrderClick={handleOrderClick} />
        </Card>

        {/* Instructions */}
        {orders.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Tip:</span> Double-click on any order row to view or edit the order details.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}