// src/app/(projects)/estimator/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function EstimatorPage() {
  const [area, setArea] = useState<number>(100);
  const [floors, setFloors] = useState<number>(1);
  const [finish, setFinish] = useState<string>("standard");

  const estimate = useMemo(() => {
    // Base rates per square meter in KES
    const baseRate = finish === "high" ? 45000 : finish === "standard" ? 35000 : 25000;
    return area * floors * baseRate;
  }, [area, floors, finish]);

  return (
    <div className="min-h-screen bg-grey py-16 md:py-24">
      <div className="content-wrapper max-w-3xl">
        <div className="text-center mb-10">
          <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-2">Project Cost Estimator</h1>
          <p className="text-gray-600 text-lg">Get a preliminary estimate for your construction project.</p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Floor Area (sqm)</label>
                <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Number of Floors</label>
                <Input type="number" value={floors} onChange={(e) => setFloors(Number(e.target.value))} min={1} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Finishing Standard</label>
              <select 
                value={finish} 
                onChange={(e) => setFinish(e.target.value)} 
                className="flex w-full rounded-md border border-grey-dark bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="economic">Economic (Approx. KES 25,000/sqm)</option>
                <option value="standard">Standard (Approx. KES 35,000/sqm)</option>
                <option value="high">High-End (Approx. KES 45,000/sqm)</option>
              </select>
            </div>

            <div className="bg-primary-light p-6 rounded-lg text-center border border-primary/20">
              <p className="text-sm text-primary font-medium mb-1">Estimated Construction Cost</p>
              <p className="text-3xl md:text-4xl font-bold text-dark">
                KES {estimate.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                *This is a rough estimate. Request a formal quote for accurate pricing.
              </p>
            </div>

            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/request-quote">
                Request Formal Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}