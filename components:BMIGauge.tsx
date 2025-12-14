import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BMIResult, BMICategory } from '../types';

interface BMIGaugeProps {
  bmi: number;
  category: BMICategory;
  color: string;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi, category, color }) => {
  // Cap the BMI for visual purposes so the chart doesn't look broken if BMI is extreme
  const visualBMI = Math.min(Math.max(bmi, 10), 40);
  
  // Normalize BMI to a percentage (0-100) for the gauge range (10 to 40)
  // 10 is 0%, 40 is 100%
  const percentage = ((visualBMI - 10) / (40 - 10)) * 100;

  const data = [
    {
      name: 'BMI',
      value: percentage,
      fill: color,
    },
  ];

  return (
    <div className="w-full h-64 relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="80%" // Move center down to create a semi-circle effect
          innerRadius="70%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: '#e2e8f0' }}
            dataKey="value"
            cornerRadius={10}
            label={false}
          />
          <Tooltip 
             cursor={false}
             content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-slate-200 shadow-sm rounded text-xs text-slate-600">
                      BMI: {bmi.toFixed(1)}
                    </div>
                  );
                }
                return null;
             }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      {/* Centered Text Overlay */}
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-5xl font-bold text-slate-800 tracking-tighter">
          {bmi.toFixed(1)}
        </div>
        <div className="text-sm font-medium mt-1 px-3 py-1 rounded-full text-white inline-block shadow-sm" style={{ backgroundColor: color }}>
          {category}
        </div>
      </div>

      <div className="absolute bottom-4 w-full flex justify-between px-8 text-xs text-slate-400 font-medium">
        <span>10</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40+</span>
      </div>
    </div>
  );
};

export default BMIGauge;
