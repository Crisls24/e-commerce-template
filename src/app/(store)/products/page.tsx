export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Browse our collection
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-sm mb-3">Categories</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Loading categories...</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No products yet. Add some from the admin panel.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
