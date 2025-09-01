import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, Clock, BookOpen, Users, Target } from 'lucide-react';

const faqData = [
  {
    category: 'General',
    icon: HelpCircle,
    questions: [
      {
        question: "What is TCS Digital?",
        answer: "TCS Digital is an aptitude test conducted by Tata Consultancy Services as part of their recruitment process. It consists of quantitative aptitude, logical reasoning, and verbal ability sections."
      },
      {
        question: "How many questions are there in the TCS Digital test?",
        answer: "The TCS Digital test typically contains 25 questions with a time limit of 25 minutes. The distribution is approximately 60% quantitative, 30% logical, and 10% verbal questions."
      },
      {
        question: "Is there negative marking in TCS Digital?",
        answer: "No, there is no negative marking in the TCS Digital aptitude test. You can attempt all questions without worrying about losing marks for incorrect answers."
      }
    ]
  },
  {
    category: 'Test Format',
    icon: Target,
    questions: [
      {
        question: "What is the time duration for each section?",
        answer: "There are no separate time limits for individual sections. You have a total of 25 minutes to complete all 25 questions, and you can allocate time as needed across all sections."
      },
      {
        question: "Can I go back to previous questions?",
        answer: "Yes, you can navigate between questions freely during the test. You can mark questions for review and return to them later before submitting."
      },
      {
        question: "What happens if the test auto-submits due to time expiry?",
        answer: "If the 25-minute timer expires, the test will automatically submit with whatever answers you have provided. Make sure to manage your time effectively."
      }
    ]
  },
  {
    category: 'Preparation',
    icon: BookOpen,
    questions: [
      {
        question: "How should I prepare for quantitative aptitude?",
        answer: "Focus on fundamental concepts of arithmetic, algebra, geometry, and data interpretation. Practice mental calculations and time-based problem solving. Key topics include percentages, profit & loss, time & work, and probability."
      },
      {
        question: "What topics are covered in logical reasoning?",
        answer: "Logical reasoning includes coding-decoding, blood relations, direction sense, series completion, analogies, and pattern recognition. Practice different types of logical puzzles regularly."
      },
      {
        question: "How can I improve my speed and accuracy?",
        answer: "Regular practice with time constraints is key. Use our simulation tests to get familiar with the actual test environment. Focus on elimination techniques and identifying question patterns."
      }
    ]
  },
  {
    category: 'Technical',
    icon: Clock,
    questions: [
      {
        question: "What browser should I use for the test?",
        answer: "Use modern browsers like Chrome, Firefox, Safari, or Edge. Ensure JavaScript is enabled and you have a stable internet connection."
      },
      {
        question: "Can I use a calculator during the test?",
        answer: "No, calculators are not allowed in the TCS Digital test. You need to rely on mental calculations and basic arithmetic skills."
      },
      {
        question: "What if I face technical issues during the test?",
        answer: "If you encounter technical issues, don't panic. The test platform usually saves your progress automatically. Contact support immediately if problems persist."
      }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about TCS Digital preparation and our platform
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={category.category} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-bold text-white">{category.category}</h2>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {category.questions.map((item, questionIndex) => {
                    const isOpen = openItems.has(`${categoryIndex}-${questionIndex}`);
                    return (
                      <div key={questionIndex}>
                        <button
                          onClick={() => toggleItem(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFAQ.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              Try searching with different keywords or browse all categories
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 mt-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-primary-100 mb-6">
            Can't find the answer you're looking for? Join our discussion forum to get help from the community.
          </p>
          <button
            onClick={() => window.location.href = '/forum'}
            className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Users className="h-5 w-5" />
            <span>Join Discussion Forum</span>
          </button>
        </div>
      </div>
    </div>
  );
}