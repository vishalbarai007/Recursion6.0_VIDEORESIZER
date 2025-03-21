// src/components/Pricing.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["5 video conversions per month", "Basic platform templates", "720p max resolution", "Standard processing speed"],
    buttonText: "Get Started",
    redirect: "/login",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For content creators",
    features: ["50 video conversions per month", "All platform templates", "4K resolution support", "Faster processing", "Batch processing"],
    buttonText: "Subscribe Now",
    redirect: "/subscribe",
  },
  {
    name: "Business",
    price: "$49",
    description: "For teams and agencies",
    features: ["Unlimited video conversions", "Custom templates", "8K resolution support", "Priority processing", "Advanced batch processing", "API access"],
    buttonText: "Contact Sales",
    redirect: "/subscribe",
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">Choose the plan that works best for your video content needs</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-xl p-8 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col ${
                selectedPlan === plan.name ? "border-blue-600" : "border-gray-200"
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-500 mb-4">{plan.description}</p>
              <div className="text-4xl font-bold mb-6">
                {plan.price}
                <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <ul className="text-left space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors mt-auto"
                onClick={() => navigate(plan.redirect)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
