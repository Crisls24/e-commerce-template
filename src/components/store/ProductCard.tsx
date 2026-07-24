import { Card, CardContent } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images?: any;
  stockQuantity?: number | null;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  images,
  stockQuantity,
}: ProductCardProps) {
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const inStock = !stockQuantity || stockQuantity > 0;

  return (
    <Link href={`/products/${slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-square bg-muted relative overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.alt || name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold">{formatCurrency(price)}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(comparePrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
