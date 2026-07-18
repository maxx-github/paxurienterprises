import { prisma } from "@/lib/prisma"; // ⚠️ Adjust this import path if your Prisma client is located elsewhere
import { Prisma } from "@prisma/client";
import Link from "next/link";

// 1. Define the exact shape of the data we are fetching from Prisma
type ApplicationWithJob = Prisma.LabourApplicationGetPayload<{
  include: { job: true };
}>;

type ProfileWithDetails = Prisma.LabourProfileGetPayload<{
  include: {
    user: true;
    applications: {
      include: { job: true };
    };
  };
}> | null;

export default async function LabourDashboardPage() {
  // 2. Apply the strict types to your variables (This fixes your build error)
  let profile: ProfileWithDetails = null;
  let applications: ApplicationWithJob[] = [];

  try {
    // ⚠️ NOTE: You likely need a `where` clause here to fetch the specific logged-in user's profile.
    // Example: where: { userId: session.user.id }
    profile = await prisma.labourProfile.findFirst({
      include: {
        user: true,
        applications: {
          include: { job: true },
        },
      },
    });

    if (profile) {
      applications = profile.applications;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }

  // 3. Handle the UI if the user doesn't have a profile yet
  if (!profile) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="mt-2 text-gray-600">Please complete your labour profile to view your dashboard.</p>
        <Link href="/profile" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Profile
        </Link>
      </div>
    );
  }

  // 4. Render the main dashboard UI
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Labour Dashboard</h1>
      
      {/* Profile Summary Section */}
      <section className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
        <p><strong>Name:</strong> {profile.user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {profile.user?.email || "N/A"}</p>
        {/* Add other profile fields here */}
      </section>

      {/* Applications List Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">My Job Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li key={app.id} className="border p-4 rounded hover:bg-gray-50">
                <h3 className="font-bold text-lg">{app.job?.title || "Unknown Job"}</h3>
                <p className="text-gray-600">Status: <span className="font-medium">{app.status}</span></p>
                <p className="text-gray-500 text-sm">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}