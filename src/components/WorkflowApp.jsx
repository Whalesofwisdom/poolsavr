import { useState } from 'react';
import { MeasurementsProvider } from '@/contexts/MeasurementsContext';
import MapContainer from './MapContainer';
import PoolCalculator from './calculators/PoolCalculator';
import SpaCalculator from './calculators/SpaCalculator';
import PricingTool from './pricing/PricingTool';
import QuoteExport from './export/QuoteExport';

export default function WorkflowApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showExport, setShowExport] = useState(false);

  return (
    <MeasurementsProvider>
      <div className="min-h-screen bg-background">
        {/* Step Indicator */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* Step 1 */}
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center gap-2 ${
                    currentStep === 1 ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep === 1 ? 'border-primary bg-primary text-white' : 'border-gray-300'
                  }`}>
                    1
                  </div>
                  <span>Map Measurement</span>
                </button>

                {/* Step 2 */}
                <button
                  onClick={() => setCurrentStep(2)}
                  className={`flex items-center gap-2 ${
                    currentStep === 2 ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep === 2 ? 'border-primary bg-primary text-white' : 'border-gray-300'
                  }`}>
                    2
                  </div>
                  <span>Calculators</span>
                </button>

                {/* Step 3 */}
                <button
                  onClick={() => setCurrentStep(3)}
                  className={`flex items-center gap-2 ${
                    currentStep === 3 ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep === 3 ? 'border-primary bg-primary text-white' : 'border-gray-300'
                  }`}>
                    3
                  </div>
                  <span>Pricing</span>
                </button>
              </div>

              <div className="text-sm font-bold text-primary">
                Pool Remodel Takeoff Tool
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          {/* Step 1: Map Drawing */}
          {currentStep === 1 && (
            <div className="h-[calc(100vh-80px)]">
              <MapContainer />
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1002]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-primary/90"
                >
                  Continue to Calculators →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Calculators */}
          {currentStep === 2 && (
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Calculate Internal Area (IA)</h1>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Pool Calculator</h2>
                    <PoolCalculator />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Spa Calculator (Optional)</h2>
                    <SpaCalculator />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    ← Back to Map
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90"
                  >
                    Continue to Pricing →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing Tool */}
          {currentStep === 3 && !showExport && (
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">Select Services & Generate Quote</h1>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    ← Back to Calculators
                  </button>
                </div>

                <PricingTool
                  onGenerateQuote={(services) => {
                    setSelectedServices(services);
                    setShowExport(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* Quote Export View */}
          {currentStep === 3 && showExport && (
            <QuoteExport
              selectedServices={selectedServices}
              onBack={() => setShowExport(false)}
            />
          )}
        </div>
      </div>
    </MeasurementsProvider>
  );
}
