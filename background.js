
chrome.runtime.onInstalled.addListener(() => {
    console.log('TimeSphere installed');
    
    // Initialize storage with default settings
    chrome.storage.sync.set({
      tasks: [],
      settings: {
        theme: 'light',
        notificationsEnabled: true,
        pomodoroSettings: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4
        }
      },
      stats: {
        focusScores: [65, 78, 52, 91, 85, 60, 75],
        tasksCompleted: [4, 6, 3, 7, 5, 2, 4],
        timeSpent: 840 // minutes
      }
    });
    
    // Create alarm for daily stats calculation
    chrome.alarms.create('calculateDailyStats', {
      periodInMinutes: 1440 // Once per day
    });
  });
  
  // Handle alarm events
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'calculateDailyStats') {
      calculateAndUpdateStats();
    }
  });
  
  // Calculate and update daily statistics
  function calculateAndUpdateStats() {
    chrome.storage.sync.get(['tasks', 'stats'], (data) => {
      const completedToday = data.tasks.filter(task => 
        task.completed && isToday(new Date(task.completedDate))
      ).length;
      
      const timeSpentToday = data.tasks.reduce((total, task) => {
        if (task.completed && isToday(new Date(task.completedDate))) {
          return total + (task.actualTime || task.estimatedTime);
        }
        return total;
      }, 0);
      
      // Calculate focus score based on completion rate and time efficiency
      const focusScore = Math.min(100, Math.round(completedToday * 15 + (timeSpentToday / 60) * 5));
      
      // Update stats
      const newStats = {
        focusScores: [...data.stats.focusScores.slice(1), focusScore],
        tasksCompleted: [...data.stats.tasksCompleted.slice(1), completedToday],
        timeSpent: data.stats.timeSpent + timeSpentToday
      };
      
      chrome.storage.sync.set({ stats: newStats });
      
      // Send notification
      if (completedToday > 0) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon128.png',
          title: 'Daily Summary',
          message: `You completed ${completedToday} tasks today with a focus score of ${focusScore}.`,
          buttons: [{ title: 'View Details' }]
        });
      }
    });
  }
  
  function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
  
  // Handle message passing
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getStats') {
      chrome.storage.sync.get('stats', (data) => {
        sendResponse({ stats: data.stats });
      });
      return true; // Required for async response
    }
  });