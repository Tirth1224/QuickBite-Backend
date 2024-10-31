import Razorpay from "razorpay";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay key ID or key secret not provided.");
}

const RAZORPAY = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const FRONTEND_URL = process.env.FRONTEND_URL as string;

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );
    const order = await CreateOrder(
      lineItems,
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!order) {
      return res
        .status(500)
        .json({ message: "Unable to create order with Razorpay." });
    }

    // Include the restaurant name in the response
    res.json({ id: order.id, restaurantName: restaurant.restaurantName });
  } catch (error: any) {
    console.error("Checkout session error:", error);
    res.status(500).json({
      message:
        error.message ||
        "An error occurred while creating the checkout session.",
    });
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  return checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId
    );
    if (!menuItem)
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);

    return {
      name: menuItem.name,
      amount: parseInt(menuItem.price) * 100,
      currency: "INR",
      quantity: parseInt(cartItem.quantity),
    };
  });
};

const CreateOrder = async (
  lineItems: any[],
  deliveryPrice: number,
  restaurantId: string
) => {
  const totalAmount = lineItems.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    deliveryPrice * 100
  );

  return RAZORPAY.orders.create({
    amount: totalAmount,
    currency: "INR",
    receipt: `receipt_${restaurantId}`,
    notes: { restaurantId },
  });
};

export default { createCheckoutSession };
