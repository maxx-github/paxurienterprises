// src/app/admin/activity-logs/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, User, ShoppingCart, FileText, Briefcase } from "lucide-react";

// Mock data (In production, replace with Prisma query to ActivityLog table)
const mockLogs = [
  { id: 1, action: "Updated Product Price", target: "Bamburi Cement (50kg)", user: "Admin John", time: "2 mins ago", icon: ShoppingCart, color: "text-blue-600" },
  { id: 2, action: "Approved Job Application", target: "Senior Mason - Karen", user: "Staff Mary", time: "15 mins ago", icon: Briefcase, color: "text-purple-600" },
  { id: 3, action: "Viewed Quotation Request", target: "Q-105 Commercial Block", user: "Admin John", time: "1 hour ago", icon: FileText, color: "text-green-600" },
  { id: 4, action: "Logged In", target: "Admin Dashboard", user: "Admin John", time: "2 hours ago", icon: User, color: "text-gray-600" },
  { id: 5, action: "Deleted Tender", target: "Old Kiambu Project", user: "Super Admin", time: "Yesterday", icon: FileText, color: "text-red-600" },
];
// Add this at the very top of the file, after imports
export const dynamic = 'force-dynamic';
export default function ActivityLogsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" /> Activity Logs
        </h1>
        <p className="text-gray-600 mt-1">Track administrative actions and system events for security and auditing.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-grey-dark">
            {mockLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-grey/50 transition-colors">
                <div className={`p-2 rounded-full bg-grey ${log.color}`}>
                  <log.icon className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-dark">
                    {log.action} <span className="text-gray-500 font-normal">on</span> {log.target}
                  </p>
                  <p className="text-xs text-gray-400">by {log.user}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}