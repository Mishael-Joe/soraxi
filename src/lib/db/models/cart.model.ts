import mongoose, { Schema, type Document, type Model } from "mongoose";
import { connectToDatabase } from "../mongoose";

/**
 * Interface for a single item in the cart
 * Each item holds a product reference, quantity, and optional size details.
 */
export interface ICartItem {
  product: mongoose.Types.ObjectId;
  storeID: mongoose.Types.ObjectId;
  quantity: number;
  productType: "Product" | "digitalproducts";
  selectedSize?: {
    size: string;
    price: number;
    quantity: number;
  };
}

/**
 * Interface for the Cart document
 * Represents a user's shopping cart with polymorphic product support.
 */
export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for a single cart item
 * Supports products from different stores and types, with optional sizing.
 */
const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      refPath: "items.productType", // Dynamic reference based on productType
      required: true,
    },
    storeID: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ["Product", "digitalproducts"],
    },
    selectedSize: {
      size: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  },
  { _id: false } // Prevents Mongoose from auto-creating an _id for subdocuments
);

/**
 * Mongoose schema for the Cart
 * Associates a single cart with a user and their product selections.
 */
const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

/**
 * Get the Cart model
 * Uses a cached model if available to avoid re-compilation in development
 *
 * @returns Mongoose Cart model
 */
export async function getCartModel(): Promise<Model<ICart>> {
  await connectToDatabase();

  return (
    (mongoose.models.Cart as Model<ICart>) ||
    mongoose.model<ICart>("Cart", CartSchema)
  );
}

/**
 * Get cart by user ID
 *
 * @param userId - MongoDB ObjectId of the user
 * @param lean - Whether to return a lean plain object
 * @returns Cart document or plain object
 */
export async function getCartByUserId(
  userId: string,
  lean = false
): Promise<ICart | null> {
  await connectToDatabase();
  const Cart = await getCartModel();

  return lean
    ? Cart.findOne<ICart>({ user: userId }).lean()
    : Cart.findOne<ICart>({ user: userId });
}

/**
 * Get cart by document ID
 *
 * @param id - MongoDB ObjectId of the cart document
 * @param lean - Whether to return a lean plain object
 * @returns Cart document or plain object
 */
export async function getCartById(
  id: string,
  lean = false
): Promise<ICart | null> {
  await connectToDatabase();
  const Cart = await getCartModel();

  return lean ? Cart.findById<ICart>(id).lean() : Cart.findById<ICart>(id);
}

/**
 * Add an item to a user's cart
 *
 * If the item (same product ID and selected size) already exists, its quantity is increased.
 *
 * @param userId - User's ObjectId
 * @param newItem - Item to add
 */
export async function addItemToCart(
  userId: string,
  newItem: ICartItem
): Promise<ICart | null> {
  await connectToDatabase();
  const Cart = await getCartModel();

  // const query = {
  //   user: userId,
  //   "items.product": newItem.product,
  //   ...(newItem.selectedSize?.size && {
  //     "items.selectedSize.size": newItem.selectedSize.size,
  //   }),
  // };

  const existingCart = await Cart.findOne<ICart>({ user: userId });

  if (!existingCart) {
    // Create new cart
    return await Cart.create({
      user: userId,
      items: [newItem],
    });
  }

  const itemIndex = existingCart.items.findIndex(
    (item) =>
      item.product.toString() === newItem.product.toString() &&
      item.productType === newItem.productType &&
      item.storeID.toString() === newItem.storeID.toString() &&
      item.selectedSize?.size === newItem.selectedSize?.size
  );

  if (itemIndex > -1) {
    // If item exists, update quantity
    existingCart.items[itemIndex].quantity += newItem.quantity;
  } else {
    // If not, add new item
    existingCart.items.push(newItem);
  }

  return await existingCart.save();
}

/**
 * Remove an item from a user's cart
 *
 * Removes based on product ID and (optionally) size if provided.
 *
 * @param userId - User's ObjectId
 * @param productId - ID of the product to remove
 * @param size - Optional size if item has variants
 */
export async function removeItemFromCart(
  userId: string,
  productId: string,
  size?: string
): Promise<ICart | null> {
  await connectToDatabase();
  const Cart = await getCartModel();

  const updateQuery = size
    ? { $pull: { items: { product: productId, "selectedSize.size": size } } }
    : { $pull: { items: { product: productId } } };

  return await Cart.findOneAndUpdate<ICart>({ user: userId }, updateQuery, {
    new: true,
  });
}

/**
 * Update quantity of a specific item in the user's cart
 *
 * @param userId - User's ObjectId
 * @param productId - ID of the product
 * @param quantity - New quantity to set
 * @param size - Optional size if applicable
 */
export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number,
  size?: string
): Promise<ICart | null> {
  await connectToDatabase();
  const Cart = await getCartModel();

  const cart = await Cart.findOne<ICart>({ user: userId });
  if (!cart) return null;

  const item = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      (!size || item.selectedSize?.size === size)
  );

  if (!item) return null;

  item.quantity = quantity;

  return await cart.save();
}
