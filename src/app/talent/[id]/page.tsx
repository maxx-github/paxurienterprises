// src/app/talent/[id]/page.tsx
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, Mail, Phone, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ✅ CRITICAL: Prevents Vercel from statically generating this page
export const dynamic = "force-dynamic";

export default async function PublicTalentProfile({ params }: { params: { id: string } }) {
  // Fetch the specific talent profile and their linked user data
  const profile = await prisma.labourProfile.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: { name: true, email: true, phone: true }
      }
    }
  });

  // If no profile is found with this ID, show a clean 404 page
  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-grey py-12">
      <div className="content-wrapper max-w-4xl mx-auto px-4">
        
        {/* Back Button */}
        <Link href="/talent" className="text-sm text-gray-500 hover:text-primary mb-6 inline-flex items-center gap-1 transition-colors">
          ← Back to all talent
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar / Initials */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl shrink-0">
              {profile.user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Name & Details */}
            <div className="flex-1">
              <h1 className="text-3xl font-heading font-bold text-dark">{profile.user.name}</h1>
              <p className="text-lg text-primary font-semibold mt-1">
                {profile.skill.replace(/_/g, " ")}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.county}</span>
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {profile.yearsExperience} Years Experience</span>
                {profile.isAvailable && (
                  <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-4 w-4" /> Available for Hire
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button variant="primary" asChild className="w-full sm:w-auto">
                <a href={`mailto:${profile.user.email}`}>
                  <Mail className="h-4 w-4 mr-2" /> Contact Fundi
                </a>
              </Button>
              {profile.user.phone && (
                <Button variant="secondary" asChild className="w-full sm:w-auto">
                  <a href={`tel:${profile.user.phone}`}>
                    <Phone className="h-4 w-4 mr-2" /> Call
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Rates Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Rates
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Daily Rate</span>
                <span className="font-bold text-dark">KES {profile.dailyRate.toLocaleString()}</span>
              </div>
              {profile.monthlyRate && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Monthly Rate</span>
                  <span className="font-bold text-dark">KES {profile.monthlyRate.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="break-all">{profile.user.email}</span>
              </div>
              {profile.user.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>{profile.user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificates Section (Only shows if they exist) */}
        {profile.certUrls && profile.certUrls.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Certifications & Documents
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.certUrls.map((url, index) => (
                <Button key={index} variant="secondary" size="sm" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> View Certificate {index + 1}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}