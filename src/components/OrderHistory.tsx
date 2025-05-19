
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

type OrderItem = {
  id: string;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
};

type Order = {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

export default function OrderHistory() {
  const { user, getUserOrders } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (user) {
        try {
          const userOrders = await getUserOrders();
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, getUserOrders]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading your orders...</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in to view your order history.</p>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You haven't placed any orders yet.</p>
        </CardContent>
      </Card>
    );
  }

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              // Calculate order totals
              const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
              const totalPrice = order.order_items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
              
              return (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{totalItems}</TableCell>
                    <TableCell>${totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {/* Show order details when expanded */}
                  {expandedOrderId === order.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-gray-50">
                        <div className="px-4 py-2">
                          <h4 className="text-sm font-medium mb-2">Order Items</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product ID</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.order_items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.product_id}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>${item.price_at_purchase.toFixed(2)}</TableCell>
                                  <TableCell>${(item.price_at_purchase * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
