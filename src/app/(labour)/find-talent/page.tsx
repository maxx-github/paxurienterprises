// src/app/(labour)/find-talent/page.tsx
import Link from "next/link";
import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

// Mock data for development fallback
const mockFundis = [
  { id: "1", user: { name: "John Kamau" }, skill: "MASON", county: "Nairobi", yearsExperience: 8, dailyRate: 2000, isAvailable: true },
  { id: "2", user: { name: "Mary Wanjiku" }, skill: "QUANTITY_SURVEYOR", county: "Kiambu", yearsExperience: 5, dailyRate: 5000, isAvailable: true },
  { id: "3", user: { name: "David Ochieng" }, skill: "ELECTRICIAN", county: "Mombasa", yearsExperience: 10, dailyRate: 2500, isAvailable: false },
  { id: "4", user: { name: "Peter Mwangi" }, skill: "CARPENTER", county: "Nairobi", yearsExperience: 6, dailyRate: 1800, isAvailable: true },
];

export default async function FindTalentPage({ searchParams }: { searchParams: { skill?: string; search?: string } }) {
  const skill = (searchParams.skill || "") as string;
  const search = (searchParams.search || "") as string;

  let fundis: any[] = [];
  let isMock = false;

  try {
    // 1. Try to fetch from Database
    const dbFundis = await prisma.labourProfile.findMany({
      where: {
        isAvailable: true,
        ...(skill && { skill: skill as any }),
        ...(search && {
          OR: [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { county: { contains: search, mode: "insensitive" } },
          ]
        })
      },
      include: { user: true },
      orderBy: { yearsExperience: "desc" },
    });
    
    if (dbFundis.length > 0) {
      fundis = dbFundis;
    } else {
      isMock = true;
    }
  } catch (error) {
    isMock = true; // Fallback to mock if DB fails
  }

  // 2. If using mock data, we MUST filter it manually based on searchParams
  if (isMock) {
    fundis = mockFundis.filter((f) => {
      const matchesSkill = !skill || f.skill === skill;
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        f.user.name.toLowerCase().includes(searchLower) || 
        f.county.toLowerCase().includes(searchLower);
      
      return matchesSkill && matchesSearch;
    });
  }

  const skills = ["MASON", "CARPENTER", "ELECTRICIAN", "PLUMBER", "FOREMAN", "QUANTITY_SURVEYOR"];

  return (
    <div className="min-h-screen bg-grey py-12 md:py-20">
      <div className="content-wrapper">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">Find Skilled Talent</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Browse our vetted database of professional construction workers and hire the right talent for your project.</p>
        </div>

        {/* Filters Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  name="search" 
                  defaultValue={search} 
                  placeholder="Search by name or county..." 
                  className="pl-10" 
                />
              </div>
              <select 
                name="skill" 
                defaultValue={skill} 
                className="flex w-full md:w-64 rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Skills</option>
                {skills.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
              <Button type="submit" variant="primary">Filter</Button>
            </form>
          </CardContent>
        </Card>

        {/* Talent Grid or Empty State */}
        {fundis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundis.map((fundi: any) => {
              const fundiName = fundi.user?.name || fundi.name || "Unknown Fundi";
              return (
                <Card key={fundi.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl shrink-0">
                      {fundiName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{fundiName}</CardTitle>
                      <p className="text-sm text-primary font-semibold">{fundi.skill.replace('_', ' ')}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {fundi.county}</div>
                      <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> {fundi.yearsExperience || fundi.experience} Years Experience</div>
                      <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> KES {fundi.dailyRate} / day</div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-grey-dark">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${fundi.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {fundi.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/fundis/${fundi.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-grey-dark">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No fundis found matching your search criteria.</p>
            <Button variant="primary" asChild>
              <Link href="/find-talent">Clear Filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}