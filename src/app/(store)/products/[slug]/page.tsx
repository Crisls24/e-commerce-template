export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
          Product image
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Product Name</h1>
            <p className="text-2xl font-bold mt-2">$0.00</p>
          </div>
          <div className="text-muted-foreground">
            <p>Product description will appear here.</p>
          </div>
          <button className="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
