// import Razorpay from "razorpay";
// import { Request, Response } from "express";
// import Restaurant, { MenuItemType } from "../models/restaurant";
// import { error } from "console";

// const RAZORPAY = new (Razorpay as any)({
//   key_id: process.env.RAZORPAY_KEY_ID as string,
//   key_secret: process.env.RAZORPAY_KEY_SECRET as string,
// });

// const FRONTEND_URL = process.env.FRONTEND_URL as string;

// type CheckoutSessionRequest = {
//   cartItems: {
//     menuItemId: string;
//     name: string;
//     quantity: string;
//   }[];
//   deliveryDetails: {
//     email: string;
//     name: string;
//     addressLine1: string;
//     city: string;
//   };
//   restaurantId: string;
// };

// const createCheckoutSession = async (req: Request, res: Response) => {
//   try {
//     const checkoutSessionRequest: CheckoutSessionRequest = req.body;

//     const restaurant = await Restaurant.findById(
//       checkoutSessionRequest.restaurantId
//     );

//     if (!restaurant) {
//       throw new Error("Restaurant not found");
//     }
//     const lineItems = createLineItems(
//       checkoutSessionRequest,
//       restaurant.menuItems
//     );

//     const session = await CreateSession(
//       lineItems,
//       "TEST_ORDER_ID",
//       restaurant.deliveryPrice,
//       restaurant._id.toString()
//     );

//     if (!session.url) {
//       return res
//         .status(500)
//         .json({ message: "Error creating razorpay session" });
//     }

//     res.json({ url: session.url });
//   } catch (error: any) {
//     console.log(error);
//     res.status(500).json({ message: error.raw.message });
//   }
// };

// const createLineItems = (
//   checkoutSessionRequest: CheckoutSessionRequest,
//   menuItems: MenuItemType[]
// ) => {
//   const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
//     const menuItem = menuItems.find(
//       (item) => item._id.toString() === cartItem.menuItemId.toString()
//     );

//     if (!menuItem) {
//       throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
//     }

//     // const line_item: Razorpay.RazorpayLineItem = {
//     //   price_data: {
//     //     currency: "inr",
//     //     unit_amount: menuItem.price,
//     //     product__Data: {
//     //       name: menuItem.name,
//     //     },
//     //   },
//     //   quantity: parseInt(cartItem.quantity),
//     // };
//     // return line_item;

//     interface RazorpayLineItem {
//       price_data: {
//         currency: string;
//         unit_amount: string;
//         product_data: {
//           name: string;
//         };
//       };
//       quantity: number;
//     }

//     const line_item: RazorpayLineItem = {
//       price_data: {
//         currency: "inr",
//         unit_amount: menuItem.price,
//         product_data: {
//           name: menuItem.name,
//         },
//       },
//       quantity: parseInt(cartItem.quantity),
//     };

//     return line_item;
//   });

//   return lineItems;
// };

// interface RazorpayLineItem {
//   price_data: {
//     currency: string;
//     unit_amount: string;
//     product_data: {
//       name: string;
//     };
//   };
//   quantity: number;
// }

// const CreateSession = async (
//   lineItems: RazorpayLineItem[],
//   orderId: string,
//   deliveryPrice: number,
//   restaurantId: string
// ) => {
//   const sessionData = await RAZORPAY.checkout.sessions.create({
//     line_items: lineItems,
//     shipping_options: [
//       {
//         shipping_rate_data: {
//           display_name: "Delivery",
//           type: "fixed_amount",
//           fixed_amount: {
//             amount: deliveryPrice,
//             currency: "inr",
//           },
//         },
//       },
//     ],
//     mode: "payment",
//     metadata: {
//       orderId,
//       restaurantId,
//     },
//     success_url: `${FRONTEND_URL}/order-status?success=true`,
//     cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
//   });
//   return sessionData;
// };

// export default {
//   createCheckoutSession,
// };

// import Razorpay from "razorpay";
// import { Request, Response } from "express";
// import Restaurant, { MenuItemType } from "../models/restaurant";

// const RAZORPAY = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID as string,
//   key_secret: process.env.RAZORPAY_KEY_SECRET as string,
// });

// const FRONTEND_URL = process.env.FRONTEND_URL as string;

