"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductTabsProps {
  description: string;
  specifications: string;
  productId: string;
}

// Placeholder rating data
const placeholderReviews = [
  {
    id: "1",
    user: "John D.",
    rating: 5,
    comment: "Excellent product! Exactly as described and fast delivery.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    user: "Sarah M.",
    rating: 4,
    comment: "Good quality, but shipping took a bit longer than expected.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: "3",
    user: "Mike R.",
    rating: 5,
    comment: "Amazing value for money. Highly recommended!",
    date: "2024-01-08",
    verified: false,
  },
];

export function ProductTabs({
  description,
  specifications,
}: // productId,
ProductTabsProps) {
  const renderRichText = (content: string) => {
    return (
      <div
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <Tabs defaultValue="description" className="">
      <TabsList className="w-full border-none p-0 rounded-none h-auto">
        <TabsTrigger
          value="description"
          className="w-fit border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-soraxi-green dark:data-[state=active]:border-b-soraxi-green py-3"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="specifications"
          className="w-fit border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-soraxi-green dark:data-[state=active]:border-b-soraxi-green py-3"
        >
          Specifications
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="w-fit border-0 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-soraxi-green dark:data-[state=active]:border-b-soraxi-green py-3"
        >
          Reviews (24)
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        {description ? (
          renderRichText(description)
        ) : (
          <p className="text-gray-500">
            No description available for this product.
          </p>
        )}
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        {specifications ? (
          renderRichText(specifications)
        ) : (
          <p className="text-gray-500">
            No specifications available for this product.
          </p>
        )}
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  4.2 out of 5 (24 reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${
                        rating === 5
                          ? 60
                          : rating === 4
                          ? 25
                          : rating === 3
                          ? 10
                          : 5
                      }%`,
                    }}
                  />
                </div>
                <span className="w-8 text-gray-600">
                  {rating === 5 ? 15 : rating === 4 ? 6 : rating === 3 ? 2 : 1}
                </span>
              </div>
            ))}
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {placeholderReviews.map((review) => (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {review.comment}
                </p>
              </>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
