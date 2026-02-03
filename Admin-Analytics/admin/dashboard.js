document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchLogs');
    fetchButton.addEventListener('click', fetchUserLogs);
  });
  
  async function fetchUserLogs() {
    try {
      const date = document.getElementById('dateFilter').value || new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/admin/logs?date=${date}`);
      const data = await response.json();
      const logs = formatLogs(data.logs);
      document.getElementById('logContainer').innerHTML = logs;
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      document.getElementById('logContainer').innerHTML = '<p class="error">Failed to load logs</p>';
    }
  }
  
  function formatLogs(logs) {
    if (!logs || logs.length === 0) {
      return '<p>No logs found for the selected date.</p>';
    }
    
    let formattedLogs = '<div class="log-entries">';
    logs.forEach(log => {
      formattedLogs += `
        <div class="log-entry">
          <div class="log-time">${new Date(log.timestamp).toLocaleTimeString()}</div>
          <div class="log-user">User: ${log.userId}</div>
          <div class="log-query">Query: ${log.query}</div>
        </div>
      `;
    });
    formattedLogs += '</div>';
    return formattedLogs;
  }