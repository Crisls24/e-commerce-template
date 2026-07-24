import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          <ShoppingBag className="h-4 w-4" />
          Welcome to your store
        </div>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Everything you need,
          <br />
          <span className="text-muted-foreground">all in one place</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our curated collection of products. Quality, style, and
          convenience — all in one place.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-2"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Admin Panel
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
        <div className="space-y-2">
          <h3 className="font-semibold">Free Shipping</h3>
          <p className="text-sm text-muted-foreground">
            On orders over $50
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Secure Payments</h3>
          <p className="text-sm text-muted-foreground">
            Powered by Stripe
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">24/7 Support</h3>
          <p className="text-sm text-muted-foreground">
            We&apos;re here to help
          </p>
        </div>
      </div>
    </div>
  );
}
