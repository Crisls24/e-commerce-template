import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button, Input } from "@/components/ui";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your store</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Name</label>
            <Input placeholder="My Store" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input placeholder="An amazing store" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input placeholder="USD" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax Rate (%)</label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
