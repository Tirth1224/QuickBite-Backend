import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
  },
  cartItems: [
    {
      menuItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  // totalAmount: Number,
  totalAmount: { type: Number, required: false },
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

// import mongoose from "mongoose";

// // Define the Order schema with added paymentStatus field
// const orderSchema = new mongoose.Schema({
//   restaurant: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Restaurant",
//     required: true,
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   deliveryDetails: {
//     email: { type: String, required: true },
//     name: { type: String, required: true },
//     addressLine1: { type: String, required: true },
//     city: { type: String, required: true },
//   },
//   cartItems: [
//     {
//       menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
//       quantity: { type: Number, required: true, min: 1 },
//       name: { type: String, required: true },
//     },
//   ],
//   totalAmount: { type: Number, required: true, min: 0 },
//   status: {
//     type: String,
//     enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
//     default: "placed",
//   },
//   paymentStatus: {
//     type: String,
//     enum: ["pending", "paid"],
//     default: "pending",
//   },
//   createdAt: { type: Date, default: Date.now },
//   razorpay_order_id: { type: String, required: true },
//   razorpay_payment_id: { type: String },
//   razorpay_signature: { type: String },
// });

// // Create and export the Order model
// const Order = mongoose.model("Order", orderSchema);
// export default Order;