// type CheckoutSessionRequest = {
//   cartItems: {
//     menuItemId: string;
//     name: string;
//     quantity: string;
//   }[];
//   deliveryDetails: {
//     email: string;
//     name: string;
//     addressLine1: string;
//     city: string;
//   };
//   restaurantId: string;
// };

// // const createCheckoutSession = async (req: Request, res: Response) => {
// //   try {
// //     const checkoutSessionRequest: CheckoutSessionRequest = req.body;

// //     const restaurant = await Restaurant.findById(
// //       checkoutSessionRequest.restaurantId
// //     );

// //     if (!restaurant) {
// //       return res.status(404).json({ message: "Restaurant not found" });
// //     }

// //     const lineItems = createLineItems(
// //       checkoutSessionRequest,
// //       restaurant.menuItems
// //     );

// //     const order = await CreateOrder(
// //       lineItems,
// //       restaurant.deliveryPrice,
// //       restaurant._id.toString()
// //     );

// //     if (!order) {
// //       return res.status(500).json({ message: "Error creating Razorpay order" });
// //     }

// //     res.json({ orderId: order.id });
// //   } catch (error: any) {
// //     console.error(error);
// //     res.status(500).json({ message: error.message || "Internal server error" });
// //   }
// // };

// const createCheckoutSession = async (req: Request, res: Response) => {
//   try {
//     const checkoutSessionRequest: CheckoutSessionRequest = req.body;

//     const restaurant = await Restaurant.findById(
//       checkoutSessionRequest.restaurantId
//     );
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found." }); // Improved error message
//     }

//     const lineItems = createLineItems(
//       checkoutSessionRequest,
//       restaurant.menuItems
//     );
//     const order = await CreateOrder(
//       lineItems,
//       restaurant.deliveryPrice,
//       restaurant._id.toString()
//     );

//     if (!order) {
//       return res
//         .status(500)
//         .json({ message: "Unable to create order with Razorpay." }); // Improved error message
//     }

//     res.json({ orderId: order.id });
//   } catch (error: any) {
//     console.error("Checkout session error:", error); // Logging error
//     res
//       .status(500)
//       .json({
//         message:
//           error.message ||
//           "An error occurred while creating the checkout session.",
//       }); // Improved error message
//   }
// };

// const createLineItems = (
//   checkoutSessionRequest: CheckoutSessionRequest,
//   menuItems: MenuItemType[]
// ) => {
//   return checkoutSessionRequest.cartItems.map((cartItem) => {
//     const menuItem = menuItems.find(
//       (item) => item._id.toString() === cartItem.menuItemId.toString()
//     );

//     if (!menuItem) {
//       throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
//     }

//     return {
//       name: menuItem.name,
//       amount: parseInt(menuItem.price) * 100, // Razorpay expects amount in smallest currency unit (e.g., paise)
//       currency: "INR",
//       quantity: parseInt(cartItem.quantity),
//     };
//   });
// };

// const CreateOrder = async (
//   lineItems: any[],
//   deliveryPrice: number,
//   restaurantId: string
// ) => {
//   const totalAmount = lineItems.reduce(
//     (sum, item) => sum + item.amount * item.quantity,
//     deliveryPrice * 100 // Add delivery price in smallest currency unit
//   );

//   return RAZORPAY.orders.create({
//     amount: totalAmount,
//     currency: "INR",
//     receipt: `receipt_${restaurantId}`,
//     notes: {
//       restaurantId,
//     },
//   });
// };

// export default {
//   createCheckoutSession,
// };

import Razorpay from "razorpay";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";

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

// const createCheckoutSession = async (req: Request, res: Response) => {
//   try {
//     const checkoutSessionRequest: CheckoutSessionRequest = req.body;
//     const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found." });
//     }

//     const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);
//     const order = await CreateOrder(lineItems, restaurant.deliveryPrice, restaurant._id.toString());

//     if (!order) {
//       return res.status(500).json({ message: "Unable to create order with Razorpay." });
//     }

//     res.json({ id: order.id });
//   } catch (error: any) {
//     console.error("Checkout session error:", error);
//     res.status(500).json({
//       message: error.message || "An error occurred while creating the checkout session.",
//     });
//   }
// };

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
