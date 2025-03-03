
// content.js
// This script runs on web pages to detect user activity patterns

// Track time spent on different websites
let startTime = Date.now();
let activeTime = 0;
let lastActivity = Date.now();
let isActive = true;

// Activity detection events
const activityEvents = ['mousedown', 'keydown', 'mousemove', 'wheel', 'scroll'];

activityEvents.forEach(event => {
  document.addEventListener(event, () => {
    if (!isActive) {
      isActive = true;
    }
    lastActivity = Date.now();
  });
});

// Check for inactivity every 5 seconds
setInterval(() => {
  const now = Date.now();
  if (isActive && now - lastActivity > 60000) { // 1 minute threshold
    isActive = false;
  }
  
  if (isActive) {
    activeTime += 5;
  }
}, 5000);

// When user leaves the page
window.addEventListener('beforeunload', () => {
  const data = {
    url: window.location.hostname,
    timeSpent: Math.round(activeTime),
    timestamp: new Date().toISOString()
  };
  
  // Send the activity data to background script
  chrome.runtime.sendMessage({
    action: 'logActivity',
    data: data
  });
});

// Contextual task suggestions
// This would analyze the content of the page to suggest related tasks
function analyzePageContent() {
  // Extract important text elements
  const title = document.title;
  const h1Elements = Array.from(document.querySelectorAll('h1')).map(el => el.textContent);
  const h2Elements = Array.from(document.querySelectorAll('h2')).map(el => el.textContent);
  
  // Extract keywords
  const content = [title, ...h1Elements, ...h2Elements].join(' ').toLowerCase();
  const keywords = extractKeywords(content);
  
  // If sufficient keywords are found, suggest a task
  if (keywords.length > 2) {
    suggestTask(keywords);
  }
}

function extractKeywords(text) {
  // Simple keyword extraction - would be more sophisticated in a real extension
  const commonWords = ['the', 'and', 'or', 'but', 'this', 'that', 'with', 'for', 'how', 'why'];
  
  return text.split(/\s+/)
    .map(word => word.replace(/[^\w]/g, '').toLowerCase())
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 5);
}

function suggestTask(keywords) {
  const taskName = `Review: ${keywords.slice(0, 3).join(', ')}`;
  
  chrome.runtime.sendMessage({
    action: 'suggestTask',
    data: {
      name: taskName,
      description: `Based on your browsing activity at ${window.location.hostname}`,
      estimatedTime: 30,
      url: window.location.href,
      priority: 'medium'
    }
  });
}

// Run page analysis after the page has fully loaded
window.addEventListener('load', () => {
  setTimeout(analyzePageContent, 3000); // Delay to ensure dynamic content is loaded
});