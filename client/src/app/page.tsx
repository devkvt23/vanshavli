'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ResultsChart from '@/components/ResultsChart';
import PopulationMap from '@/components/PopulationMap';
import { apiService, Population, AnalysisResult } from '@/services/api';
import dynamic from 'next/dynamic';
import { DnaUpload } from "@/components/DnaUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('@/components/PopulationMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100 animate-pulse" />
  ),
});

export default function Home() {
  const [populations, setPopulations] = useState<Population[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    loadPopulations();
  }, []);

  const loadPopulations = async () => {
    try {
      const data = await apiService.populations.getAll();
      setPopulations(data);
    } catch (error) {
      toast.error("Failed to load populations");
    }
  };

  const handleCalculate = async () => {
    if (!selectedTarget || !selectedSource) {
      toast.error("Please select both target population and source dataset");
      return;
    }

    setLoading(true);
    try {
      const results = await apiService.analysis.calculateAdmixture({
        targetPopulation: selectedTarget,
        sourceDataset: selectedSource
      });
      setResults(results);
      toast.success("Analysis completed");
    } catch (error) {
      toast.error("Failed to complete analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Vanshavali - Your DNA Story Explorer
      </h1>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Population Map</TabsTrigger>
          <TabsTrigger value="upload">Upload DNA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Population Map</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicMap 
                populations={populations}
                selectedPopulation={selectedTarget}
                onPopulationSelect={setSelectedTarget}
              />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>DNA Analysis Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="target" className="text-sm font-medium text-gray-700">
                  Target Population
                </label>
                <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target population" />
                  </SelectTrigger>
                  <SelectContent>
                    {populations.map((pop) => (
                      <SelectItem key={pop._id} value={pop._id}>
                        {pop.name} ({pop.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="source" className="text-sm font-medium text-gray-700">
                  Source Dataset
                </label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze_age">Bronze Age</SelectItem>
                    <SelectItem value="paleolithic">Paleolithic Age</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full"
                onClick={handleCalculate}
                disabled={loading || !selectedTarget || !selectedSource}
              >
                {loading ? 'Analyzing...' : 'Run Admixture Model'}
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-700">
                    Genetic Distance: <span className="font-medium">{results.geneticDistance.toFixed(4)}</span>
                  </p>
                </div>
                
                <div className="mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">Source</th>
                        <th className="py-2 px-4 text-left">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.proportions.map((prop, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-4">{prop.source}</td>
                          <td className="py-2 px-4">{prop.percentage.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mb-6">
                  <ResultsChart proportions={results.proportions} />
                </div>

                <Button 
                  variant="secondary"
                  onClick={() => {
                    const text = `Genetic Distance: ${results.geneticDistance.toFixed(4)}\n\n` +
                      results.proportions.map(p => `${p.source}: ${p.percentage.toFixed(2)}%`).join('\n');
                    navigator.clipboard.writeText(text);
                    toast.success("Results copied to clipboard");
                  }}
                >
                  Copy Results
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="max-w-2xl mx-auto">
            <DnaUpload />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
