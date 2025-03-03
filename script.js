document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timelineContainer = document.getElementById('timeline');
    const modal = document.getElementById('event-modal');
    const modalContent = document.getElementById('modal-content-container');
    const closeButton = document.querySelector('.close-button');
    
    // Fetch timeline data from events.json
    fetchTimelineData();
    
    // Event Listeners
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Fetch timeline data from JSON file
    async function fetchTimelineData() {
        try {
            const response = await fetch('events.json');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch timeline data: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Sort events by date (chronological order)
            const sortedEvents = data.events.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            
            // Remove loader and render timeline
            timelineContainer.innerHTML = '';
            renderTimeline(sortedEvents);
            
        } catch (error) {
            console.error('Error fetching timeline data:', error);
            timelineContainer.innerHTML = `
                <div class="error-message">
                    <p>Unable to load our memories. Please try again later.</p>
                </div>
            `;
        }
    }
    
    // Render timeline with event data
    function renderTimeline(events) {
        events.forEach(event => {
            const eventElement = createTimelineEvent(event);
            timelineContainer.appendChild(eventElement);
        });
    }
    
    // Create a single timeline event element
    function createTimelineEvent(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'timeline-event';
        
        // Format the date to a more readable format
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create HTML content for the event
        eventElement.innerHTML = `
            <div class="timeline-point"></div>
            <div class="timeline-content" data-event-id="${event.id}">
                <div class="timeline-date">${formattedDate}</div>
                <h3 class="timeline-title">${event.title}</h3>
                <p class="timeline-description">${event.description}</p>
                ${event.image ? `<img src="${event.image}" alt="${event.title}" class="timeline-image">` : ''}
            </div>
        `;
        
        // Add click event to show detailed view
        const timelineContent = eventElement.querySelector('.timeline-content');
        timelineContent.addEventListener('click', () => {
            openEventDetails(event, formattedDate);
        });
        
        return eventElement;
    }
    
    // Open modal with event details
    function openEventDetails(event, formattedDate) {
        modalContent.innerHTML = `
            ${event.image ? `<img src="${event.image}" alt="${event.title}" class="modal-image">` : ''}
            <p class="modal-date">${formattedDate}</p>
            <h2 class="modal-title">${event.title}</h2>
            <p class="modal-description">${event.detailedDescription || event.description}</p>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
    
    // Handle keyboard navigation (Escape key to close modal)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});