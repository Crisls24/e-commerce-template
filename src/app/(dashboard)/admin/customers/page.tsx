import { Card, CardContent } from "@/components/ui";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">View your customers</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <Users className="mx-auto h-12 w-12 mb-4" />
            <p>No customers yet. They&apos;ll appear here once people sign up.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
