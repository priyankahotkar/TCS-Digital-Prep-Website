import React, { useState } from 'react';
import { MessageSquare, Plus, Search, ThumbsUp, MessageCircle, Clock, User, Filter } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for demonstration
const mockTopics = [
  {
    id: 1,
    title: "Tips for solving Time and Work problems quickly",
    author: "StudyBuddy23",
    category: "Quantitative",
    replies: 15,
    likes: 8,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    solved: true,
  },
  {
    id: 2,
    title: "Difficulty with coding pattern questions",
    author: "CodeSeeker",
    category: "Logical",
    replies: 7,
    likes: 3,
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
    solved: false,
  },
  {
    id: 3,
    title: "Best strategy for time management in TCS Digital test",
    author: "TestMaster",
    category: "General",
    replies: 23,
    likes: 12,
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    solved: true,
  },
  {
    id: 4,
    title: "Verbal ability: How to improve reading comprehension speed?",
    author: "QuickReader",
    category: "Verbal",
    replies: 9,
    likes: 5,
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    solved: false,
  },
];

export default function Forum() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  const categories = ['All', 'General', 'Quantitative', 'Logical', 'Verbal'];

  const filteredTopics = mockTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Quantitative': return 'bg-blue-100 text-blue-700';
      case 'Logical': return 'bg-purple-100 text-purple-700';
      case 'Verbal': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussion Forum</h1>
              <p className="text-gray-600">Connect with fellow students and get help with your preparation</p>
            </div>
            <button
              onClick={() => setShowNewTopicModal(true)}
              className="mt-4 sm:mt-0 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Topic</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {filteredTopics.map(topic => (
            <div key={topic.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200">
                        {topic.title}
                      </h3>
                      {topic.solved && (
                        <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
                          Solved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{topic.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(topic.lastActivity, 'MMM dd, HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                    {topic.category}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{topic.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{topic.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to start a discussion!'
              }
            </p>
            <button
              onClick={() => setShowNewTopicModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Start New Topic
            </button>
          </div>
        )}

        {/* New Topic Modal */}
        {showNewTopicModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Topic</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Enter your topic title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>General</option>
                    <option>Quantitative</option>
                    <option>Logical</option>
                    <option>Verbal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your question or topic in detail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNewTopicModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200">
                  Create Topic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}