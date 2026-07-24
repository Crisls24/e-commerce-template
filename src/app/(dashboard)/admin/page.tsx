import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

const stats = [
  { title: "Revenue", value: "$0.00", icon: DollarSign, change: "+0%" },
  { title: "Orders", value: "0", icon: ShoppingCart, change: "+0%" },
  { title: "Products", value: "0", icon: Package, change: "+0" },
  { title: "Customers", value: "0", icon: Users, change: "+0" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here&apos;s your store overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No orders yet. Share your store to start selling!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add products to see your best sellers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
