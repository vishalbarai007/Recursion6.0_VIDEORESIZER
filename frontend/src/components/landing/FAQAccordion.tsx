import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does the AI video resizing work?",
    answer:
      "Our AI analyzes your video content to identify the most important elements and subjects. It then intelligently crops and resizes your video to fit different aspect ratios while keeping the key content in frame. The AI is trained on thousands of videos to understand visual composition and subject tracking.",
  },
  {
    question: "What video formats are supported?",
    answer:
      "We support all major video formats including MP4, MOV, AVI, WMV, FLV, and more. Our system can convert between these formats while optimizing for quality and file size based on your target platform.",
  },
  {
    question: "How long does processing take?",
    answer:
      "Processing time depends on your video length, resolution, and our current server load. Most videos under 5 minutes are processed within 2-5 minutes. Longer videos or 4K+ content may take longer. Pro and Business plans receive priority processing.",
  },
  {
    question: "Can I customize how my video is cropped?",
    answer:
      "Yes! While our AI automatically suggests the best crop, you can always preview and adjust the framing before finalizing. The dashboard includes an interactive editor where you can fine-tune the positioning for each platform.",
  },
  {
    question: "Is there a limit to file size or video length?",
    answer:
      "Free accounts can upload videos up to 500MB and 10 minutes in length. Pro accounts extend this to 2GB and 30 minutes, while Business accounts can process videos up to 10GB and 2 hours in length.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg bg-white overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left text-xl font-semibold"
              >
                {faq.question}
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openIndex === index && (
                <p className="p-6 text-gray-600 border-t border-gray-200">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
