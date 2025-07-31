import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function SafetyCheckin({ onClose, onEmergencyStop }) {
  const [responses, setResponses] = useState({});

  const questions = [
    { id: 'energy', text: 'How is your energy level?', type: 'scale' },
    { id: 'dizzy', text: 'Are you experiencing dizziness?', type: 'boolean' },
    { id: 'nausea', text: 'Do you feel nauseous?', type: 'boolean' },
    { id: 'headache', text: 'Do you have a headache?', type: 'boolean' },
    { id: 'continue', text: 'Do you feel safe to continue?', type: 'boolean' }
  ];

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const getSafetyScore = () => {
    const { energy = 3, dizzy = false, nausea = false, headache = false, continue: canContinue = true } = responses;
    
    let score = energy; // 1-5 scale
    if (dizzy) score -= 2;
    if (nausea) score -= 2;
    if (headache) score -= 1;
    if (!canContinue) score = 0;
    
    return Math.max(0, score);
  };

  const canSafelyContinue = () => {
    return getSafetyScore() >= 3 && responses.continue !== false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full glass-morphism border-slate-700 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-slate-200">
            Safety Check-In
          </CardTitle>
          <p className="text-slate-400">Please answer these questions honestly</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <p className="text-slate-300 font-medium">{question.text}</p>
              {question.type === 'scale' ? (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      variant={responses[question.id] === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleResponse(question.id, value)}
                      className={responses[question.id] === value 
                        ? "bg-blue-500 text-white" 
                        : "border-slate-600 text-slate-300"
                      }
                    >
                      {value}
                    </Button>
                  ))}
                  <div className="ml-2 text-xs text-slate-400 self-center">
                    (1=Very Low, 5=Very High)
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant={responses[question.id] === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleResponse(question.id, true)}
                    className={responses[question.id] === true 
                      ? "bg-red-500 text-white" 
                      : "border-slate-600 text-slate-300"
                    }
                  >
                    Yes
                  </Button>
                  <Button
                    variant={responses[question.id] === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleResponse(question.id, false)}
                    className={responses[question.id] === false 
                      ? "bg-green-500 text-white" 
                      : "border-slate-600 text-slate-300"
                    }
                  >
                    No
                  </Button>
                </div>
              )}
            </div>
          ))}

          {Object.keys(responses).length === questions.length && (
            <Alert className={canSafelyContinue() 
              ? "border-green-500/30 bg-green-500/10" 
              : "border-red-500/30 bg-red-500/10"
            }>
              {canSafelyContinue() ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
              <AlertDescription className={canSafelyContinue() ? "text-green-300" : "text-red-300"}>
                {canSafelyContinue() 
                  ? "You appear to be doing well. Continue monitoring your health."
                  : "Based on your responses, we recommend stopping your fast and consulting a healthcare provider."
                }
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            {canSafelyContinue() ? (
              <Button
                onClick={onClose}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Continue Fast
              </Button>
            ) : (
              <Button
                onClick={onEmergencyStop}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Stop Fast Now
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}