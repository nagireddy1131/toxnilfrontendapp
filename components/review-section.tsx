"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, CheckCircle, Filter } from "lucide-react"
import { reviews as allReviews, products as legacyProducts } from "@/lib/data"

interface ReviewSectionProps {
  productId: number | string
  productName?: string
  rating: number
  reviewCount: number
}

export function ReviewSection({ productId, productName, rating, reviewCount }: ReviewSectionProps) {
  const [filter, setFilter] = useState<"helpful" | "recent" | "highest">("helpful")

  // Try to find reviews for this product
  // 1. Direct match (if number)
  // 2. Name match (if string/backend ID)
  let productReviews = allReviews.filter((r) => r.productId === productId)

  if (productReviews.length === 0 && productName) {
    const legacyProduct = legacyProducts.find(p => p.name === productName)
    if (legacyProduct) {
      productReviews = allReviews.filter(r => r.productId === legacyProduct.id)
    }
  }

  const sortedReviews = [...productReviews].sort((a, b) => {
    if (filter === "helpful") return b.helpful - a.helpful
    if (filter === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (filter === "highest") return b.rating - a.rating
    return 0
  })

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: productReviews.filter((r) => r.rating === stars).length,
    percentage: (productReviews.filter((r) => r.rating === stars).length / productReviews.length) * 100 || 0,
  }))

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1a4d3e] mb-8 font-playfair">Customer Reviews</h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-[#F5F3F0] border-0">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-[#1a4d3e]">{rating}</div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">Based on {reviewCount.toLocaleString()} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-12">{stars} star</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              {(["helpful", "recent", "highest"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={filter === f ? "bg-[#1a4d3e] hover:bg-[#2d6a5a]" : ""}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>

            {/* Review Cards */}
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review) => (
                <Card key={review.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#1a4d3e]">{review.userName}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{review.content}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#1a4d3e]">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
