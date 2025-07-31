import React, { useState, useEffect, useCallback } from "react";
import { Affirmation } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Loader2 } from "lucide-react";

export default function AffirmationCard() {
  const [affirmation, setAffirmation] = useState(null);
  const [allAffirmations, setAllAffirmations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const fetchAffirmations = async () => {
      try {
        const affirmations = await Affirmation.list();
        if (affirmations.length > 0) {
          setAllAffirmations(affirmations);
          setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
        }
      } catch (error) {
        console.error("Error fetching affirmations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAffirmations();
  }, []);

  const showNewAffirmation = useCallback(() => {
    if (allAffirmations.length === 0) return;

    setIsChanging(true);
    setTimeout(() => {
      let newAffirmation;
      do {
        newAffirmation = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
      } while (newAffirmation.id === affirmation?.id && allAffirmations.length > 1);
      
      setAffirmation(newAffirmation);
      setIsChanging(false);
    }, 300);
  }, [allAffirmations, affirmation]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Daily Wisdom</h2>
        <Card className="bg-card border-border flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </Card>
      </div>
    );
  }

  if (!affirmation) {
    return null; // Don't render if no affirmations are found
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Daily Wisdom</h2>
      <Card 
        className="bg-black/20 backdrop-blur-md border border-white/10"
        style={{
          boxShadow: '0 0 20px rgba(127, 179, 211, 0.1)',
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-6 h-6 text-highlight" />
            </div>
            <div className="flex-grow">
              <p 
                className={`text-white/90 italic transition-opacity duration-300 ${isChanging ? 'opacity-0' : 'opacity-100'}`}
                style={{ fontFamily: "'Lora', serif" }} // Using an elegant serif font
              >
                "{affirmation.text}"
              </p>
            </div>
            <Button
              onClick={showNewAffirmation}
              size="sm"
              className="bg-highlight/80 hover:bg-highlight text-white rounded-full px-4 py-2 text-xs font-medium"
            >
              Encourage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}