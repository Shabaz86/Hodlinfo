async function fetchData() {
    try {
      const response = await fetch('/api/tickers');
      const result = await response.json();
  
      if (result.success) {
        const data = result.tickers;
        const tbody = document.querySelector('#ticker-data');
        tbody.innerHTML = ''; // Clear existing rows
  
        data.forEach((ticker, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${ticker.name}</td>
            <td>₹ ${ticker.last}</td>
            <td>₹ ${ticker.buy} / ₹ ${ticker.sell}</td>
            <td>${ticker.volume}</td>
            <td>${ticker.base_unit}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        throw new Error('Failed to fetch tickers data');
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'An error occurred while fetching data. Please try again later.';
      errorMessage.classList.add('error-message');
      document.querySelector('#ticker-data').parentNode.insertBefore(errorMessage, document.querySelector('#ticker-data'));
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchData();
  });
  