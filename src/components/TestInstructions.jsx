import React from 'react';
import { Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function TestInstructions({ onStart, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Test Instructions</h2>
          <p className="text-gray-600 mt-1">Please read carefully before starting</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Test Duration</h3>
            </div>
            <p className="text-blue-800 text-sm">
              You have <strong>25 minutes</strong> to complete all 25 questions. The timer will be visible throughout the test.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Important Guidelines</h3>
            </div>
            <ul className="text-amber-800 text-sm space-y-1">
              <li>• Each question carries equal marks</li>
              <li>• There is no negative marking</li>
              <li>• You can navigate between questions using the sidebar</li>
              <li>• Mark questions for review using the flag button</li>
              <li>• Test will auto-submit when time expires</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Question Distribution</h3>
            </div>
            <div className="text-green-800 text-sm space-y-1">
              <p>• <strong>Quantitative Aptitude:</strong> 15 questions (60%)</p>
              <p>• <strong>Logical Reasoning:</strong> 8 questions (30%)</p>
              <p>• <strong>Verbal Ability:</strong> 2 questions (10%)</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Test Environment</h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Ensure stable internet connection</li>
              <li>• Use a quiet environment without distractions</li>
              <li>• Do not refresh or close the browser tab</li>
              <li>• Calculator is not allowed (mental calculation only)</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={onStart}
            className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Start Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}