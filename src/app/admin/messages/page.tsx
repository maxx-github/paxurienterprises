// src/app/admin/messages/page.tsx
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen, Trash2 } from "lucide-react";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-dark">Contact Inquiries</h1>
        <p className="text-gray-600 mt-1">View and manage messages received from the contact form.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-grey text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} className={`border-b hover:bg-grey/50 ${!msg.isRead ? 'bg-blue-50/50 font-medium' : ''}`}>
                    <td className="px-6 py-4">
                      {msg.isRead ? <MailOpen className="h-5 w-5 text-gray-400" /> : <Mail className="h-5 w-5 text-primary" />}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div>{msg.name}</div>
                      <div className="text-xs text-gray-400">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4 text-dark">{msg.subject}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{msg.message}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}