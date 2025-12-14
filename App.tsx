import React, { useState, useEffect, useMemo } from 'react';
import { UnitSystem, BMICategory, BMIResult, UserInput, HealthAdvice } from './types';
import BMIGauge from './components/BMIGauge';
import AdviceCard from './components/AdviceCard';
import { fetchHealthAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(UnitSystem.METRIC);
  const [inputs, setInputs] = useState<UserInput>({
    heightCm: '',
    weightKg: '',
    heightFt: '',
    heightIn: '',
    weightLbs: '',
  });
  
  const [result, setResult] = useState<BMIResult | null>(null);
  const [advice, setAdvice] = useState<HealthAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Constants for calculation
  const CM_TO_M = 0.01;
  const IN_TO_M = 0.0254;
  const LBS_TO_KG = 0.453592;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return;
    
    setInputs(prev => ({ ...prev, [name]: value }));
    // Reset advice when inputs change significantly to encourage re-generation for new context
    if (advice) setAdvice(null);
  };

  const calculateBMI = useMemo(() => {
    let heightM = 0;
    let weightKg = 0;

    if (unitSystem === UnitSystem.METRIC) {
      if (!inputs.heightCm || !inputs.weightKg) return null;
      heightM = parseFloat(inputs.heightCm) * CM_TO_M;
      weightKg = parseFloat(inputs.weightKg);
    } else {
      if (!inputs.heightFt || !inputs.weightLbs) return null;
      const ft = parseFloat(inputs.heightFt);
      const inches = inputs.heightIn ? parseFloat(inputs.heightIn) : 0;
      heightM = ((ft * 12) + inches) * IN_TO_M;
      weightKg = parseFloat(inputs.weightLbs) * LBS_TO_KG;
    }

    if (heightM <= 0 || weightKg <= 0) return null;

    const bmiValue = weightKg / (heightM * heightM);
    
    let category = BMICategory.NORMAL;
    let color = '#22c55e'; // green-500

    if (bmiValue < 18.5) {
      category = BMICategory.UNDERWEIGHT;
      color = '#3b82f6'; // blue-500
    } else if (bmiValue < 25) {
      category = BMICategory.NORMAL;
      color = '#22c55e'; // green-500
    } else if (bmiValue < 30) {
      category = BMICategory.OVERWEIGHT;
      color = '#eab308'; // yellow-500
    } else {
      category = BMICategory.OBESE;
      color = '#ef4444'; // red-500
    }

    return { bmi: bmiValue, category, color };
  }, [inputs, unitSystem]);

  useEffect(() => {
    setResult(calculateBMI);
  }, [calculateBMI]);

  const handleGenerateAdvice = async () => {
    if (!result) return;
    
    setLoadingAdvice(true);
    const data = await fetchHealthAdvice(result.bmi, result.category);
    setAdvice(data);
    setLoadingAdvice(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">BMI Calculator</h1>
          <p className="text-indigo-200 text-sm mt-1">Check your body mass index</p>
        </div>

        {/* Unit Toggle */}
        <div className="p-6 pb-2">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button
              onClick={() => setUnitSystem(UnitSystem.METRIC)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                unitSystem === UnitSystem.METRIC 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Metric (cm/kg)
            </button>
            <button
              onClick={() => setUnitSystem(UnitSystem.IMPERIAL)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                unitSystem === UnitSystem.IMPERIAL 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Imperial (ft/lbs)
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="px-6 space-y-4">
          {unitSystem === UnitSystem.METRIC ? (
            <>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="heightCm"
                    value={inputs.heightCm}
                    onChange={handleInputChange}
                    placeholder="175"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-medium rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weightKg"
                    value={inputs.weightKg}
                    onChange={handleInputChange}
                    placeholder="70"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-medium rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-4">
                 <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Height</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="heightFt"
                      value={inputs.heightFt}
                      onChange={handleInputChange}
                      placeholder="ft"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-medium rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                    />
                     <input
                      type="number"
                      name="heightIn"
                      value={inputs.heightIn}
                      onChange={handleInputChange}
                      placeholder="in"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-medium rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weightLbs"
                    value={inputs.weightLbs}
                    onChange={handleInputChange}
                    placeholder="150"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg font-medium rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Result Area */}
        <div className="p-6">
          {result ? (
            <div className="animate-fadeIn">
              <BMIGauge 
                bmi={result.bmi} 
                category={result.category} 
                color={result.color} 
              />
              
              <AdviceCard 
                advice={advice} 
                loading={loadingAdvice} 
                onGenerate={handleGenerateAdvice}
                hasResult={!!result}
              />
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
               </svg>
               <p className="text-sm font-medium">Enter your details to calculate BMI</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
