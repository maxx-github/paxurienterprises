"use client";

import { useRef, useEffect } from "react";
import { useActionState } from "react"; // React 19 standard (replaces useFormState)
import { createProduct } from "@/features/catalogue/actions/create-product";
import Link from "next/link";

export default function CreateProductPage() {
  const [state, formAction, isPending] = useActionState(createProduct, null);
  
  const formRef = useRef<HTMLFormElement>(null);

  // Automatically reset the form when the submission is successful
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <Link href="/admin/products" className="text-sm text-gray-600 hover:text-gray-900 underline">
          ← Back to Products
        </Link>
      </div>

      <form 
        ref={formRef}
        action={formAction} 
        className="space-y-5 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="e.g., Basco Emulsion White"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            id="category"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select a category...</option>
            <option value="CONSTRUCTION_MATERIALS">Construction Materials</option>
            <option value="FINISHING_MATERIALS">Finishing Materials</option>
          </select>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (KES) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              id="price"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              min="0"
              required
              placeholder="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            placeholder="Enter product details..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            Product Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="images"
            id="images"
            accept="image/jpeg, image/png, image/webp"
            multiple
            required
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">
            Accepted: JPG, PNG, WEBP. Max size: 5MB per image. You can select multiple.
          </p>
        </div>

        {/* Feedback Messages */}
        {state && !state.success && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600">{state.message}</p>
          </div>
        )}

        {state && state.success && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Success!</p>
            <p className="text-sm text-green-600">{state.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}