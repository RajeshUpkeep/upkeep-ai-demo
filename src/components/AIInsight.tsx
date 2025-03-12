import React, { useState } from 'react';
import Link from 'next/link';

interface AIInsightProps {
  issue: string;
  rootCause?: string;
  suggestedAction?: string;
  onActionClick?: () => void;
  onViewAffectedItems?: () => void;
  affectedItemsCount?: number;
  loading?: boolean;
  onSkip?: () => void;
  insightNumber?: number;
  totalInsights?: number;
}

const AIInsight: React.FC<AIInsightProps> = ({
  issue,
  rootCause,
  suggestedAction,
  onActionClick,
  onViewAffectedItems,
  affectedItemsCount = 0,
  loading = false,
  onSkip,
  insightNumber = 1,
  totalInsights = 1,
}) => {
  // State to track if cause is shown
  const [showCause, setShowCause] = useState(false);
  // State to track if action is shown
  const [showAction, setShowAction] = useState(false);
  // State to track if action is completed
  const [actionCompleted, setActionCompleted] = useState(false);
  // Animation for the AI thinking effect
  const [dots, setDots] = useState('');

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Handle Why button click
  const handleWhyClick = () => {
    setShowCause(true);
    // After showing cause, automatically show action after a delay
    if (suggestedAction) {
      setTimeout(() => {
        setShowAction(true);
      }, 1000);
    }
  };

  // Handle Apply Fix button click
  const handleApplyFix = () => {
    if (onActionClick) {
      onActionClick();
      // Show loading state briefly before showing success message
      setTimeout(() => {
        setActionCompleted(true);
      }, 2000);
    }
  };

  // Handle view affected items click
  const handleViewAffectedItems = () => {
    if (onViewAffectedItems) {
      onViewAffectedItems();
    }
  };

  // Handle skip button click
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  // Function to parse text and create links for workers and locations
  const parseTextWithLinks = (text: string) => {
    if (!text) return null;

    // Regular expressions to match worker IDs and location names
    const workerRegex = /\b(W\d{3})\b/g; // Matches worker IDs like W001, W010, etc.
    const locationRegex = /(Anaheim Production|San Diego Plant|Los Angeles Facility)/g;
    
    // Split the text by worker IDs and location names
    const parts = [];
    let lastIndex = 0;
    
    // First, find all matches and their positions
    const matches = [];
    
    // Find worker ID matches
    let workerMatch;
    while ((workerMatch = workerRegex.exec(text)) !== null) {
      matches.push({
        start: workerMatch.index,
        end: workerMatch.index + workerMatch[0].length,
        text: workerMatch[0],
        type: 'worker'
      });
    }
    
    // Find location matches
    let locationMatch;
    while ((locationMatch = locationRegex.exec(text)) !== null) {
      matches.push({
        start: locationMatch.index,
        end: locationMatch.index + locationMatch[0].length,
        text: locationMatch[0],
        type: 'location'
      });
    }
    
    // Sort matches by their starting position
    matches.sort((a, b) => a.start - b.start);
    
    // Build the result with links
    for (const match of matches) {
      // Add text before the match
      if (match.start > lastIndex) {
        parts.push(text.substring(lastIndex, match.start));
      }
      
      // Add the link based on match type
      if (match.type === 'worker') {
        parts.push(
          <Link 
            key={`worker-${match.start}`}
            href={`/workers?name=${match.text}`}
            target="_blank"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {match.text}
          </Link>
        );
      } else if (match.type === 'location') {
        parts.push(
          <Link 
            key={`location-${match.start}`}
            href={`/locations?name=${encodeURIComponent(match.text.toLowerCase())}`}
            target="_blank"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {match.text}
          </Link>
        );
      }
      
      lastIndex = match.end;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            AI
          </div>
          <div>
            <h3 className="font-medium text-lg">UpKeep AI Assistant</h3>
            <p className="text-xs text-gray-500">Analyzing your maintenance data</p>
          </div>
        </div>
        <div className="flex items-center">
          {totalInsights > 1 && (
            <span className="text-sm text-gray-500 mr-3">
              Insight {insightNumber} of {totalInsights}
            </span>
          )}
          {onSkip && (
            <button
              onClick={handleSkip}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Issue Identification */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-2">
              1
            </div>
            <h4 className="font-medium">Issue Identified</h4>
          </div>
          {rootCause && !showCause && (
            <button
              onClick={handleWhyClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Why?
            </button>
          )}
        </div>
        <div className="pl-8">
          <p className="text-gray-700">
            {parseTextWithLinks(issue)}
            {affectedItemsCount > 0 && onViewAffectedItems && (
              <button 
                onClick={handleViewAffectedItems}
                className="ml-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                View affected work orders
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Root Cause Analysis */}
      {showCause && rootCause && (
        <div className="mb-4 animate-fadeIn">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-2">
              2
            </div>
            <h4 className="font-medium">Root Cause</h4>
          </div>
          <div className="pl-8">
            {loading ? (
              <p className="text-gray-500">Analyzing data{dots}</p>
            ) : (
              <p className="text-gray-700">{parseTextWithLinks(rootCause)}</p>
            )}
          </div>
        </div>
      )}

      {/* Suggested Action */}
      {showAction && suggestedAction && (
        <div className="mb-4 animate-fadeIn">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-2">
              3
            </div>
            <h4 className="font-medium">Suggested Action</h4>
          </div>
          <div className="pl-8">
            {loading ? (
              <p className="text-gray-500">Generating recommendations{dots}</p>
            ) : actionCompleted ? (
              <div className="bg-green-100 text-green-800 p-3 rounded-md animate-fadeIn">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">Action completed successfully!</p>
                </div>
                <p className="mt-1 text-sm">
                  {parseTextWithLinks("Joe Technician (W010) has been assigned to the overdue work orders at Anaheim Production. The work orders have been updated.")}
                </p>
                {onViewAffectedItems && (
                  <button 
                    onClick={handleViewAffectedItems}
                    className="mt-2 text-green-800 hover:text-green-900 hover:underline font-medium text-sm"
                  >
                    View updated work orders
                  </button>
                )}
                {onSkip && (
                  <button 
                    onClick={handleSkip}
                    className="mt-2 ml-3 text-green-800 hover:text-green-900 hover:underline font-medium text-sm"
                  >
                    Next insight
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-3">{parseTextWithLinks(suggestedAction)}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleApplyFix}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Fix
                  </button>
                  {onViewAffectedItems && (
                    <button 
                      onClick={handleViewAffectedItems}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      View Work Orders
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-pulse flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsight; 