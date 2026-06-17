import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const ingredients = [
    {
        name: "Curcumin",
        image: "/curcumin-supplement-bottle.png",
        searchParams: "curcumin",
    },
    {
        name: "Ashwagandha",
        image: "/ashwagandha-supplement.png",
        searchParams: "ashwagandha",
    },
    {
        name: "Omega-3",
        image: "/omega-3-fish-oil-bottle.png",
        searchParams: "omega-3",
    },
    {
        name: "Vitamin D3",
        image: "/vitamin-d3-supplement.png",
        searchParams: "vitamin d",
    },
    {
        name: "CoQ10",
        image: "/coq10-supplement.png",
        searchParams: "coq10",
    },
    {
        name: "Magnesium",
        image: "/magnesium-supplement.png",
        searchParams: "magnesium",
    },
    {
        name: "Probiotics",
        image: "/probiotic-supplement.png",
        searchParams: "probiotic",
    },
    {
        name: "Iron",
        image: "/iron-supplement.png",
        searchParams: "iron",
    },
    {
        name: "Berberine",
        image: "/berberine-supplement.png",
        searchParams: "berberine",
    },
    {
        name: "Ginger",
        image: "/ginger-supplement.png",
        searchParams: "ginger",
    },
]

export function IngredientsCarousel() {
    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-2 md:space-y-4 mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-emerald-900">Shop by Ingredients</h2>
                    <p className="text-base md:text-lg text-muted-foreground">Explore our premium botanicals and nutrients</p>
                </div>

                {/* Wrapper: no horizontal margin on mobile to prevent clipping; controlled on md+ */}
                <div className="relative mx-0 md:mx-12">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {ingredients.map((ingredient, index) => (
                                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/5">
                                    <Link href={`/products?search=${ingredient.searchParams}`}>
                                        <div className="group cursor-pointer">
                                            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                                                <CardContent className="p-2 md:p-4 flex flex-col items-center justify-center space-y-2 md:space-y-4">
                                                    <div className="relative w-full aspect-[3/4] flex items-center justify-center bg-gray-50 rounded-lg p-2 md:p-4 group-hover:bg-emerald-50 transition-colors duration-300">
                                                        <Image
                                                            src={ingredient.image}
                                                            alt={ingredient.name}
                                                            width={200}
                                                            height={300}
                                                            className="object-contain h-full w-auto mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <h3 className="text-emerald-900 font-semibold text-sm md:text-lg group-hover:text-emerald-700 transition-colors text-center leading-tight">
                                                        {ingredient.name}
                                                    </h3>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {/* Show prev/next on all screens but only visually on md+ */}
                        <CarouselPrevious className="hidden md:flex -left-12 border-emerald-200 text-emerald-900 hover:bg-emerald-50 hover:text-emerald-700" />
                        <CarouselNext className="hidden md:flex -right-12 border-emerald-200 text-emerald-900 hover:bg-emerald-50 hover:text-emerald-700" />
                    </Carousel>
                    {/* Mobile swipe hint */}
                    <p className="md:hidden text-center text-xs text-muted-foreground mt-3 opacity-60">Swipe to explore →</p>
                </div>
            </div>
        </section>
    )
}
